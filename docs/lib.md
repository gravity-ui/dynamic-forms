# Dynamic forms

The library uses [specs](./spec.md#specs) to describe the entities of arrays, objects, strings, numbers, and boolean values. The entity description includes instructions for drawing and validating the entity. The library interacts on two levels: [Layouts](./config.md#layouts) and [Inputs](./config.md#inputs).

And it is intended to be used with `final-form`.

## Form

### DynamicField

This component serves as the primary entry point for drawing dynamic forms.

| Property | Type                                     | Required | Description                                                                                                                                               |
| :------- | :--------------------------------------- | :------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name     | `string`                                 |   yes    | Field name                                                                                                                                                |
| spec     | `Spec`                                   |   yes    | A [spec](./spec.md#specs) describing the entity                                                                                                           |
| config   | `DynamicFormConfig`                      |   yes    | A [config](./config.md) containing [Inputs](./config.md#inputs), [Layouts](./config.md#layouts), and [validators](./config.md#validators) for each entity |
| Monaco   | `React.ComponentType<MonacoEditorProps>` |          | [MonacoEditor](https://github.com/react-monaco-editor/react-monaco-editor) component for Monaco [Input](./config.md#inputs)                               |
| search   | `string \| function`                     |          | A string or function for performing a form search                                                                                                         |

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

| Property | Type                                                                       | Required | Description                                                                                                                 |
| :------- | :------------------------------------------------------------------------- | :------: | :-------------------------------------------------------------------------------------------------------------------------- |
| value    | `AnyObject`                                                                |   yes    | Form value                                                                                                                  |
| spec     | `Spec`                                                                     |   yes    | An [spec](./spec.md#specs) describing the entity                                                                            |
| config   | `DynamicViewConfig`                                                        |   yes    | A [config](./config.md) containing [Views](./config.md#views) and [ViewLayouts](./config.md#viewlayouts) for each entity    |
| Link     | `React.ComponentType<{value: FormValue; link: Spec['viewSpec']['link'];}>` |          | [Component](./spec.md#link) for converting values to links                                                                  |
| Monaco   | `React.ComponentType<MonacoEditorProps>`                                   |          | [MonacoEditor](https://github.com/react-monaco-editor/react-monaco-editor) component for Monaco [Input](./config.md#inputs) |

### ViewController

This component searches for all required rendering elements and renders the entity.

| Property | Type     | Required | Description                                      |
| :------- | :------- | :------: | :----------------------------------------------- |
| name     | `string` |   yes    | View name                                        |
| spec     | `Spec`   |   yes    | An [spec](./spec.md#specs) describing the entity |
