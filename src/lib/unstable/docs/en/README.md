# SchemaRenderer (unstable)

[Русский](../ru/README.md) · **English**

A form renderer on top of JSON Schema and `react-final-form`. A single schema describes both the value and how it is rendered: validation rules are standard Draft-07 keywords, and what a node is drawn with is the `nodeParameters` extension.

- Entry point: `@gravity-ui/dynamic-forms/unstable`.
- Status: **unstable API**. Exports and behavior may change between versions.
- Two layers: `core` (headless engine) and `kit` (ready-made entities and layouts on `@gravity-ui/uikit`).

## Contents

- [How to use](./how-to-use.md) — quick start, the `name` prop, modes, what to pick.
- [API reference](./api.md) — components, hooks, props, constants, utilities, `kit` exports, types.
- [Schema](./schema.md) — `nodeParameters`, flags, annotations, keywords, `stringNumber`, `$ref`.
- [Runtime](./runtime.md) — node lifecycle, value coercion, validation, errors, events, patches.
- [Kit](./kit.md) — layouts, entity catalog, service components, styles.
- [Extension](./extension.md) — custom entities, layouts, validators, config, standalone renderer.
- [Spec bridge](./migration.md) — `specToJsonSchema`, `withSchemaRenderer`, mapping and limitations.
- [Caveats and limitations](./limitations.md) — code-verified discrepancies, limitations and bugs.

## What it is

`src/lib/unstable` is a form engine where both the form and the values overview are built from a single JSON Schema. The `core` layer has no controls of its own: everything rendered comes from the config. Validation runs through `json-schema-library` (Draft-07) plus the custom `stringNumber` keyword. The `kit` layer provides a ready registry: 30 entity keys across 6 node types, 7 layout keys, service components, the `useExpanded` hook, error texts and the `specToJsonSchema` converter from the old Spec format.

## How it works

1. **Schema and config.** `useSchemaRenderer` clones `schema` and stores state in a service field with a validator.
2. **Nodes.** `SchemaRendererNode` takes the subschema by pointer, registers a `final-form` field, picks `entity` and `layout`.
3. **Change.** A value edit, via `validateFields`, triggers only the service field validator.
4. **Errors.** The validator spreads errors by name into `srState.errors`; nodes with a changed message re-render.
5. **Imperative.** `useSchemaRendererTools` patches the schema and adds external errors, restarting validation.

## Dependencies

| Package                                     | Role     | Why                                                               |
| :------------------------------------------ | :------- | :---------------------------------------------------------------- |
| `react` / `react-dom` / `react-is`          | peer     | 17, 18, 19. Rendering.                                            |
| `final-form` / `react-final-form`           | peer     | Form, fields, submit, subscriptions.                              |
| `@gravity-ui/uikit`                         | peer     | Kit controls: TextInput, Select, Checkbox, etc.                   |
| `json-schema-library`                       | runtime  | Draft-07 validation and the custom `stringNumber` keyword.        |
| `decimal.js`                                | runtime  | Number comparison and scale in `stringNumber` and `*_with_scale`. |
| `@gravity-ui/date-components`, `date-utils` | runtime  | `DateInput` and `DateValue`.                                      |
| `@gravity-ui/icons`                         | runtime  | `iconName` in Alert, Label, TextContent.                          |
| `@gravity-ui/i18n`                          | runtime  | Localization of error texts.                                      |
| `@bem-react/classname`, `lodash`, `uuid`    | runtime  | Classes, utilities, keys.                                         |
| Monaco                                      | external | Not bundled. Passed via `userContext.MonacoEditor`.               |
