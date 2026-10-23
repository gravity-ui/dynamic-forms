# Playwright component tests

`npm run playwright` runs both the existing DynamicField / DynamicView suite and
new SchemaRenderer tests. SchemaRenderer is imported from `src/unstable.ts`; this
branch uses the dependencies of main, including UIKit 7.

```sh
npm run playwright:schema  # SchemaRenderer only
npm run playwright:legacy  # Existing DynamicField / DynamicView only
npm run playwright        # Both suites, as in CI
```

## Where a test lives

Tests and fixtures belong to the component they exercise. For example:

```text
src/lib/unstable/kit/form-entities/StringInput/
  StringInput.tsx
  __tests__/
    StringInput.visual.test.tsx
    helpers.ts
  __snapshots__/
    StringInput.visual.test.tsx-snapshots/
      ...-light-chromium-linux.png
      ...-dark-chromium-linux.png
      ...-light-webkit-linux.png
      ...-dark-webkit-linux.png
```

Overview components have their own suites in `overview-entities`. Components
shared by Form and Overview are tested in both modes in `entities`. Layout tests
are next to the corresponding layout.

## How a test runs

1. Playwright collects `**/__tests__/*.visual.test.tsx` and runs each scenario in
   Chromium and WebKit. Vite builds the React fixtures for the browser.
2. `playwright/playwright/index.tsx` provides UIKit theme/mobile/toaster context.
3. `mount` from `~playwright/core` adds the screenshot wrapper. The test passes
   its schema, value and explicit settings to `SchemaForm`.
4. `SchemaForm` creates a real Final Form and renders the real SchemaRenderer
   with the kit config, error messages and field name `input`. It does not set
   fallback values for size, view, mode, value, width or renderer settings.
5. The scenario checks a visible control/value and, for interactions, the form
   state. Hidden `form-value` and `form-value-type` outputs expose the actual Final Form
   value and distinguish Date, DateTime, strings and other values. They are not
   part of the screenshot.
6. `expectScreenshot` switches to light and dark themes, waits for each theme,
   captures the component and compares it with that component's Linux reference.
   Popups stay in their real portals, but fit within the grid's screenshot bounds.

`SchemaFormProps` makes the renderer settings required at compile time. A test
must explicitly provide `size`, `view`, `mode`, `coerceInitialValues`,
`jsonDefaultValues`, `validateOnBlur`, `userContext`, `value`, `width` and
`showSubmit`. `validateOnBlur` is passed to both Final Form and SchemaRenderer.
A value of `undefined` is allowed, but must be written explicitly.

Monaco has a local browser fixture that supplies the real MonacoEditor and its
workers through userContext; the editor is not mocked.

Data-only helpers import runtime enums directly from `core/constants`. Importing
them through the full `core` barrel also loads browser components in the Node.js
test collector. Type-only imports can use the public exports because TypeScript
removes them from the runtime code.

## Coverage matrix

Each entity suite renders 32 labelled variants from
`playwright/core/schemaRendererVariants.ts` together in a four-column grid:

- Seven registered layouts: accordeon, card, cell, column, row, section,
  transparent; plus explicit `layout: undefined` (no layout).
- Every layout option is tested with all four sizes: s, m, l, xl.
- The view alternates between fit and stretch. Both views occur for every layout
  and every size. This is pairwise coverage, not all 64 layout × size × view
  combinations.
- Shared entities repeat the matrix in both Form and Overview. Form-only and
  Overview-only components use their respective mode.
- Dedicated layout suites check every size × view combination in each supported
  mode. Cell and transparent get distinct empty-value checks.

`SchemaFormGrid` and `SchemaFormCase` arrange independent forms and label their
settings. They do not supply default renderer props. Each test still passes all
props explicitly and checks every cell before taking the screenshot. Composite
values must fit inside their own cell, not just somewhere inside the grid.

The same grid also contains labelled cells for specific props, empty/disabled
states, validation errors and results of interactions. Each cell has its own
explicit props. The test performs the relevant actions and assertions inside
that cell before capturing the whole grid. When a scenario has several visual
checkpoints, separate cells reproduce those checkpoints independently.

One grid produces four reference images: light/dark × Chromium/WebKit, instead
of four images per variant or state. Form and Overview have separate grids.
NumberInput, for example, has four images containing its 32 variants plus four
states: disabled, edited, empty and validation error. Tests and references remain
next to their components.

