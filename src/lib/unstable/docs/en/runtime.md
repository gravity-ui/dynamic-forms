[← Back to contents](./README.md)

# Runtime

How the renderer behaves at work time: node registration, initial values, validation, errors, events and patches.

## Node lifecycle

`SchemaRendererNode` is subscribed to config, errors, mode, name, patches, settings and schema. It assembles the subschema by JSON Pointer, registers a `final-form` field, puts `input` and `meta` into the context and renders the entity. If a layout exists and the entity is not `independent`, the layout wraps the entity from the outside.

### Name and pointer

- The name is a `final-form` path: `user.name`, `tags[0]`.
- `schemaPath` is a schema pointer: `#/properties/user/properties/name`, `#/properties/tags/items`.

A composite entity creates children with a new `SchemaRendererNode` and links both coordinates itself. `schemaOverride` is merged on top of the schema at the pointer (with `$ref`). `withoutRegister` does not register a field — this is how `ObjectEntity` groups render a heading without a value of their own.

### Initial value

`default` is written at registration while the parent is not empty (empty is `undefined`, `null`, `''`, `0`, `false`; the root is always non-empty). A required object or array without `default` gets `{}` or `[]`. So a nested field's `default` only applies once the parent already exists — its value must appear first.

### Value coercion (coerceInitialValues)

| Schema type                 | How an already present value is coerced                                                    |
| :-------------------------- | :----------------------------------------------------------------------------------------- |
| `number` / `integer`        | `'12'` → `12`. A non-numeric string is a type error. An empty string `''` is a type error. |
| `boolean`                   | `'true'` and `1` → `true`. `'false'` and `0` → `false`.                                    |
| `string`                    | Number and boolean → string.                                                               |
| `object` / `array` / `null` | Unchanged.                                                                                 |

## Validation

Nodes do not hold their own `final-form` validators. There is one validator — on the service field. Every field lists this service field in `validateFields`, so any change triggers only it. The result for `final-form` is the string `'error'` or `false`; per-field texts live in `srState.errors` and are shown via `meta.error`.

The renderer's `validateOnBlur` must match `<Form validateOnBlur>`: `runValidate` blurs the service field and relies on this flag to restart validation.

### Error layers

A matching path is overridden by a later layer. An object in an error is spread onto child names.

| Layer | Source                     | When to write                                               |
| ----: | :------------------------- | :---------------------------------------------------------- |
|     1 | `regularErrors`            | External, low priority. `addExternalErrors`, Monaco errors. |
|     2 | JSON Schema                | `json-schema-library`, Draft-07, plus `stringNumber`.       |
|     3 | `nodeParameters.validator` | The node's own validator. May return a promise.             |
|     4 | `priorityErrors`           | External, high priority. Override the same path.            |

A JSON Schema text is resolved along the chain: `errorMessages` on the schema from the error itself → the node schema by `schemaPath` → the renderer dictionary → the library's raw message. The value is a string or a function of the error; for `required` and `dependencies` a map by property name is allowed.

### Custom validator

Signature: the node value and the whole `values`. The return is a string for this field, an object of child messages, `undefined` or a promise of the same. A promise is cached by value and schema (the cache lives until `schema` or `name` changes). While it is unresolved, the form is "validating" too; after it resolves, validation runs again. A detailed example is in [Extension](./extension.md#custom-validator).

A message is shown when the field is `touched` or submit has failed. Before `form.submit` the renderer increments `submitCount` and sends `Submit`; `Card` and `Accordeon` expand on that event if there is an error on the node or its descendants.

## Events

`useSchemaRendererState` listens to all events by default; it can be narrowed to `Error` by `name` or `Patch` by `schemaPath`. Per dispatch a subscriber gets at most one notification.

| Event           | Trigger                                    | Who receives                                                            |
| :-------------- | :----------------------------------------- | :---------------------------------------------------------------------- |
| `Schema`        | A new `schema` reference                   | All subscribers. Copy, patches, errors, cache reset.                    |
| `Patch`         | `addSchemaPatches` / `removeSchemaPatches` | Nodes whose `schemaPath` is a prefix of the changed path (with `$ref`). |
| `Error`         | The set of messages changed                | Nodes with a changed message, by their `name`.                          |
| `Config`        | A new `config` reference                   | All subscribers. Validation is not restarted.                           |
| `ErrorMessages` | A new texts dictionary                     | All. Texts apply on the next validation.                                |
| `Mode` / `Name` | Mode or root path changed                  | All subscribers.                                                        |
| `Settings`      | `size`, `view`, coerce, jsonDefault        | All subscribers.                                                        |
| `UserContext`   | `updateUserContext`                        | All subscribers.                                                        |
| `Submit`        | Before the original `form.submit`          | All. `submitCount` + 1, Card and Accordeon expand on an error.          |

## Schema patches

The working schema is a deep copy of the `schema` prop; a patch changes the copy, the original prop is untouched. A new `schema` or `name` reference resets the copy.

- **merge (default).** Each leaf is written at its own path, arrays merge by index, empty `{}` and `[]` are no-ops. The address is a `schemaPath` or the `name` of a registered field.
- **replace: true.** Replaces the node at `schemaPath` entirely (for `#` — the whole schema). Needed to replace an array (`enum`, `required`) or delete a key.

`removeSchemaPatches` removes a patch with the same path and deeply equal schema (`schema: true` — all the node's patches), restores affected leaves from the original and re-applies the rest. Note: keys that were not in the original are not removed when a patch is removed (see [Caveats](./limitations.md)).

The API for imperative operations is `useSchemaRendererTools`, examples are in [Extension](./extension.md#dynamic-schema).
