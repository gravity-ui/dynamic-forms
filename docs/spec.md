## Specs

`Spec` this is an object describing an entity, it's data type, validation rules, how to draw it.

```typescript
type Spec = ArraySpec | BooleanSpec | NumberSpec | ObjectSpec | StringSpec;
```

### ArraySpec

| Property                   | Type                                   | Required | Description                                                                                                                                                                             |
| :------------------------- | :------------------------------------- | :------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| defaultValue               | `FieldArrayValue`                      |          | Default value                                                                                                                                                                           |
| type                       | `"array"`                              |   yes    | Entity type                                                                                                                                                                             |
| required                   | `boolean`                              |          | Can the value be `undefined` or `null`                                                                                                                                                  |
| maxLength                  | `bigint`                               |          | Maximum number of array elements                                                                                                                                                        |
| minLength                  | `bigint`                               |          | Minimum number of array elements                                                                                                                                                        |
| items                      | `Spec`                                 |          | Entity `spec` for an array element                                                                                                                                                      |
| enum                       | `string[]`                             |          | An array of valid values, for example for a select                                                                                                                                      |
| description                | `Record<string, string>`               |          | Beautiful names for values from `enum`                                                                                                                                                  |
| validator                  | `string`                               |          | The key for determining the [validator](./config.md#validators) for the entity, if the value is empty, the base [validator](./config.md#validators) from the entity config will be used |
| viewSpec.disabled          | `boolean`                              |          | Is the field available for editing                                                                                                                                                      |
| viewSpec.type              | `string`                               |   yes    | Key to define [Input](./config.md#inputs) for an entity                                                                                                                                 |
| viewSpec.layout            | `string`                               |          | Key to define [Layout](./config.md#layouts) for an entity                                                                                                                               |
| viewSpec.layoutTitle       | `string`                               |          | Title for [Layout](./config.md#layouts)                                                                                                                                                 |
| viewSpec.layoutDescription | `string`                               |          | Additional description/hint for [Layout](./config.md#layouts)                                                                                                                           |
| viewSpec.layoutOpen        | `boolean`                              |          | Expand [Layout](./config.md#layouts) at the first rendering                                                                                                                             |
| viewSpec.itemLabel         | `string`                               |          | Text for the button that adds an array element                                                                                                                                          |
| viewSpec.itemPrefix        | `string`                               |          | Additional text for an element in the array                                                                                                                                             |
| viewSpec.table             | `{label: string; property: string;}[]` |          | An array whose elements are used to establish column names and their order, if `type === "table"`                                                                                       |
| viewSpec.link              | `any`                                  |          | A field containing information for forming a [link](#link) for a value                                                                                                                  |
| viewSpec.placeholder       | `string`                               |          | A short hint displayed in the field before the user enters the value                                                                                                                    |
| viewSpec.addButtonPosition | `"down"/"right"`                       |          | The location of the button adding a new element to the array. Default value "down".                                                                                                     |
| viewSpec.hidden            | `boolean`                              |          | Hide field and view                                                                                                                                                                     |
| viewSpec.selectParams      | `object`                               |          | [Parameters](#selectparams) additional options for the selector                                                                                                                         |

### BooleanSpec

| Property                   | Type        | Required | Description                                                                                                                                                                             |
| :------------------------- | :---------- | :------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| defaultValue               | `boolean`   |          | Default value                                                                                                                                                                           |
| type                       | `"boolean"` |   yes    | Entity type                                                                                                                                                                             |
| required                   | `boolean`   |          | For `true`, will show validation error if form field value is `false`                                                                                                                   |
| validator                  | `string`    |          | The key for determining the [validator](./config.md#validators) for the entity, if the value is empty, the base [validator](./config.md#validators) from the entity config will be used |
| viewSpec.disabled          | `boolean`   |          | Is the field available for editing                                                                                                                                                      |
| viewSpec.type              | `string`    |   yes    | Key to define [Input](./config.md#inputs) for an entity                                                                                                                                 |
| viewSpec.layout            | `string`    |          | Key to define [Layout](./config.md#layouts) for an entity                                                                                                                               |
| viewSpec.layoutTitle       | `string`    |          | Title for [Layout](./config.md#layouts)                                                                                                                                                 |
| viewSpec.layoutDescription | `string`    |          | Additional description/hint for [Layout](./config.md#layouts)                                                                                                                           |
| viewSpec.layoutOpen        | `boolean`   |          | Expand [Layout](./config.md#layouts) at the first rendering                                                                                                                             |
| viewSpec.link              | `any`       |          | A field containing information for forming a [link](#link) for a value                                                                                                                  |
| viewSpec.hidden            | `boolean`   |          | Hide field and view                                                                                                                                                                     |

### NumberSpec

| Property                   | Type              | Required | Description                                                                                                                                                                             |
| :------------------------- | :---------------- | :------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| defaultValue               | `number`          |          | Default value                                                                                                                                                                           |
| type                       | `"number"`        |   yes    | Entity type                                                                                                                                                                             |
| required                   | `boolean`         |          | Can the value be `undefined` or `null`                                                                                                                                                  |
| maximum                    | `number`          |          | Maximum value                                                                                                                                                                           |
| minimum                    | `number`          |          | Minimum value                                                                                                                                                                           |
| format                     | `"float"/"int64"` |          | Validation rule                                                                                                                                                                         |
| validator                  | `string`          |          | The key for determining the [validator](./config.md#validators) for the entity, if the value is empty, the base [validator](./config.md#validators) from the entity config will be used |
| viewSpec.disabled          | `boolean`         |          | Is the field available for editing                                                                                                                                                      |
| viewSpec.type              | `string`          |   yes    | Key to define [Input](./config.md#inputs) for an entity                                                                                                                                 |
| viewSpec.layout            | `string`          |          | Key to define [Layout](./config.md#layouts) for an entity                                                                                                                               |
| viewSpec.layoutTitle       | `string`          |          | Title for [Layout](./config.md#layouts)                                                                                                                                                 |
| viewSpec.layoutDescription | `string`          |          | Additional description/hint for [Layout](./config.md#layouts)                                                                                                                           |
| viewSpec.layoutOpen        | `boolean`         |          | Expand [Layout](./config.md#layouts) at the first rendering                                                                                                                             |
| viewSpec.link              | `any`             |          | A field containing information for forming a [link](#link) for a value                                                                                                                  |
| viewSpec.placeholder       | `string`          |          | A short hint displayed in the field before the user enters the value                                                                                                                    |
| viewSpec.copy              | `boolean`         |          | For `true`, will add a copy value button                                                                                                                                                |
| viewSpec.hidden            | `boolean`         |          | Hide field and view                                                                                                                                                                     |

### ObjectSpec

| Property                   | Type                     | Required | Description                                                                                                                                                                             |
| :------------------------- | :----------------------- | :------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| defaultValue               | `FieldObjectValue`       |          | Default value                                                                                                                                                                           |
| type                       | `"object"`               |   yes    | Entity type                                                                                                                                                                             |
| required                   | `boolean`                |          | Can the value be `undefined` or `null`                                                                                                                                                  |
| properties                 | `Record<string, Spec>`   |          | `Specs` of child entities                                                                                                                                                               |
| description                | `Record<string, string>` |          | Easy-to-understand names for keys from `properties`                                                                                                                                     |
| validator                  | `string`                 |          | The key for determining the [validator](./config.md#validators) for the entity, if the value is empty, the base [validator](./config.md#validators) from the entity config will be used |
| viewSpec.disabled          | `boolean`                |          | Is the field available for editing                                                                                                                                                      |
| viewSpec.type              | `string`                 |   yes    | Key to define [Input](./config.md#inputs) for an entity                                                                                                                                 |
| viewSpec.layout            | `string`                 |          | Key to define [Layout](./config.md#layouts) for an entity                                                                                                                               |
| viewSpec.layoutTitle       | `string`                 |          | Title for [Layout](./config.md#layouts)                                                                                                                                                 |
| viewSpec.layoutDescription | `string`                 |          | Additional description/hint for [Layout](./config.md#layouts)                                                                                                                           |
| viewSpec.layoutOpen        | `boolean`                |          | Expand [Layout](./config.md#layouts) at the first rendering                                                                                                                             |
| viewSpec.order             | `string[]`               |          | Array of `properties` keys in the right order                                                                                                                                           |
| viewSpec.link              | `any`                    |          | A field containing information for forming a [link](#link) for a value                                                                                                                  |
| viewSpec.oneOfParams       | `object`                 |          | [Parameters](#oneofparams) that must be passed to oneof input                                                                                                                           |
| viewSpec.placeholder       | `string`                 |          | A short hint displayed in the field before the user enters the value                                                                                                                    |
| viewSpec.hidden            | `boolean`                |          | Hide field and view                                                                                                                                                                     |

### StringSpec

| Property                     | Type                     | Required | Description                                                                                                                                                                             |
| :--------------------------- | :----------------------- | :------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| defaultValue                 | `string`                 |          | Default value                                                                                                                                                                           |
| type                         | `"string"`               |   yes    | Entity type                                                                                                                                                                             |
| required                     | `boolean`                |          | Can the value be `undefined` or `null`                                                                                                                                                  |
| maxLength                    | `bigint`                 |          | Maximum string length                                                                                                                                                                   |
| minLength                    | `bigint`                 |          | Minimum string length                                                                                                                                                                   |
| pattern                      | `string`                 |          | RegExp to check the field value                                                                                                                                                         |
| patternError                 | `string`                 |          | The text of the validation error by `pattern`                                                                                                                                           |
| enum                         | `string[]`               |          | An array of valid values, for example for a select                                                                                                                                      |
| description                  | `Record<string, string>` |          | Easy-to-understand names for values from `enum`                                                                                                                                         |
| validator                    | `string`                 |          | The key for determining the [validator](./config.md#validators) for the entity, if the value is empty, the base [validator](./config.md#validators) from the entity config will be used |
| viewSpec.disabled            | `boolean`                |          | Is the field available for editing                                                                                                                                                      |
| viewSpec.type                | `string`                 |   yes    | Key to define [Input](./config.md#inputs) for an entity                                                                                                                                 |
| viewSpec.layout              | `string`                 |          | Key to define [Layout](./config.md#layouts) for an entity                                                                                                                               |
| viewSpec.layoutTitle         | `string`                 |          | Title for [Layout](./config.md#layouts)                                                                                                                                                 |
| viewSpec.layoutDescription   | `string`                 |          | Additional description/hint for [Layout](./config.md#layouts)                                                                                                                           |
| viewSpec.layoutOpen          | `boolean`                |          | Expand [Layout](./config.md#layouts) at the first rendering                                                                                                                             |
| viewSpec.link                | `any`                    |          | A field containing information for forming a [link](#link) for a value                                                                                                                  |
| viewSpec.hideValues          | `string[]`               |          | Values that are equated to empty, to exclude the rendering of unfilled fields (for example, for `enum` with `_UNSPECIFIED`)                                                             |
| viewSpec.sizeParams          | `object`                 |          | [Parameters](#sizeparams) that must be passed for an input with dimensions                                                                                                              |
| viewSpec.monacoParams        | `object`                 |          | [Parameters](#monacoparams) that must be passed to Monaco editor                                                                                                                        |
| viewSpec.placeholder         | `string`                 |          | A short hint displayed in the field before the user enters the value                                                                                                                    |
| viewSpec.fileInput           | `object`                 |          | [Parameters](#FileInput) that must be passed to file input                                                                                                                              |
| viewSpec.copy                | `boolean`                |          | For `true`, will add a copy value button                                                                                                                                                |
| viewSpec.hidden              | `boolean`                |          | Hide field and view                                                                                                                                                                     |
| viewSpec.textContentParams   | `object`                 |          | [Parameters](#textcontentparams) that must be passed to text content                                                                                                                    |
| viewSpec.selectParams        | `object`                 |          | [Parameters](#selectparams) additional options for the selector                                                                                                                         |
| viewSpec.generateRandomValue | `boolean`                |          | Displays a button for generating a random value using regexp                                                                                                                            |

#### SizeParams

| Property    | Type                                              | Required | Description                                                                                                                                 |
| :---------- | :------------------------------------------------ | :------: | :------------------------------------------------------------------------------------------------------------------------------------------ |
| scale       | `Record<string, {factor: string; title: string}>` |   yes    | The key of the object is the dimension type, factor is the dimension multiplier, title is an easy-to-understand name for the dimension type |
| defaultType | `string`                                          |   yes    | The type of dimension in which the form receives and returns a value                                                                        |
| viewType    | `string`                                          |          | The type of dimension that will be set at the first render                                                                                  |

#### MonacoParams

| Property | Type     | Required | Description                  |
| :------- | :------- | :------: | :--------------------------- |
| language | `string` |   yes    | Syntax highlighting language |
| fontSize | `string` |          | Font size                    |

#### OneOfParams

| Property | Type                          | Required | Description |
| :------- | :---------------------------- | :------: | :---------- |
| toggler  | `'select'` `'radio'` `'card'` |          | Switch type |

#### FileInput

| Property     | Type                                                                          | Required | Description                                                                            |
| :----------- | :---------------------------------------------------------------------------- | :------: | :------------------------------------------------------------------------------------- |
| accept       | `string`                                                                      |          | Acceptable file extensions, for example: `'.png'`, `'audio/\*'`, `'.jpg, .jpeg, .png'` |
| readAsMethod | `'readAsArrayBuffer'` `'readAsBinaryString'` `'readAsDataURL'` `'readAsText'` |          | File reading method                                                                    |
| ignoreText   | `boolean`                                                                     |          | For `true`, will show the `File uploaded` stub instead of the field value              |

#### TextContentParams

| Property   | Type                                                                                                                                                                                                                                                                                              | Required | Description                                                         |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------: | :------------------------------------------------------------------ |
| themeLabel | `'normal'` `'info'` `'danger'` `'warning'` `'success'` `'unknown'`                                                                                                                                                                                                                                |          | Label color                                                         |
| text       | `string`                                                                                                                                                                                                                                                                                          |   yes    | Text for input                                                      |
| icon       | `string`                                                                                                                                                                                                                                                                                          |          | Icon name from the [library](https://gravity-ui.com/icons)          |
| iconColor  | `'primary'` `'complementary'` `'secondary'` `'hint'` `'info'` `'info-heavy'` `'positive'` `'positive-heavy'` `'warning'` `'warning-heavy'` `'danger'` `'danger-heavy'` `'utility'` `'utility-heavy'` `'misc'` `'misc-heavy'` `'brand'` `'dark-primary'` `'dark-complementary'` `'dark-secondary'` |          | The color of the icon, if it does not have the themeLabel parameter |

#### SelectParams

| Property          | Type                     | Required | Description                     |
| :---------------- | :----------------------- | :------: | :------------------------------ |
| filterPlaceholder | `string`                 |          | Placeholder for filter          |
| meta              | `Record<string, string>` |          | Additional text for enum values |

#### Link

A component that serves as a wrapper for the value, if necessary, rendering the value as a link.

```typescript
type Link = React.ComponentType<{
  value: FormValue;
  link: Spec['viewSpec']['link'];
}>;
```
