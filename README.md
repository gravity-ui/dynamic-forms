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

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

## For AI agents

A JSON-Schema-driven engine that renders form fields and read-only value views from a spec — reach for it when your field layout and validation are defined by a schema or backend, instead of hand-writing per-field form markup with `final-form`.

### When to use

- Rendering forms whose field structure comes from a JSON Schema / backend spec, not hardcoded components.
- Reusing the same spec to render an editable form (`<DynamicField>`) and a read-only summary (`<DynamicView>`).
- Embedding schema-driven fields into an existing `react-final-form` instance via `<DynamicField>`.

### When not to use

- For a fixed, hand-authored form with a known set of fields, compose primitives from [`@gravity-ui/uikit`](https://gravity-ui.com/uikit) directly — the schema indirection is overhead you do not need.
- For building dialog/modal field inputs, use [`@gravity-ui/dialog-fields`](https://gravity-ui.com/components/dialog-fields) — it targets dialog-style inputs, not full schema-driven form layout.

### Common pitfalls

- **Hallucinated prop `schema`** — the spec prop is `spec` (a `Spec`), and the field config is `config` (e.g. `dynamicConfig`).
- **Forgetting to pass a `config`** — `<DynamicField>` / `<DynamicView>` need a `config` object (`dynamicConfig` / `dynamicViewConfig`) that registers field types, or no fields render.
- **Missing `configure({lang})`** — default text tokens are `en`; call `configure({lang: Lang.Ru})` once before rendering to localize built-in strings.
- **Expecting built-in validation** — validation rules live in the `spec`; the package renders fields, it does not impose schema validation by itself.
