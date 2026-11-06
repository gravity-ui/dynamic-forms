# @gravity-ui/dynamic-forms &middot; [![npm package](https://img.shields.io/npm/v/@gravity-ui/dynamic-forms)](https://www.npmjs.com/package/@gravity-ui/dynamic-forms) [![CI](https://img.shields.io/github/actions/workflow/status/gravity-ui/dynamic-forms/.github/workflows/ci.yml?label=CI&logo=github)](https://github.com/gravity-ui/dynamic-forms/actions/workflows/ci.yml?query=branch:main) [![storybook](https://img.shields.io/badge/Storybook-deployed-ff4685)](https://preview.gravity-ui.com/dynamic-forms/)

The JSON Schema-based library for rendering forms and form values.

## Install

```shell
npm install --save-dev @gravity-ui/dynamic-forms
```

## Usage

SchemaRenderer is the main API, available from `@gravity-ui/dynamic-forms`.

- [Quick start](docs/en/how-to-use.md)
- [Documentation](docs/en/README.md) / [Документация](docs/ru/README.md)
- [Spec migration](docs/en/migration.md)

### Deprecated API

The previous `DynamicField`, `DynamicView`, configs and types are available from
`@gravity-ui/dynamic-forms/deprecated`. Their documentation is in
[Deprecated / Readme](https://preview.gravity-ui.com/dynamic-forms/?path=/docs/deprecated-readme--docs).

This entry point uses `@gravity-ui/uikit/legacy`. Install its optional peer dependencies
in the consuming application:

```shell
npm install @hello-pangea/dnd@^18 react-window@^1 react-virtualized-auto-sizer@^1
```

SchemaRenderer does not require these three packages.

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
