# Migrating to stable SchemaRenderer

**English** · [Русский](MIGRATION-ru.md)

[← Back to documentation](README.md#contents)

The package root now exports SchemaRenderer, previously available from `@gravity-ui/dynamic-forms/unstable`. The previous DynamicField / DynamicView API moves to `@gravity-ui/dynamic-forms/deprecated`. The `/unstable` entry point is removed.

For an application using the previous main API, migration means replacing its renderer, schema and extension contracts. Changing the import to `/deprecated` is a way to keep an existing form running while migrating it, not a migration to SchemaRenderer.

## Choose the starting point

| Current usage                                                                          | Migration                                                                                  |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `DynamicField`, `DynamicView`, `Spec`, old configs or components from the package root | Follow [Old main API → new main API](#old-main-api--new-main-api).                         |
| SchemaRenderer and its extensions from `/unstable`                                     | Follow [Unstable → main API](#unstable--main-api).                                         |
| A mixture of both APIs                                                                 | Migrate each usage according to its contract. Both APIs can coexist during the transition. |
| An old form that cannot be migrated yet                                                | Use [the deprecated entry point](#keeping-an-old-form-during-migration) temporarily.       |

## Prerequisites and imports

Both public entry points require **UIKit 8**. `/deprecated` preserves the old dynamic-forms API; it does not provide compatibility with UIKit 7. See the [UIKit migration guide](https://github.com/gravity-ui/uikit/blob/main/docs/migration-to-v8.md) for changes needed in the consuming application. The package's current peer dependency ranges are listed in [package.json](package.json).

An application can use both the old root API and SchemaRenderer through `/unstable`, including direct component and type imports outside form wrappers. Distinguish these usages before changing their imports:

```shell
rg -n '@gravity-ui/dynamic-forms' --glob '!**/node_modules/**' --glob '!**/*lock*'
```

Some exports keep their names but have different contracts in the new main API; see [Direct imports](#direct-imports-components-types-and-helpers).

## Old main API → new main API

### 1. Replace DynamicField and the Spec definition

Before, using the previous package version:

```tsx
import React from 'react';
import {Form} from 'react-final-form';
import {DynamicField, SpecTypes, dynamicConfig, type Spec} from '@gravity-ui/dynamic-forms';

const spec: Spec = {
  type: SpecTypes.Object,
  viewSpec: {type: 'base'},
  properties: {
    login: {
      type: SpecTypes.String,
      required: true,
      viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Login'},
    },
  },
};

export function ProfileForm() {
  return (
    <Form initialValues={{login: 'alice'}} onSubmit={(values) => console.log(values)}>
      {({handleSubmit}) => (
        <form onSubmit={handleSubmit}>
          <DynamicField name="" spec={spec} config={dynamicConfig} />
          <button type="submit">Save</button>
        </form>
      )}
    </Form>
  );
}
```

After, using the new main API:

```tsx
import React from 'react';
import {Form} from 'react-final-form';
import {
  JsonSchemaType,
  NodeType,
  SchemaRenderer,
  SchemaRendererMode,
  config,
  errorMessages,
  type JsonSchema,
} from '@gravity-ui/dynamic-forms';

const schema: JsonSchema = {
  type: JsonSchemaType.Object,
  nodeParameters: {type: NodeType.Object, entity: 'base'},
  required: ['login'],
  properties: {
    login: {
      type: JsonSchemaType.String,
      title: 'Login',
      minLength: 1,
      nodeParameters: {
        type: NodeType.String,
        entity: 'base',
        layout: 'row',
        flags: {required: true},
      },
    },
  },
};

export function ProfileForm() {
  return (
    <Form
      initialValues={{login: 'alice'}}
      onSubmit={(values) => console.log(values)}
      validateOnBlur={false}
    >
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

This preserves the submitted value shape `{login: string}`. `name=""` binds the whole form object; `name="profile"` would instead bind `values.profile`. Keep the original field path when migrating a subtree of a larger form.

Keep the application's UIKit `ThemeProvider` around the form. SchemaRenderer uses `Form` from `react-final-form`; its nodes register their fields, so an additional `Field` wrapper is not needed. Pass the same `validateOnBlur` value to `Form` and SchemaRenderer. Use your migrated application config instead of the built-in `config` when the form contains custom components.

### 2. Move Spec fields to JSON Schema and nodeParameters

JSON Schema describes the value and validation. `nodeParameters` describes how a node is rendered. An **entity** is the input or value component; a **layout** is its surrounding title, description, error and spacing.

Migrate nested `properties` and `items` recursively too: their children must be JSON Schema nodes, not unchanged Spec objects.

| Old Spec / viewSpec                                            | New schema                                                                                                                                                                                                     |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type: SpecTypes.String`                                       | `type: JsonSchemaType.String` for the value; `nodeParameters.type: NodeType.String` for config lookup.                                                                                                         |
| `properties`, `items`, `enum`, `minimum`, `maximum`, `pattern` | Corresponding JSON Schema fields; check the value types accepted by the new schema.                                                                                                                            |
| `defaultValue`                                                 | `default`.                                                                                                                                                                                                     |
| `format: 'int64'`                                              | `type: integer`.                                                                                                                                                                                               |
| A child's `required: true`                                     | The parent's `required: ['childName']`, plus appropriate non-empty constraints on the child.                                                                                                                   |
| `viewSpec.type`                                                | `nodeParameters.entity`, or separate `formEntity` and `overviewEntity`. Some built-in keys change; see the [converter mapping](#viewspectype--entity).                                                         |
| `viewSpec.inputProps`                                          | `nodeParameters.entityProps`, or mode-specific `formEntityProps` / `overviewEntityProps`; adapt the component's props too.                                                                                     |
| `viewSpec.layout`, `viewSpec.layoutProps`                      | `nodeParameters.layout`, `nodeParameters.layoutProps`, or mode-specific layout settings. The converter maps `row_verbose` to `row` with a description and `section` / `section2` to sections with subheadings. |
| `viewSpec.layoutTitle`, `viewSpec.layoutDescription`           | `title`, `description`.                                                                                                                                                                                        |
| `viewSpec.disabled`, `viewSpec.hidden`, `viewSpec.layoutOpen`  | `nodeParameters.flags.disabled`, `.hidden`, `.open`.                                                                                                                                                           |
| `viewSpec.placeholder`                                         | For a text input, `nodeParameters.entityProps.placeholder`. Other entities have their own props.                                                                                                               |
| `spec.validator`                                               | `nodeParameters.validator`, with a migrated validator registered in the new config.                                                                                                                            |

`required` in JSON Schema checks that a property exists: it does not reject `''` or an empty array. In the example, `minLength: 1` rejects an empty login. Use `minItems: 1` where an array must not be empty. `flags.required` controls the renderer’s required-field behavior and presentation; it is not a validation rule. Review the meaning of required booleans separately: requiring a property and requiring its value to be `true` are different constraints.

When converting `required`, `specToJsonSchema` also sets `flags.required` and adds a `not` / `enum` constraint rejecting `null`, `undefined`, the empty string and `false`.

Do not substitute `readOnly: true` for `flags.disabled`: read-only nodes are hidden in Form mode. Similarly, `writeOnly: true` hides a node in Overview mode. A hidden node can still participate in schema validation.

SchemaRenderer defaults to `coerceInitialValues={true}`, which can normalize initial values to schema types. Set it to `false` if the application must preserve the original types. If defaults are JSON-encoded strings, review `jsonDefaultValues` and any existing parsing in your wrapper: parse them once, not both before rendering and inside the renderer.

See [Schema](docs/en/schema.md) and [Caveats](docs/en/limitations.md) for supported keywords and behavior that needs checking against your existing forms.

### 3. Keep using Spec with the new renderer

An existing `Spec` definition can be used with SchemaRenderer without rewriting it immediately. Convert it with `specToJsonSchema` and pass the result as the renderer's `schema`. This works regardless of where the Spec comes from: application code, a configuration file or an external source. For example, inside a wrapper that receives `spec`:

```tsx
import React from 'react';
import {specToJsonSchema, errorMessages} from '@gravity-ui/dynamic-forms';
import type {Spec} from '@gravity-ui/dynamic-forms/deprecated';

export function useConvertedSchema(spec: Spec) {
  return React.useMemo(() => specToJsonSchema(spec, undefined, undefined, errorMessages), [spec]);
}
```

Use this schema in the Form example above. The only old import in this adapter is a type: rendering already uses the new main API. Once the definition has been migrated to JSON Schema, remove the converter and the old `Spec` type. If an existing wrapper first prepares the Spec (for example, parsing defaults), keep or replace that preparation deliberately and check the resulting values.

#### viewSpec.type → entity

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

#### What does not carry over

The converter maps schema fields; it does **not** migrate your custom components, configs or validators. A custom entity key must exist in your new config. A string validator key must have a corresponding validator in that config; the built-in config has no custom validators. An unregistered string validator key is silently skipped.

The old `DynamicField withSchemaRenderer` shortcut is not a general replacement for this migration: it uses the built-in SchemaRenderer config, not the supplied old `DynamicFormConfig`, and does not transfer the old search, mutator or other application integrations. Prefer an explicit SchemaRenderer with your migrated config.

The converter writes `itemPrefix`, `link` and `addButtonPosition`, but the new kit does not read these parameters. See [Caveats and limitations](docs/en/limitations.md) for these and other edge cases.

### 4. Replace DynamicView with Overview mode

Previously, an overview received its value directly:

```tsx
<DynamicView value={values} spec={spec} config={dynamicViewConfig} />
```

SchemaRenderer has no `value` prop. Put values into a `Form` and use Overview mode. Using `schema` and the imports from the new Form example:

```tsx
export function ProfileOverview({values}: {values: {login: string}}) {
  return (
    <Form initialValues={values} onSubmit={() => undefined}>
      {() => (
        <SchemaRenderer
          name=""
          schema={schema}
          mode={SchemaRendererMode.Overview}
          config={config}
          errorMessages={errorMessages}
          validateOnBlur={false}
        />
      )}
    </Form>
  );
}
```

The new config contains both form and overview components. An old `dynamicViewConfig` cannot be passed as that config unchanged. Register custom value renderers in `overviewEntities` and layouts in `overviewLayouts`. Check empty values, links, formatting and sensitive fields in Overview mode as well as the editable form.

### 5. Migrate custom components, configs and validators

| Previous API                                             | SchemaRenderer                                      |
| -------------------------------------------------------- | --------------------------------------------------- |
| `dynamicConfig[type].inputs`                             | `config[type].formEntities`                         |
| `dynamicConfig[type].layouts`                            | `config[type].formLayouts`                          |
| `dynamicViewConfig[type].views`                          | `config[type].overviewEntities`                     |
| `dynamicViewConfig[type].layouts`                        | `config[type].overviewLayouts`                      |
| Old input component types such as `StringInput`          | `NodeEntity<JsonSchemaString, YourProps>`           |
| Old layout component types                               | `NodeLayout<SchemaType, YourProps>`                 |
| `spec`, `inputProps`, separate `name` in old input props | `schema`, `props`, `input.name` in new entity props |
| An old validator `(spec, value)`                         | A new validator `(value, allValues)`                |

Keep field interaction through `input.value`, `input.onChange`, `input.onBlur` and `input.onFocus`. Adapt how the component reads schema options, disabled state, validation state and size. It is not enough to rename its TypeScript type.

The new `input` follows final-form's contract: pass a new value to `onChange`, not the old updater function or a second `childErrors` argument. The old `arrayInput`, `onDrop` and `parentOnUnmount` helpers are not supplied. Custom array components must adapt their value updates and child rendering to the new node API.

For example, this custom input and validator are ready for the new config:

```tsx
import React from 'react';
import {TextInput} from '@gravity-ui/uikit';
import {
  JsonSchemaType,
  NodeType,
  config,
  getValidationState,
  type JsonSchemaString,
  type NodeEntity,
  type NodesConfig,
  type Validator,
} from '@gravity-ui/dynamic-forms';

const LoginInput: NodeEntity<JsonSchemaString, {placeholder?: string}> = ({
  input,
  meta,
  props,
  schema,
  settings,
}) => (
  <TextInput
    value={input.value ?? ''}
    onUpdate={input.onChange}
    onBlur={input.onBlur}
    onFocus={input.onFocus}
    placeholder={props.placeholder}
    disabled={schema.nodeParameters?.flags?.disabled}
    size={settings?.size}
    validationState={getValidationState(meta)}
  />
);

const allowedLogin: Validator<JsonSchemaString> = (value) =>
  value === 'admin' ? 'This login is reserved' : undefined;

export const appConfig: NodesConfig = {
  ...config,
  [NodeType.String]: {
    ...config[NodeType.String],
    formEntities: {
      ...config[NodeType.String]?.formEntities,
      login: {Component: LoginInput},
    },
    validators: {
      ...config[NodeType.String]?.validators,
      allowedLogin,
    },
  },
};
```

Pass `config={appConfig}` to SchemaRenderer and use this definition for `schema.properties.login`:

```tsx
export const loginSchema: JsonSchemaString = {
  type: JsonSchemaType.String,
  title: 'Login',
  minLength: 1,
  nodeParameters: {
    type: NodeType.String,
    formEntity: 'login',
    formEntityProps: {placeholder: 'Enter a login'},
    overviewEntity: 'base',
    layout: 'row',
    flags: {required: true},
    validator: 'allowedLogin',
  },
};
```

Here the custom input is used for Form and the built-in string value for Overview. Setting just `entity: 'login'` would look up that key in both modes, requiring an overview registration too. When `formEntity` or `overviewEntity` is selected, its mode-specific props replace the common `entityProps` rather than being merged with them.

Preserve the built-in maps when extending the config, as above. A custom layout must render its children and, when applicable, the new `EntityError` component for validation messages. `independent` entities are responsible for composing their supplied layout. See [Extension](docs/en/extension.md) for layouts and type-safe config helpers.

For validators, return an error string or `undefined` for success; asynchronous validators return a promise of the same result. Handle rejected requests inside the validator. If an old validator reads `spec`, move those constraints to JSON Schema or explicitly adapt the validator with the options it needs: the new first argument is the value, not the Spec.

### 6. Migrate application integrations

| Old integration                                                                            | What to do with SchemaRenderer                                                                                                                                |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shared` and old shared-store hooks                                                        | Supply `userContext`; read it through `useSchemaRendererState` inside the form. Adapt consumers of the old store.                                             |
| `Monaco` prop                                                                              | Supply the application's editor component as `userContext.MonacoEditor`. Keep the application's editor loading and worker setup.                              |
| Custom HTML / Markdown rendering                                                           | Supply `userContext.RenderHTMLOrMD`; see the [API reference](docs/en/api.md).                                                                                 |
| `DynamicView`'s `Link` prop or custom views                                                | Implement/register an overview entity with the application's link behavior.                                                                                   |
| `mutators`, `search`, `generateRandomValue`, `storeSubscriber`, `__mirror` on DynamicField | There is no prop-for-prop replacement. Port each behavior to custom entities, final-form value updates, schema patches or state subscriptions as appropriate. |
| Server errors after submission                                                             | Supply field errors through `useSchemaRendererTools().addExternalErrors`; see [external errors](docs/en/extension.md#external-errors-after-submit).           |
| Splitting a form into independently rendered fields or wizard steps                        | Use `useSchemaRenderer` with `SchemaRendererNode`; see [standalone renderer](docs/en/extension.md#standalone-renderer).                                       |

The new kit displays errors from SchemaRenderer state. Do not assume returning final-form `submitErrors` alone will display the same messages as before. External errors use full field paths and must be cleared explicitly when appropriate.

Keep schema objects stable between renders (for example with `useMemo` for converted schemas). A new schema reference resets the renderer's working schema, patches and errors. Keep config and user-context references stable unless their contents change.

### Direct imports: components, types and helpers

Audit these even if all top-level forms go through an application wrapper:

- **`Spec`, `ObjectSpec`, `StringSpec`, etc.** remain old schema types. Replace them with `JsonSchema`, `JsonSchemaObject`, `JsonSchemaString`, etc. only when the schema definitions themselves have been migrated. Keep definitions in the old format typed as `Spec` from `/deprecated` while using the converter.
- **`SpecTypes`** becomes `JsonSchemaType` for value types and `NodeType` for renderer config selection. These are different roles, not one global rename.
- **`DynamicFormConfig` / `DynamicViewConfig`** become `NodesConfig` with the registrations described above. Old configs are not interchangeable with it.
- **`StringInput` and other input / layout names** can still exist at the root but refer to new components with `NodeEntity` / `NodeLayout` contracts. For example, the old `StringInput` type describes an old custom input, while the new root's `StringInput` is a kit component. Do not blindly replace imports or casts.
- **Old views and helpers**, such as `BaseView`, `ViewController`, `ErrorWrapper`, `isArraySpec` or old context hooks, are not generic helpers for the new renderer. Migrate their usage to the new node / layout / state APIs, or keep that particular component on `/deprecated` until it is migrated. New context-dependent components must run inside the renderer's node context.
- **`ErrorMessages`** at the new root is a type for JSON Schema error messages. The ready-made message map is the lowercase `errorMessages` export; it does not have the old runtime `ErrorMessages` contract.
- **Value types**, such as `FieldValue` or `FormValue`, should be reviewed with their usage. Prefer the application's actual submitted-value type at API boundaries; changing a schema type does not transform the values automatically.
- **`configure` and `Lang`** still work from the root; the deprecated entry point shares the same language configuration.

### Check the migrated form

For each migrated form and overview, verify initial and default values, submitted payloads, reset behavior, required and custom validation, server errors, conditional fields, arrays, custom controls and value formatting. Preserve tests for the application-specific behavior, not only successful rendering.

After the last consumer has moved to SchemaRenderer and JSON Schema, remove unused old configs, adapters and `/deprecated` imports. Remove legacy dependencies only after checking whether other application packages still use them.

## Unstable → main API

For code already using SchemaRenderer, the promotion itself changes the public import path, not the renderer's API:

```diff
-import {SchemaRenderer, config} from '@gravity-ui/dynamic-forms/unstable';
-import type {JsonSchema, NodesConfig} from '@gravity-ui/dynamic-forms/unstable';
+import {SchemaRenderer, config} from '@gravity-ui/dynamic-forms';
+import type {JsonSchema, NodesConfig} from '@gravity-ui/dynamic-forms';
```

Update its wrappers, custom entities, hooks, type imports, re-exports and aliases. Existing JSON Schema definitions, `NodesConfig` registrations and renderer props keep their contracts as part of this promotion. If upgrading from an older package version, also account for intervening changes, including the UIKit 8 prerequisite.

If the same application also uses the old root API, apply the old-to-new migration to those usages separately. A single import-path replacement does not handle both.

## Keeping an old form during migration

Use `/deprecated` for code that still needs the old API. It keeps the old renderer, Spec and component contracts available while individual forms are migrated:

```diff
-import {DynamicField, DynamicView, dynamicConfig, dynamicViewConfig} from '@gravity-ui/dynamic-forms';
-import type {Spec, DynamicFormConfig} from '@gravity-ui/dynamic-forms';
+import {DynamicField, DynamicView, dynamicConfig, dynamicViewConfig} from '@gravity-ui/dynamic-forms/deprecated';
+import type {Spec, DynamicFormConfig} from '@gravity-ui/dynamic-forms/deprecated';
```

Update old direct component imports too. Existing Spec definitions do not need to be rewritten for this compatibility route. The old API documentation is in [docs/deprecated](docs/deprecated) and [Deprecated / Readme in Storybook](https://preview.gravity-ui.com/dynamic-forms/?path=/docs/deprecated-readme--docs).

The deprecated kit uses UIKit's legacy components. Its dependencies below are optional peers of dynamic-forms, so applications using this kit must provide them:

```shell
npm install @hello-pangea/dnd@^18.0.1 react-window@^1.8.11 react-virtualized-auto-sizer@^1.0.26
```

SchemaRenderer does not need these three packages. Both routes still require UIKit 8.

## Repository, Storybook and tests

- `src/lib/unstable/core` and `src/lib/unstable/kit` move to `src/lib/core` and `src/lib/kit`. The old implementations move under `src/lib/deprecated`.
- SchemaRenderer stories move to Storybook's top level. Previous stories and Storybook documentation move under `Deprecated`, at the bottom of the sidebar.
- The main guides are the root [README](README.md) and [MIGRATION](MIGRATION.md), also available in Russian. Detailed reference chapters remain in `docs/en` and `docs/ru`; old documentation is in [docs/deprecated](docs/deprecated).
- Component tests and screenshots move with their components. The default command and CI run both suites; each can also run separately:

```shell
npm run playwright             # All component tests
npm run playwright:schema      # SchemaRenderer
npm run playwright:deprecated  # Previous API
```

See the [Playwright guide](playwright/README.md) for setup.
