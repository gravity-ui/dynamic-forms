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
are next to the corresponding layout. Renderer-wide behavioral settings are
checked next to `core/SchemaRenderer`.

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
   Popup scenarios use `fullPage: true` to include portals outside the wrapper.

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

Each entity suite uses 32 named variants from
`playwright/core/schemaRendererVariants.ts`:

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

Specific props, empty/disabled/validation states and interactions are separate
scenarios beyond the matrix. This targets the components' own behavior; it does
not enumerate every possible value of every inherited UIKit prop.

Boolean renderer settings (`coerceInitialValues`, `jsonDefaultValues`,
`validateOnBlur`) are tested in both states. The test timeout includes mounting,
interactions and screenshots in both themes; it is not a per-click allowance.
CI uses four workers to bound memory consumption when the matrix includes Monaco.

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

## Known failures in main

Two focused behavioral checks use `test.fail` with a description of an existing
production defect. They are executed, not skipped, and do not create reference
images of broken behavior:

- Explicit DateInput `outputFormat: 'string'` stores an ISO string, but parseDate
  treats `string` as an input format and leaves the displayed date empty. The
  normal ISO mode without an explicit outputFormat is covered separately.
- NumberWithScaleInput with `disabled: true` disables the numeric input but does
  not disable the unit Select.

When either production behavior is fixed, its check becomes an unexpected pass;
remove that `test.fail` annotation as part of the fix. The test-only branch does
not modify production components to resolve these issues.
