# Playwright Test Component

## How to write a test

1. Select the component you want to write tests for
2. Inside the component folder, create the `__tests__` folder and create a file inside it with the following name `<ComponentName>.visual.test.tsx`
3. Writing a test:

   ```ts
   import React from 'react';

   import {TEST_SPEC} from './helpers';

   import {test} from '~playwright/core';
   import {DynamicForm} from '~playwright/core/DynamicForm';

   test('Name test', async ({mount, expectScreenshot}) => {
     //mounting a component
     await mount(<DynamicForm spec={TEST_SPEC} />);

     //screenshot
     await expectScreenshot();
   });
   ```

   or if you need to do any actions on the component

   ```ts
   import React from 'react';

   import {TEST_SPEC} from './helpers';

   import {test} from '~playwright/core';
   import {DynamicForm} from '~playwright/core/DynamicForm';

   test('Name test', async ({mount, expectScreenshot}) => {
     //mounting a component
     const component = await mount(<DynamicForm spec={TEST_SPEC} />);

     await component.getByRole('button').click();

     //screenshot
     await expectScreenshot();
   });
   ```

   Group of tests.

   ```ts
   test.describe('Name group tests', () => {
   test('1', ...);
   test('2', ...);
   ...
   test('10', ...)
   });
   ```

````

4. Run tests

   ```shell
   npm run playwright:install
   npm run playwright
````

If you are using system other than Linux, then you need to run tests via docker command:

```shell
npm run playwright:docker
```

> `npm run playwright:install` command must be run only once on initial setup

5. Update screenshots if needed

   ```shell
   npm run playwright:update
   ```

   Or

   ```shell
   npm run playwright:docker:update
   ```

6. In the folder `__snapshots__`, which is on the same level as the `__tests__` folder, the folder `<Component name>.visual.test.tsx-snapshots`, will contain screenshots

## Description of possible commands:

1. [playwright-test-components](https://playwright.dev/docs/test-components)
2. [playwright-docs](https://playwright.dev/docs/api/class-test)
3. [playwright-writing-tests](https://playwright.dev/docs/writing-tests)

## Test examples

- [ArrayBase](../src/lib/kit/components/Inputs/ArrayBase/__tests__/ArrayBase.visual.test.tsx)
- [Text](../src/lib/kit/components/Inputs/Text/__tests__/Text.visual.test.tsx)
- [TextContent](../src/lib/kit/components/Inputs/TextContent/__tests__/TextContent.visual.test.tsx)
- [TextArea](../src/lib/kit/components/Inputs/TextArea/__tests__/TextArea.visual.test.tsx)

## Npm scripts

- `npm run playwright:install` - install playwright browsers and dependencies
- `npm run playwright` - run tests
- `npm run playwright:update` - update screenshots
- `npm run playwright:clear-cache` - clear cache vite
- `npm run playwright:docker` - run tests using docker
- `npm run playwright:docker:update` - update screenshots using docker
- `npm run playwright:docker:clear-cache` - clear node_modules cache for docker container and clear cache vite
