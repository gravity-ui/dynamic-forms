# @gravity-ui/dynamic-forms &middot; [![npm package](https://img.shields.io/npm/v/@gravity-ui/dynamic-forms)](https://www.npmjs.com/package/@gravity-ui/dynamic-forms) [![CI](https://img.shields.io/github/actions/workflow/status/gravity-ui/dynamic-forms/.github/workflows/ci.yml?label=CI&logo=github)](https://github.com/gravity-ui/dynamic-forms/actions/workflows/ci.yml?query=branch:main) [![storybook](https://img.shields.io/badge/Storybook-deployed-ff4685)](https://preview.gravity-ui.com/dynamic-forms/)

**English** · [Русский](README-ru.md)

A form renderer on top of JSON Schema and `react-final-form`. A single schema describes both the value and how it is rendered: validation rules are standard Draft-07 keywords, and what a node is drawn with is the `nodeParameters` extension.

- Entry point: `@gravity-ui/dynamic-forms`.
- Status: **stable API**.
- Two layers: `core` (headless engine) and `kit` (ready-made entities and layouts on `@gravity-ui/uikit`).

The previous DynamicField / DynamicView API is available from `@gravity-ui/dynamic-forms/deprecated`. SchemaRenderer imports from the removed `/unstable` entry point move to the package root. See the [migration guide](MIGRATION.md) for the full transition and [docs/deprecated](docs/deprecated) for the previous API documentation.

## Install

```shell
npm install --save-dev @gravity-ui/dynamic-forms
```

## Contents

- [How to use](docs/en/how-to-use.md) — quick start, the `name` prop, modes, what to pick.
- [API reference](docs/en/api.md) — components, hooks, props, constants, utilities, `kit` exports, types.
- [Schema](docs/en/schema.md) — `nodeParameters`, flags, annotations, keywords, `stringNumber`, `$ref`.
- [Runtime](docs/en/runtime.md) — node lifecycle, value coercion, validation, errors, events, patches.
- [Kit](docs/en/kit.md) — layouts, entity catalog, service components, styles.
- [Extension](docs/en/extension.md) — custom entities, layouts, validators, config, standalone renderer.
- [Migration](MIGRATION.md) — moving from the previous main API or `/unstable`, converting Spec, compatibility through `/deprecated`.
- [Caveats and limitations](docs/en/limitations.md) — code-verified discrepancies, limitations and bugs.

## What it is

`src/lib` is a form engine where both the form and the values overview are built from a single JSON Schema. The `core` layer has no controls of its own: everything rendered comes from the config. Validation runs through `json-schema-library` (Draft-07) plus the custom `stringNumber` keyword. The `kit` layer provides a ready registry: 30 entity keys across 6 node types, 7 layout keys, service components, the `useExpanded` hook, error texts and the `specToJsonSchema` converter from the old Spec format.

## How it works

1. **Schema and config.** `useSchemaRenderer` clones `schema` and stores state in a service field with a validator.
2. **Nodes.** `SchemaRendererNode` takes the subschema by pointer, registers a `final-form` field, picks `entity` and `layout`.
3. **Change.** A value edit, via `validateFields`, triggers only the service field validator.
4. **Errors.** The validator spreads errors by name into `srState.errors`; nodes with a changed message re-render.
5. **Imperative.** `useSchemaRendererTools` patches the schema and adds external errors, restarting validation.

## Dependencies

| Package                                     | Role     | Why                                                               |
| :------------------------------------------ | :------- | :---------------------------------------------------------------- |
| `react` / `react-dom` / `react-is`          | peer     | 18, 19. Rendering.                                                |
| `final-form` / `react-final-form`           | peer     | Form, fields, submit, subscriptions.                              |
| `@gravity-ui/uikit`                         | peer     | Version 8. Kit controls: TextInput, Select, Checkbox, etc.        |
| `json-schema-library`                       | runtime  | Draft-07 validation and the custom `stringNumber` keyword.        |
| `decimal.js`                                | runtime  | Number comparison and scale in `stringNumber` and `*_with_scale`. |
| `@gravity-ui/date-components`, `date-utils` | runtime  | `DateInput` and `DateValue`.                                      |
| `@gravity-ui/icons`                         | runtime  | `iconName` in Alert, Label, TextContent.                          |
| `@gravity-ui/i18n`                          | runtime  | Localization of error texts.                                      |
| `@bem-react/classname`, `lodash`, `uuid`    | runtime  | Classes, utilities, keys.                                         |
| Monaco                                      | external | Not bundled. Passed via `userContext.MonacoEditor`.               |

## I18N

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
