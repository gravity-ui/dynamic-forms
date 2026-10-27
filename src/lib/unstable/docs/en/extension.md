[← Back to contents](./README.md)

# Extension

How to add your own entities, layouts, validators, supply external errors, patch the schema and build a form by hand. Types and exports are in the [API reference](./api.md).

## Custom entity

A component of type `NodeEntity` receives `input`, `meta`, the schema, the mode, `props` and (for `independent`) `Layout`. The value is changed via `input.onChange`, the validation state via `getValidationState(meta)`.

```tsx
import {TextInput} from '@gravity-ui/uikit';
import {
  getValidationState,
  type NodeEntity,
  type JsonSchemaString,
} from '@gravity-ui/dynamic-forms/unstable';

export const SlugInput: NodeEntity<JsonSchemaString> = ({input, meta, schema}) => (
  <TextInput
    value={input.value ?? ''}
    onUpdate={(next) => input.onChange(next.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}
    onBlur={() => input.onBlur()}
    placeholder={schema.examples?.[0] as string}
    validationState={getValidationState(meta)}
  />
);
```

Registering the key in the config and a type-safe definer:

```tsx
import {
  NodeType,
  untypedConfig,
  defineNodeEntityConfig,
  createNodeParametersDefiner,
} from '@gravity-ui/dynamic-forms/unstable';
import {SlugInput} from './SlugInput';

export const appConfig = {
  ...untypedConfig,
  [NodeType.String]: {
    ...untypedConfig[NodeType.String],
    formEntities: {
      ...untypedConfig[NodeType.String].formEntities,
      slug: defineNodeEntityConfig({Component: SlugInput}),
    },
  },
} as const;

export const defineNodeParameters = createNodeParametersDefiner(appConfig);

// nodeParameters: defineNodeParameters({type: NodeType.String, entity: 'slug', layout: 'row'})
```

For the overview add a pair in `overviewEntities`, otherwise in `overview` mode the node stays without a component.

## Custom layout

A layout of type `NodeLayout` receives `children` — the already rendered entity. The heading, description and error are taken from the node context. A custom layout must render `EntityError` itself, otherwise the error text will not show.

```tsx
import {Flex} from '@gravity-ui/uikit';
import {
  EntityTitle,
  EntityError,
  LayoutButtons,
  LayoutContainer,
  type NodeLayout,
  type JsonSchema,
} from '@gravity-ui/dynamic-forms/unstable';

// EntityTitle, EntityError, LayoutButtons read the node context.
export const InlineLayout: NodeLayout<JsonSchema> = ({children}) => (
  <LayoutContainer>
    <Flex gap={2} alignItems="center">
      <EntityTitle />
      {children}
      <LayoutButtons />
    </Flex>
    <EntityError />
  </LayoutContainer>
);
```

## Custom validator

A function is put into a type's `validators` (and called by the string key `nodeParameters.validator`) or directly into the schema. Returning a string is an error for this field, an object — errors for children by relative paths, `undefined` — ok. An async validator returns a promise.

```tsx
import type {Validator, JsonSchemaString} from '@gravity-ui/dynamic-forms/unstable';

// Return a string for a field error, an object for child errors, undefined for ok.
export const uniqueLogin: Validator<JsonSchemaString> = async (value) => {
  if (!value) {
    return undefined;
  }
  const taken = await api.isLoginTaken(value);
  return taken ? 'This login is already taken' : undefined;
};
```

Returning `true` produces an error with no text — return a string or `undefined`. A promise must not reject (see [Caveats](./limitations.md)).

## External errors after submit

kit builds the error text from `srState.errors`, not from final-form's `submitErrors`. Supply server errors via `addExternalErrors` with the full field path. They are not cleared on edit — clear them manually.

```tsx
import {useForm} from 'react-final-form';
import {useSchemaRendererTools} from '@gravity-ui/dynamic-forms/unstable';

function SaveButton() {
  const form = useForm();
  const {addExternalErrors, removeExternalErrors} = useSchemaRendererTools();

  const onSave = async () => {
    // external errors are not cleared on edit — clear them manually
    removeExternalErrors({headName: '', removeFunctionOrNames: ['login']});
    const result = await api.save(form.getState().values);
    if (result.fieldErrors) {
      addExternalErrors({headName: '', regularErrors: result.fieldErrors});
    }
  };

  return (
    <button type="button" onClick={onSave}>
      Save
    </button>
  );
}
```

## Dynamic schema

Patches change the working copy of the schema on the fly. `merge` adds leaves, `replace: true` replaces the node entirely; replacing a branch loses the original `nodeParameters` and `title` — redefine them in the patch.

```tsx
import {useSchemaRendererTools} from '@gravity-ui/dynamic-forms/unstable';

function useBindRange() {
  const {addSchemaPatches, removeSchemaPatches} = useSchemaRendererTools();

  const setMin = (min: number) =>
    addSchemaPatches({
      patches: [{headName: '', schemaPath: '#/properties/to', schema: {minimum: min}}],
    });

  // schema: true removes all patches at this path
  const clearMin = () =>
    removeSchemaPatches({
      patchesToRemove: [{headName: '', schemaPath: '#/properties/to', schema: true}],
    });

  return {setMin, clearMin};
}
```

## Standalone renderer

`useSchemaRenderer` lifts state without rendering anything; parts of the schema are drawn by hand with `SchemaRendererNode`. It fits a step wizard or mixing form and overview. With `destroyOnUnregister` the values of a gone step are cleared.

```tsx
import {
  useSchemaRenderer,
  SchemaRendererNode,
  SchemaRendererMode,
  config,
  errorMessages,
} from '@gravity-ui/dynamic-forms/unstable';

// Inside <Form>. The hook lifts state BEFORE the nodes render.
function WizardBody({schema, step}: {schema: any; step: number}) {
  useSchemaRenderer({
    name: '',
    schema,
    mode: SchemaRendererMode.Form,
    config,
    errorMessages,
    validateOnBlur: false,
  });

  const fields = step === 0 ? ['login', 'email'] : ['password'];

  // Validation always runs against the whole schema under headName:
  // an error on a hidden step also blocks submit.
  return fields.map((key) => (
    <SchemaRendererNode key={key} headName="" name={key} schemaPath={'#/properties/' + key} />
  ));
}
```
