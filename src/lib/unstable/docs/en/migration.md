[← Back to contents](./README.md)

# Spec bridge

How to move from the old `Spec` format (see [docs/spec.md](../../../../../docs/spec.md)) to the renderer's JSON Schema.

## specToJsonSchema

The converter translates the old `Spec` description into a schema with `nodeParameters`. `DynamicField` with the `withSchemaRenderer` flag performs this translation and mounts `SchemaRenderer` in form mode with the kit config and `errorMessages`. A new schema with `nodeParameters` does not need the translation.

| Spec                                    | JSON Schema                                                                                         |
| :-------------------------------------- | :-------------------------------------------------------------------------------------------------- |
| `defaultValue`                          | `default`                                                                                           |
| `type`                                  | `type` + `nodeParameters.type`                                                                      |
| `required`                              | parent `required` + `flags.required` (+ the `not` / `enum` trick)                                   |
| `format: 'int64'`                       | `type: integer`                                                                                     |
| `validator` (function)                  | `nodeParameters.validator`                                                                          |
| `viewSpec.type`                         | `nodeParameters.entity`                                                                             |
| `viewSpec.layout`                       | `nodeParameters.layout` (`row_verbose` → `row` + description; `section` / `section2` → subheadings) |
| `viewSpec.layoutOpen`, disabled, hidden | `flags.open`, `flags.disabled`, `flags.hidden`                                                      |

## viewSpec.type → entity

| `viewSpec.type`               | Entity                                                                          |
| :---------------------------- | :------------------------------------------------------------------------------ |
| `oneof`                       | checkbox / switch (boolean), `radio_group`, select or segmented — by the widget |
| `multi_oneof`                 | An array of togglers, for example a checkbox group                              |
| `object_value`                | `dot_value`                                                                     |
| `date_input`                  | `date`                                                                          |
| `file_input` / `monaco_input` | `file_input` / `monaco_input`                                                   |
| `number_with_scale`           | `number_with_scale` or `string_number_with_scale`                               |
| `range_input_picker`          | `range_input`                                                                   |
| otherwise                     | `entity = viewSpec.type`                                                        |

## What does not carry over

> The converter writes but kit does not read `itemPrefix`, `link`, `addButtonPosition`. In `withSchemaRenderer` mode `validators`, `mutators`, `search`, `generateRandomValue` from `DynamicFormConfig` are not used — move validators into `config` during migration (see [Extension](./extension.md#custom-validator)).

A string `spec.validator` becomes, after conversion, a key that is not in kit's empty `validators` — the check is silently skipped. More on this and other edge cases in [Caveats](./limitations.md).
