# @gravity-ui/dynamic-forms &middot; [![npm package](https://img.shields.io/npm/v/@gravity-ui/dynamic-forms)](https://www.npmjs.com/package/@gravity-ui/dynamic-forms) [![CI](https://img.shields.io/github/actions/workflow/status/gravity-ui/dynamic-forms/.github/workflows/ci.yml?label=CI&logo=github)](https://github.com/gravity-ui/dynamic-forms/actions/workflows/ci.yml?query=branch:main) [![storybook](https://img.shields.io/badge/Storybook-deployed-ff4685)](https://preview.gravity-ui.com/dynamic-forms/)

The JSON Schema-based library for rendering forms and form values.

## Install

```shell
npm install --save-dev @gravity-ui/dynamic-forms
```

## Usage

```jsx
import {DynamicField, Spec, dynamicConfig} from '@gravity-ui/dynamic-forms';

// To embed in a final-form
<DynamicField name={name} spec={spec} config={config} />;

import {DynamicView, dynamicViewConfig} from '@gravity-ui/dynamic-forms';

// To get an overview of the values
<DynamicView value={value} spec={spec} config={dynamicViewConfig} />;
```

### I18N

Certain components include text tokens (words and phrases) that are available in two languages: `en` (the default) and `ru`. To set the language, use the `configure` function:

```js
// index.js

import {configure, Lang} from '@gravity-ui/dynamic-forms';

configure({lang: Lang.Ru});
```

## Development

To start the development server with storybook execute the following command:

```shell
npm ci
npm run dev
```
