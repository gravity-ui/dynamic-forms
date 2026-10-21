# Playwright component tests

The existing DynamicField / DynamicView tests and their screenshots live beside
components in `src/lib/deprecated/kit`. SchemaRenderer coverage is being prepared
in a separate branch based on main.

```sh
npm run playwright             # DynamicField / DynamicView suite (also used by CI)
npm run playwright:deprecated  # Same suite, explicitly
npm run playwright:all         # All available component tests
```

Both Chromium and WebKit are checked, in light and dark themes. Ordinary test
runs never create or replace reference images; missing references fail the test.
The preserved references contain UIKit 7 visuals and can differ from UIKit 8.

Generate screenshots in the same Linux amd64 Playwright image as CI:

```sh
./scripts/playwright-docker.sh 'npm run playwright -- --update-snapshots'
npm run playwright:docker
```

Review generated PNG files before committing them. On macOS, use Docker or
Podman; do not save macOS screenshots under the Linux filenames.

## Temporary date-components compatibility

The Vite config resolves `@gravity-ui/date-components` to its real `DatePicker`
module. The package barrel also exports range pickers that import removed UIKit 7
APIs. This test-only alias does not fix package compatibility for consumers.
Remove it when a UIKit 8 compatible date-components release is installed.