SelectInput and MultiSelectInput render their matrix with `entityProps.open: true`.
All menus are visible together, including a separate filtered example. Selection,
clearing and filtering still run on independent, uncontrolled cells: these checks
use the popup referenced by the control's `aria-controls`, rather than a global
option locator.

The calendar and color palette also have reserved cells in
the common grid. `spaceBelow` in `SchemaFormGrid` reserves room below
the form without changing the component or its portal. Helpers in `popupGrid.ts`
fit the viewport to the grid and check that each popup stays inside its own cell
and does not cover headings, labels, descriptions or controls. This prevents overlap with neighbouring
forms and menus. These components have four screenshots per supported mode;
Form and Overview remain separate.

Description tooltips keep four separate screenshots: their default placement
covers the field below the label, so putting them into a grid would hide content.
The expanded Monaco dialog also keeps four separate screenshots: it is a modal
over the page and cannot coexist with the other cells without covering them.
Functional checks can also remain separate, without additional screenshots.

A grid captures simultaneous states, rather than each intermediate focus/hover
appearance: browser focus can belong to only one cell at a time. The actions and
value assertions still run for every cell. This targets the components' own
behavior; it does not enumerate every inherited UIKit prop.

Grids explicitly use `scale: 'css'`: one image pixel per CSS pixel. This preserves
the controls' CSS sizes without producing oversized images at device scale 2;
the latter uses four times as many pixels and can exhaust memory during comparison.
SelectInput and MultiSelectInput also use `deviceScaleFactor: 1`: their tall viewport
with 33 open menus otherwise allocates large browser painting surfaces even when
the final screenshot is scaled to CSS pixels. Component sizes and props stay the same.

The test timeout includes mounting,
interactions and screenshots in both themes; it is not a per-click allowance.
CI uses four workers to bound memory consumption when the matrix includes Monaco.
Monaco scenarios run sequentially within each browser project: its grids mount
32 editor variants plus state examples, so Form and Overview must not compete
for resources. Monaco also renders at `deviceScaleFactor: 1` to avoid allocating
Retina-sized editor canvases; its CSS dimensions and tested props stay the same.

## Generate and verify screenshots

Use the same **Linux amd64** image as CI:
`mcr.microsoft.com/playwright:v1.40.0-jammy`. Do not generate macOS screenshots
under filenames ending in `linux`.

With Docker or Podman running, allocate about 6 GiB to its Linux VM for a
four-worker run. The component bundle also needs memory before browser workers
start, so reducing `--workers` alone does not prevent build-time heap errors.

The commands below pin the same four-worker parallelism used by CI:

```sh
# Generate only the new suite's references. Existing screenshots stay unchanged.
./scripts/playwright-docker.sh 'npm run playwright:schema -- --workers=4 --update-snapshots'

# Verify without changing any references.
./scripts/playwright-docker.sh 'npm run playwright:schema -- --workers=4'
./scripts/playwright-docker.sh 'npm run playwright -- --workers=4'
```

The script caches Linux node_modules separately. It runs `npm ci` when Playwright
is missing, the previous installation did not finish, or package-lock.json changes.
Use `npm run playwright:docker:clear-cache` to explicitly reset the cache.

On a Linux amd64 machine with Playwright browsers installed, the equivalent is:

```sh
npm ci
npm run playwright:schema -- --update-snapshots
npm run playwright:schema
```

Normal runs fail on missing or changed references. Only an explicit update
command writes references. Review generated images before committing them.
The HTML report lives in `playwright-report` (`playwright-report-docker` when
`IS_DOCKER=1`); CI uploads its report as an artifact.

To run one component, append its path, e.g.:

```sh
npm run playwright -- src/lib/unstable/kit/form-entities/StringInput/ --project=chromium
```

## Date and scale scenarios

DateInput covers the default ISO-string mode without an explicit `outputFormat`,
custom date patterns, Date, DateTime and timestamp outputs. The explicit
`outputFormat: 'string'` scenario is not included.

NumberWithScaleInput keeps its unit selector enabled when the numeric input is
disabled. The test switches units, verifies that the stored base value stays the
same and captures the disabled input before and after the switch. There are no
expected-failure annotations in these suites.
