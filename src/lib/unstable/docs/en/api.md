[← Back to contents](./README.md)

# API reference

The whole public API is available from `@gravity-ui/dynamic-forms/unstable` (re-export of `core` and `kit`).

## Core components and hooks

| Export                                                               | Role                                                                                                         |
| :------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| `SchemaRenderer`                                                     | Component. Calls `useSchemaRenderer` and renders the root node with `schemaPath="#"`.                        |
| `useSchemaRenderer`                                                  | Hook. Lifts state into the service field, attaches the validator, wraps `form.submit`. Returns `validate`.   |
| `SchemaRendererNode`                                                 | A single tree node. Composite entities render children with it.                                              |
| `useSchemaRendererState`                                             | Reads the service field `SchemaRendererState`, re-renders on selected events.                                |
| `useSchemaRendererTools`                                             | Imperative: schema patches, external errors, userContext. Inside the same `Form`.                            |
| `useSchemaRendererNodeContext`                                       | The nearest node's context: `input`, `meta`, `schema`, `schemaPath`, `name`, `headName`, `mode`, `settings`. |
| `SchemaRendererNodeContext` / `createSchemaRendererNodeContextRuler` | Node store-context. Needed by entities rendered without `SchemaRendererNode` (the `one_of_nested` toggler).  |
| `getRenderKit`                                                       | From config and schema assembles `Entity`, `Layout` and their props for form and overview.                   |

## SchemaRenderer and useSchemaRenderer props

Keep `config`, `errorMessages` and `userContext` as stable references: changing a reference sends an event to subscribers, and a new `schema` resets the working copy entirely.

| Prop                  | Required | Behavior                                                                                                  |
| :-------------------- | :------: | :-------------------------------------------------------------------------------------------------------- |
| `name`                |   yes    | Root path in final-form. An empty string binds the renderer to the whole `values`.                        |
| `schema`              |   yes    | Root JSON Schema. A new reference resets the copy, patches, errors, cache and `submitCount`.              |
| `mode`                |   yes    | `form` or `overview`. Picks the entity and layout pair.                                                   |
| `validateOnBlur`      |   yes    | Must match `<Form validateOnBlur>`. `runValidate` relies on it when it blurs the service field.           |
| `config`              |    no    | Component registry. Without it string `entity` and `layout` keys are not resolved.                        |
| `errorMessages`       |    no    | JSON Schema error texts for the whole tree.                                                               |
| `userContext`         |    no    | Shared tree object. Built-in keys: `MonacoEditor`, `RenderHTMLOrMD`.                                      |
| `size`                |    no    | `s`, `m`, `l`, `xl`. Defaults to `m`. Heading variants are derived from the size.                         |
| `view`                |    no    | `stretch` or `fit`. Defaults to `stretch`. Kit container width.                                           |
| `coerceInitialValues` |    no    | Defaults to `true`. Coerces an already present value to `schema.type`.                                    |
| `jsonDefaultValues`   |    no    | Defaults to `false`. Runs `JSON.parse` on `default` before substitution.                                  |
| `connectValidate`     |    no    | Hook only. Defaults to `true` — validator on the service field. `false` returns `validate` to the caller. |

## useSchemaRendererTools

| Method                 | Argument                                      | Effect                                                                                                    |
| :--------------------- | :-------------------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| `addExternalErrors`    | `{headName, regularErrors?, priorityErrors?}` | Adds external errors and restarts validation. `regular` is low priority, `priority` overrides the schema. |
| `removeExternalErrors` | `{headName, removeFunctionOrNames}`           | Removes by a list of names or a function over both maps, then restarts.                                   |
| `addSchemaPatches`     | `{patches}`                                   | Patches the working schema, sends `Patch`, restarts validation.                                           |
| `removeSchemaPatches`  | `{patchesToRemove}`                           | Removes patches, restores leaves from the original, restarts.                                             |
| `updateUserContext`    | `{headName, userContext, replace?}`           | Merges (or with `replace` replaces) userContext and sends `UserContext`.                                  |

## Constants and enums

| Export                          | Values                                                                                                      |
| :------------------------------ | :---------------------------------------------------------------------------------------------------------- |
| `NodeType`                      | `any`, `array`, `boolean`, `number`, `object`, `string` — config branches.                                  |
| `JsonSchemaType`                | `array`, `boolean`, `integer`, `null`, `number`, `object`, `string` — the `schema.type` value.              |
| `SchemaRendererMode`            | `form`, `overview`.                                                                                         |
| `SchemaRendererEventType`       | `Config`, `Error`, `ErrorMessages`, `Mode`, `Name`, `Patch`, `Settings`, `Schema`, `Submit`, `UserContext`. |
| `SCHEMA_RENDERER_SERVICE_FIELD` | The service field name prefix: `SCHEMA_RENDERER_SERVICE_FIELD.<name>`.                                      |

