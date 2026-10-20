# Playwright component tests

The primary suite tests `SchemaRenderer` directly with JSON Schema. Its tests and
screenshots live in `src/lib/kit/__tests__` and `src/lib/kit/__snapshots__`.
The deprecated `DynamicField` / `DynamicView` suite remains in
`src/lib/deprecated/kit`, with its own unchanged screenshot references. It is
available separately; these older references still contain UIKit 7 visuals and
currently differ from UIKit 8 for some controls.

## Run tests

```sh
npm run playwright             # Primary SchemaRenderer suite (also used by CI)
npm run playwright:schema      # Same suite, explicitly
npm run playwright:deprecated  # Preserved DynamicField / DynamicView suite
npm run playwright:all         # Both suites
```

Both Chromium and WebKit are checked, in light and dark themes. Ordinary test
runs never create or replace reference images; missing references fail the test.
The HTML report is written to `playwright-report` (`playwright-report-docker` in a
container).

## Update screenshots

Generate references in the same Linux amd64 Playwright image as CI. On macOS,
use Docker or Podman; do not save macOS screenshots under the Linux filenames.

```sh
# Update only the new SchemaRenderer suite; preserve deprecated references.
./scripts/playwright-docker.sh 'npm run playwright:schema -- --update-snapshots'

# Verify the primary suite without updating references.
npm run playwright:docker
```

On Linux with the matching browsers and dependencies installed:

```sh
npm run playwright:schema -- --update-snapshots
npm run playwright
```

Review the generated PNG files before committing them. `npm run playwright:update`
and `npm run playwright:docker:update` update only SchemaRenderer. Updating
deprecated references requires an explicit
`npm run playwright:deprecated -- --update-snapshots` (inside the Linux container).

## Add a SchemaRenderer test

Use the native schema and the shared `SchemaForm` fixture, which mounts the public
`SchemaRenderer` API. Do not convert deprecated `Spec` objects for this suite.

```tsx
import React from 'react';

import {test} from '~playwright/core';
import {SchemaForm} from '~playwright/core/SchemaForm';

import {JsonSchemaType, NodeType} from '../../core/constants';

test('name field', async ({mount, expectScreenshot}) => {
  await mount(
    <SchemaForm
      schema={{
        type: JsonSchemaType.String,
        title: 'Name',
        nodeParameters: {type: NodeType.String, entity: 'base', layout: 'row'},
      }}
      value="Ada"
    />,
  );
  await expectScreenshot();
});
```

`expectScreenshot` captures light and dark images and waits for theme changes.
For multiple captures in one test, pass a distinct `screenshotName` each time.
Portals such as open select menus are outside the default wrapper: pass a popup
locator as `component`, or use `fullPage: true` to capture the entire page. A body
locator alone can clip absolutely positioned popups.

Import runtime constants from `core/constants` in test files, and use `import type`
for types. Importing the public component barrel in Node test collection would
load styles outside Vite; the JSX fixture can import the public API normally.

## Temporary date-components compatibility

The Vite config used by Playwright resolves `@gravity-ui/date-components` directly
to its real `DatePicker` module. Forms use this component, but the package barrel
also exports range pickers that still import removed UIKit 7 APIs. This alias
keeps date tests enabled; it does not fix package compatibility for consumers.
Remove it when a UIKit 8 compatible date-components release is installed.
