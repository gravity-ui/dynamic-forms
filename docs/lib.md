# Dynamic forms

The library uses [specs](./spec.md#specs) to describe the entities of arrays, objects, strings, numbers, and boolean values. The entity description includes instructions for drawing and validating the entity. The library interacts on two levels: [Layouts](./config.md#layouts) and [Inputs](./config.md#inputs).

And it is intended to be used with `final-form`.

## Form

### DynamicField

This component serves as the primary entry point for drawing dynamic forms.

| Property                | Type                                     | Required | Description                                                                                                                                               |
| :---------------------- | :--------------------------------------- | :------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name                    | `string`                                 |   yes    | Field name                                                                                                                                                |
| spec                    | `Spec`                                   |   yes    | A [spec](./spec.md#specs) describing the entity                                                                                                           |
| config                  | `DynamicFormConfig`                      |   yes    | A [config](./config.md) containing [Inputs](./config.md#inputs), [Layouts](./config.md#layouts), and [validators](./config.md#validators) for each entity |
| Monaco                  | `React.ComponentType<MonacoEditorProps>` |          | [MonacoEditor](https://github.com/react-monaco-editor/react-monaco-editor) component for Monaco [Input](./config.md#inputs)                               |
| search                  | `string \| function`                     |          | A string or function for performing a form search                                                                                                         |
| withoutInsertFFDebounce | `boolean`                                |          | Flag that disables the delay before inserting data into the final-form store                                                                              |
| destroyOnUnregister     | `boolean`                                |          | If true, the value of a field will be destroyed when that field is unregistered. Defaults to true                                                         |
| generateRandomValue     | `function`                               |          | Function that is necessary to generate a random value                                                                                                     |
| storeSubscriber         | `(storeValue: FieldValue) => void`       |          | Subscriber function will be called when internal store of dynamic field is changed                                                                        |

### Controller

This component locates all required rendering elements and renders the entity.

| Property        | Type                                                                                                        | Required | Description                                      |
| :-------------- | :---------------------------------------------------------------------------------------------------------- | :------: | :----------------------------------------------- |
| name            | `string`                                                                                                    |   yes    | Field name                                       |
| spec            | `Spec`                                                                                                      |   yes    | An [spec](./spec.md#specs) describing the entity |
| initialValue    | `FieldValue`                                                                                                |   yes    | Initial value                                    |
| parentOnChange  | `((childName: string, childValue: FieldValue, childErrors: Record<string, ValidateError>) => void) \| null` |   yes    | Callback for updating the parent entity's state  |
| parentOnUnmount | `((childName: string) => void) \| null`                                                                     |   yes    | Callback for unmount                             |

## View

### DynamicView

This component serves as the primary entry point for creating an overview of form values.

| Property              | Type                                                                       | Required | Description                                                                                                                 |
| :-------------------- | :------------------------------------------------------------------------- | :------: | :-------------------------------------------------------------------------------------------------------------------------- |
| value                 | `AnyObject`                                                                |   yes    | Form value                                                                                                                  |
| spec                  | `Spec`                                                                     |   yes    | An [spec](./spec.md#specs) describing the entity                                                                            |
| config                | `DynamicViewConfig`                                                        |   yes    | A [config](./config.md) containing [Views](./config.md#views) and [ViewLayouts](./config.md#viewlayouts) for each entity    |
| Link                  | `React.ComponentType<{value: FormValue; link: Spec['viewSpec']['link'];}>` |          | [Component](./spec.md#link) for converting values to links                                                                  |
| Monaco                | `React.ComponentType<MonacoEditorProps>`                                   |          | [MonacoEditor](https://github.com/react-monaco-editor/react-monaco-editor) component for Monaco [Input](./config.md#inputs) |
| showLayoutDescription | boolean                                                                    |          | enable to show viewSpec.layoutDescription hint                                                                              |

### ViewController

This component searches for all required rendering elements and renders the entity.

| Property | Type     | Required | Description                                      |
| :------- | :------- | :------: | :----------------------------------------------- |
| name     | `string` |   yes    | View name                                        |
| spec     | `Spec`   |   yes    | An [spec](./spec.md#specs) describing the entity |

## Dotted property keys

Dots in `spec.properties` keys are not supported. The library follows the [final-form field name](https://final-form.org/docs/final-form/field-names) convention: a dot is a path separator, so a property key like `a.b` is treated as the path `a` → `b`, not as a literal key of the value object. Values of such properties will not be resolved — fields render without data.

In development mode `DynamicView` warns about such keys in the console. If your data source produces keys with dots, transform both the spec and the values before passing them to the library.