## Utilities and definers

| Export                                              | What it does                                                                              |
| :-------------------------------------------------- | :---------------------------------------------------------------------------------------- |
| `getServiceFieldName`                               | The service field name by `name`.                                                         |
| `getParentName`                                     | The parent path. `getParentName('a.b')` → `'a'`, `getParentName('profile')` → `''`.       |
| `getSchemaByPointer`                                | Schema by JSON Pointer, mixing in the `$ref` target at each step, guarded against cycles. |
| `isStringNumber` / `isStringInt` / `isStringFloat`  | Numeric string checks for `stringNumber`.                                                 |
| `defineNodeEntityConfig` / `defineNodeLayoutConfig` | Type-safe entity and layout config entries: `Component` and `defaultProps`.               |
| `createNodeParametersDefiner`                       | From a config returns `defineNodeParameters` with key and props hints.                    |

## Kit exports

Almost every component exports its own props type. Exceptions: `Transparent`, `EntityError`, `EmptyEntityValue`, `OverviewRow`, `OverviewColumn`.

| Group                 | Exports                                                                                                                                                                                                                                                                                                               |
| :-------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| constants (5)         | `config`, `untypedConfig`, `errorMessages`, `DASH`, `DEFAULT_DATE_FORMAT`                                                                                                                                                                                                                                             |
| entities (11)         | Alert, ArrayEntity, ArrayTable, DotValue, FewOfNested, Label, Monaco, ObjectEntity, ObjectInline, OneOfNested, TextContent                                                                                                                                                                                            |
| form-entities (19)    | StringInput, TextAreaInput, PasswordInput, NumberInput, SelectInput, MultiSelectInput, RadioGroupInput, SegmentedRadioGroupInput, CheckboxInput, CheckboxGroupInput, SwitchInput, ColorPickerInput, DateInput, FileInput, SliderInput, RangeInput, RangeSliderInput, NumberWithScaleInput, StringNumberWithScaleInput |
| overview-entities (9) | StringValue, NumberValue, BooleanValue, DateValue, ColorPickerValue, PrimitiveArrayValue, RangeValue, NumberWithScaleValue, StringNumberWithScaleValue                                                                                                                                                                |
| layouts (4)           | Accordeon, Card, Section, Transparent                                                                                                                                                                                                                                                                                 |
| form-layouts (2)      | FormRow, FormColumn                                                                                                                                                                                                                                                                                                   |
| overview-layouts (2)  | OverviewRow, OverviewColumn                                                                                                                                                                                                                                                                                           |
| components (13)       | ArrayRemoveButton, CopyButton, DropButton, EmptyEntityValue, EntityContainer, EntityDescription, EntityError, EntityTitle, HTMLContent, LayoutContainer, LayoutButtons, LongValue, MonacoContainer                                                                                                                    |
| hooks (1)             | useExpanded                                                                                                                                                                                                                                                                                                           |
| utils (7)             | getValidationState, getBooleanValidationState, isArrayItem, isTupleItem, getArrayItemIndex, getArrayItemParentName, specToJsonSchema                                                                                                                                                                                  |

What the `kit` components do and their props — see [Kit](./kit.md).

## Types

All types from `core/types` are re-exported via `export type *`, including `JSLErrors` (type only).

| Group      | Types                                                                                                                                           |
| :--------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| Schema     | `JsonSchema` and variants: `JsonSchemaObject`, `JsonSchemaArray`, `JsonSchemaString`, `JsonSchemaNumber`, `JsonSchemaBoolean`, `JsonSchemaAny`. |
| Config     | `NodesConfig`, `NodeTypeConfig`, `NodeEntitiesConfig`, `NodeLayoutsConfig`.                                                                     |
| Components | `NodeEntity`, `NodeEntityProps`, `NodeLayout`, `NodeLayoutProps`.                                                                               |
| Validation | `Validator`, `ValidationError`, `ErrorMessages`, `JSLErrors`.                                                                                   |
| Values     | `SchemaToValueType` and derived value types.                                                                                                    |
| State      | `SchemaRendererState`, `SchemaRendererSettings`, `SchemaPatch`, `SchemaPatchRemover`, `UseSchemaRendererParams`.                                |
