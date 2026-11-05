[← Back to contents](./README.md)

# Schema

A schema is JSON Schema Draft-07 with two extensions: `nodeParameters` (what and how to render a node) and `stringNumber` (a number stored as a string). The value type is set by `type` (the `JsonSchemaType` enum).

## nodeParameters

The only place where the schema says what to render it with. `type` is required when `entity` or `layout` are given as strings: the lookup goes into `config[type]`. Instead of a string you may pass the component itself.

| Field                                      | What it sets                                                                                          |
| :----------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| `type`                                     | `any`, `array`, `boolean`, `number`, `object`, `string`. The config branch. Required for string keys. |
| `entity` / `formEntity` / `overviewEntity` | A registry key or a component. The mode-specific one overrides the common one.                        |
| `entityProps` + mode pairs                 | Component props on top of `defaultProps`. `formEntityProps` applies only with `formEntity`.           |
| `layout` / `formLayout` / `overviewLayout` | A layout key or a component. Same override order.                                                     |
| `layoutProps` + mode pairs                 | Layout props.                                                                                         |
| `validator`                                | A key from this type's `validators` or a function.                                                    |
| `errorMessages`                            | Error texts for this node. Override the renderer's dictionary.                                        |
| `flags`                                    | `copy`, `disabled`, `hidden`, `open`, `required`.                                                     |

### Kit assembly order

1. `entity` fills both modes, then `formEntity` / `overviewEntity` override their own.
2. The layout the same way: `layout`, then `formLayout` / `overviewLayout`.
3. Config `defaultProps` merge with schema props; schema props win (arrays merge by index).
4. The common `entity` uses `entityProps` in both modes. Only an explicit `formEntity` / `overviewEntity` replaces the component and its props for that mode: the corresponding `formEntityProps` / `overviewEntityProps` are used without inheriting `entityProps`. The same rule applies to layouts.

> **independent.** With `independent: true` in the config entry the layout is passed as a prop into the entity — the engine does not wrap it. This is how object `base`, `one_of_nested`, `few_of_nested` are built. A component passed instead of a string key gets neither `defaultProps` nor `independent`.

## Flags

| Flag       | Effect                                                                                                                                |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| `hidden`   | The layout hides the node via `display: none`. The field stays registered and validated.                                              |
| `disabled` | The input, the array add button and Monaco become unavailable. Does not cascade to children.                                          |
| `required` | An asterisk on the title, hides the reset button. An object or array without `default` gets `{}` or `[]`. Does not enable validation. |
| `open`     | Initial expansion of Card, Accordeon and Alert. Only Card and Accordeon expand automatically on an error after submit.                |
| `copy`     | In the overview a copy button appears for strings and numbers.                                                                        |

`flags.required` and the `required` keyword are different mechanisms: the first is about the UI and the initial value, the second about checking key presence (see [Caveats](./limitations.md)).

## Annotations read by kit

| Key                                  | How it is used                                                                              |
| :----------------------------------- | :------------------------------------------------------------------------------------------ |
| `title`                              | The label. An empty `title` means no heading — the property name does not become the label. |
| `description`                        | A hint next to the title. HTML/MD via `dangerouslySetInnerHTML` or `RenderHTMLOrMD`.        |
| `examples[0]`                        | Placeholder for string inputs.                                                              |
| `default`                            | The initial value at registration, while the parent is not empty.                           |
| `enum`                               | Options of select, radio and checkbox groups. For arrays — `items.enum`.                    |
| `minimum` / `maximum` / `multipleOf` | min, max and step of NumberInput.                                                           |
| `readOnly`                           | The node is not rendered in form mode.                                                      |
| `writeOnly`                          | The node is not rendered in overview mode.                                                  |

## JSON Schema keywords

The validator is `json-schema-library`, Draft-07. It is built with `formatAssertion: false`, so `format` is not validated.

| Type             | Keywords                                                                                                                |
| :--------------- | :---------------------------------------------------------------------------------------------------------------------- |
| Common           | `type`, `enum`, `const`, `allOf`, `anyOf`, `oneOf`, `not`, `if` / `then` / `else`, `$ref`, `$id`, `definitions`         |
| object           | `properties`, `required`, `additionalProperties`, `patternProperties`, `dependencies`, `minProperties`, `maxProperties` |
| array            | `items`, `additionalItems`, `contains`, `minItems`, `maxItems`, `uniqueItems`                                           |
| number / integer | `minimum`, `maximum`, `exclusiveMinimum`, `exclusiveMaximum`, `multipleOf`                                              |
| string           | `minLength`, `maxLength`, `pattern`. `format` is not validated.                                                         |
| custom           | `stringNumber` — a number stored as a string. Compared via Decimal.                                                     |

### stringNumber

A number stored as a string. The fields `type`, `minimum`, `maximum`, `exclusiveMinimum`, `exclusiveMaximum`, `multipleOf` are given as strings, comparison is via Decimal. Error codes and texts are the same as for numbers. An empty string with `type` set is a type error.

```tsx
const schema: JsonSchema = {
  type: JsonSchemaType.Object,
  properties: {
    amount: {
      type: JsonSchemaType.String,
      title: 'Amount',
      stringNumber: {type: JsonSchemaType.Number, minimum: '0', multipleOf: '0.01'},
      nodeParameters: {type: NodeType.String, entity: 'string_number_with_scale'},
    },
    kind: {
      type: JsonSchemaType.String,
      enum: ['one', 'two'],
      nodeParameters: {type: NodeType.String, entity: 'radio_group'},
    },
  },
  nodeParameters: {
    type: NodeType.Object,
    entity: 'base',
    entityProps: {
      groups: [
        {
          title: 'Payment',
          layout: 'card',
          order: [
            {name: 'amount', schemaPath: 'properties/amount'},
            {name: 'kind', schemaPath: 'properties/kind'},
          ],
        },
      ],
    },
  },
};
```

## $ref

> **`$ref` siblings.** For rendering, the `$ref` target is merged into the referencing node and the target wins. The Draft-07 validator ignores sibling keywords in the same object (for example, `minLength` next to `$ref` is not validated). Keep labels, `nodeParameters` and constraints on the target schema.

`getSchemaByPointer` resolves the pointer, mixing in the `$ref` target at each step, and is guarded against circular references. Patch subscription accounts for the `$ref` chain (see [Runtime](./runtime.md#events)).
