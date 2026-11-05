[← Back to contents](./README.md)

# How to use

The renderer is placed inside a `Form` from `react-final-form` — fields register themselves, no separate `Field` is needed. The full list of props and hooks is in the [API reference](./api.md).

## Quick start

```tsx
import {Form} from 'react-final-form';
import {
  SchemaRenderer,
  JsonSchemaType,
  NodeType,
  SchemaRendererMode,
  config,
  errorMessages,
  type JsonSchema,
} from '@gravity-ui/dynamic-forms/unstable';

const schema: JsonSchema = {
  type: JsonSchemaType.Object,
  nodeParameters: {type: NodeType.Object, entity: 'base'},
  required: ['login'],
  properties: {
    login: {
      type: JsonSchemaType.String,
      title: 'Login',
      minLength: 1,
      nodeParameters: {type: NodeType.String, entity: 'base', layout: 'row'},
    },
  },
};

function ProfileForm() {
  return (
    <Form onSubmit={(values) => console.log(values)}>
      {({handleSubmit}) => (
        <form onSubmit={handleSubmit}>
          <SchemaRenderer
            name=""
            schema={schema}
            mode={SchemaRendererMode.Form}
            config={config}
            errorMessages={errorMessages}
            validateOnBlur={false}
          />
          <button type="submit">Save</button>
        </form>
      )}
    </Form>
  );
}
```

`config` and `errorMessages` are ready-made exports from `kit`. `validateOnBlur` must match the value on `<Form validateOnBlur>` (more in [Runtime](./runtime.md#validation)).

## The name prop — where the value goes

The renderer's name is the root path in the `final-form` value.

| `name`           | Writes to             | Example                                              |
| :--------------- | :-------------------- | :--------------------------------------------------- |
| `name=""`        | The whole form object | A schema with a `login` field writes `values.login`. |
| `name="profile"` | A subtree             | The same field writes `values.profile.login`.        |

A single `Form` may contain several renderers with different `name`, each with its own service field.

## Form and overview modes

The `mode` prop switches how the same schema is rendered.

- `SchemaRendererMode.Form` — `formEntities` and `formLayouts` are used. A node with `readOnly: true` is not rendered in the form; to show a disabled field, use `flags.disabled`.
- `SchemaRendererMode.Overview` — `overviewEntities` and `overviewLayouts` are used. A node with `writeOnly: true` is not rendered in the overview; empty values are usually hidden.

## What to pick

| API                                        | When                                                                                                                                                         |
| :----------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SchemaRenderer`                           | Render the whole schema in one place. 90% of cases.                                                                                                          |
| `useSchemaRenderer` + `SchemaRendererNode` | Parts of the schema are spread across the page: a step wizard, custom layout, mixing form and overview. See [Extension](./extension.md#standalone-renderer). |
| `useSchemaRendererState`                   | A component needs errors, mode, `submitCount` or the renderer's working schema.                                                                              |
