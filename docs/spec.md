## Specs

`Spec` this is an object describing an entity, it's data type, validation rules, how to draw it.

```typescript
type Spec = ArraySpec | BooleanSpec | NumberSpec | ObjectSpec | StringSpec;
```

### ArraySpec

| Property                     | Type                                                                         | Required | Description                                                                                                                                                                                                    |
| :--------------------------- | :--------------------------------------------------------------------------- | :------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| defaultValue                 | `FieldArrayValue`                                                            |          | Default value                                                                                                                                                                                                  |
| type                         | `"array"`                                                                    |   yes    | Entity type                                                                                                                                                                                                    |
| required                     | `boolean`                                                                    |          | Can the value be `undefined` or `null`                                                                                                                                                                         |
| maxLength                    | `bigint`                                                                     |          | Maximum number of array elements                                                                                                                                                                               |
| minLength                    | `bigint`                                                                     |          | Minimum number of array elements                                                                                                                                                                               |
| items                        | `Spec`                                                                       |          | Entity `spec` for an array element                                                                                                                                                                             |
| enum                         | `string[]`                                                                   |          | An array of valid values, for example for a select                                                                                                                                                             |
| description                  | `Record<string, string>`                                                     |          | Beautiful names for values from `enum`                                                                                                                                                                         |
| validator                    | `string`                                                                     |          | The key for determining the [validator](./config.md#validators) for the entity, if the value is empty, the base [validator](./config.md#validators) from the entity config will be used                        |
| viewSpec.disabled            | `boolean`                                                                    |          | Is the field available for editing                                                                                                                                                                             |
| viewSpec.type                | `string`                                                                     |   yes    | Key to define [Input](./config.md#inputs) for an entity                                                                                                                                                        |
| viewSpec.layout              | `string`                                                                     |          | Key to define [Layout](./config.md#layouts) for an entity                                                                                                                                                      |
| viewSpec.layoutTitle         | `string`                                                                     |          | Title for [Layout](./config.md#layouts)                                                                                                                                                                        |
| viewSpec.layoutDescription   | `string`                                                                     |          | Additional description/hint for [Layout](./config.md#layouts)                                                                                                                                                  |
| viewSpec.layoutOpen          | `boolean`                                                                    |          | Expand [Layout](./config.md#layouts) at the first rendering                                                                                                                                                    |
| viewSpec.itemLabel           | `string`                                                                     |          | Text for the button that adds an array element                                                                                                                                                                 |
| viewSpec.itemPrefix          | `string`                                                                     |          | Additional text for an element in the array                                                                                                                                                                    |
| viewSpec.table               | `{label: string; property: string; description?: string; width?: number;}[]` |          | An array whose elements are used to establish column names and their order, if `type === "table"`. `description` adds a hint to a field in the table's header. `width` sets the width of the column in pixels. |
| viewSpec.link                | `any`                                                                        |          | A field containing information for forming a [link](#link) for a value                                                                                                                                         |
| viewSpec.placeholder         | `string`                                                                     |          | A short hint displayed in the field before the user enters the value                                                                                                                                           |
| viewSpec.addButtonPosition   | `"down"/"right"`                                                             |          | The location of the button adding a new element to the array. Default value "down".                                                                                                                            |
| viewSpec.hidden              | `boolean`                                                                    |          | Hide field and view                                                                                                                                                                                            |
| viewSpec.selectParams        | `object`                                                                     |          | [Parameters](#selectparams) additional options for the selector                                                                                                                                                |
| viewSpec.checkboxGroupParams | `object`                                                                     |          | [Parameters](#checkboxgroupparams) additional options for the checkbox group                                                                                                                                   |
| viewSpec.inputProps          | `object`                                                                     |          | [InputProps](./input-props-map.md) Additional properties for internal input components                                                                                                                         |

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
| viewSpec.inputProps        | `object`    |          | [InputProps](./input-props-map.md) Additional properties for internal input components                                                                                                  |

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
| viewSpec.inputProps        | `object`          |          | [InputProps](./input-props-map.md) Additional properties for internal input components                                                                                                  |

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
| viewSpec.delimiter         | `Record<string, string>` |          | Values of delimiters of inline object input elements                                                                                                                                    |

### StringSpec

| Property                           | Type                     | Required | Description                                                                                                                                                                             |
| :--------------------------------- | :----------------------- | :------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| defaultValue                       | `string`                 |          | Default value                                                                                                                                                                           |
| type                               | `"string"`               |   yes    | Entity type                                                                                                                                                                             |
| required                           | `boolean`                |          | Can the value be `undefined` or `null`                                                                                                                                                  |
| maxLength                          | `bigint`                 |          | Maximum string length                                                                                                                                                                   |
| minLength                          | `bigint`                 |          | Minimum string length                                                                                                                                                                   |
| pattern                            | `string`                 |          | RegExp to check the field value                                                                                                                                                         |
| patternError                       | `string`                 |          | The text of the validation error by `pattern`                                                                                                                                           |
| enum                               | `string[]`               |          | An array of valid values, for example for a select                                                                                                                                      |
| description                        | `Record<string, string>` |          | Easy-to-understand names for values from `enum`                                                                                                                                         |
| validator                          | `string`                 |          | The key for determining the [validator](./config.md#validators) for the entity, if the value is empty, the base [validator](./config.md#validators) from the entity config will be used |
| viewSpec.disabled                  | `boolean`                |          | Is the field available for editing                                                                                                                                                      |
| viewSpec.type                      | `string`                 |   yes    | Key to define [Input](./config.md#inputs) for an entity                                                                                                                                 |
| viewSpec.layout                    | `string`                 |          | Key to define [Layout](./config.md#layouts) for an entity                                                                                                                               |
| viewSpec.layoutTitle               | `string`                 |          | Title for [Layout](./config.md#layouts)                                                                                                                                                 |
| viewSpec.layoutDescription         | `string`                 |          | Additional description/hint for [Layout](./config.md#layouts)                                                                                                                           |
| viewSpec.layoutOpen                | `boolean`                |          | Expand [Layout](./config.md#layouts) at the first rendering                                                                                                                             |
| viewSpec.link                      | `any`                    |          | A field containing information for forming a [link](#link) for a value                                                                                                                  |
| viewSpec.hideValues                | `string[]`               |          | Values that are equated to empty, to exclude the rendering of unfilled fields (for example, for `enum` with `_UNSPECIFIED`)                                                             |
| viewSpec.sizeParams                | `object`                 |          | [Parameters](#sizeparams) that must be passed for an input with dimensions                                                                                                              |
| viewSpec.monacoParams              | `object`                 |          | [Parameters](#monacoparams) that must be passed to Monaco editor                                                                                                                        |
| viewSpec.placeholder               | `string`                 |          | A short hint displayed in the field before the user enters the value                                                                                                                    |
| viewSpec.fileInput                 | `object`                 |          | [Parameters](#FileInput) that must be passed to file input                                                                                                                              |
| viewSpec.copy                      | `boolean`                |          | For `true`, will add a copy value button                                                                                                                                                |
| viewSpec.hidden                    | `boolean`                |          | Hide field and view                                                                                                                                                                     |
| viewSpec.textContentParams         | `object`                 |          | [Parameters](#textcontentparams) that must be passed to text content                                                                                                                    |
| viewSpec.selectParams              | `object`                 |          | [Parameters](#selectparams) additional options for the selector                                                                                                                         |
| viewSpec.generateRandomValueButton | `boolean`                |          | Shows a button that allows you to generate a random value depending on the passed [function generateRandomValue](./lib.md#dynamicfield)                                                 |
| viewSpec.inputProps                | `object`                 |          | [InputProps](./input-props-map.md) Additional properties for internal input components                                                                                                  |
| viewSpec.dateInput                 | `object`                 |          | [Parameters](#dateinput) additional options for the date picker                                                                                                                         |
| viewSpec.radioGroupParams          | `object`                 |          | [Parameters](#radiogroupparams) additional options for the radio group                                                                                                                  |

#### SizeParams

| Property    | Type                                              | Required | Description                                                                                                                                 |
| :---------- | :------------------------------------------------ | :------: | :------------------------------------------------------------------------------------------------------------------------------------------ |
| scale       | `Record<string, {factor: string; title: string}>` |   yes    | The key of the object is the dimension type, factor is the dimension multiplier, title is an easy-to-understand name for the dimension type |
| defaultType | `string`                                          |   yes    | The type of dimension in which the form receives and returns a value                                                                        |
| viewType    | `string`                                          |          | The type of dimension that will be set at the first render                                                                                  |

#### MonacoParams

| Property               | Type     | Required | Description                  |
| :--------------------- | :------- | :------: | :--------------------------- |
| language               | `string` |   yes    | Syntax highlighting language |
| fontSize               | `string` |          | Font size                    |
| headerIconSize         | `number` |          | Size of the header icon      |
| headerIconIndent       | `number` |          | Indent of the header icon    |
| headerTitleVariant     | `string` |          | Variant of the header title  |
| headerDialogButtonSize | `string` |          | Size of the dialog button    |
| headerDialogIconSize   | `number` |          | Size of the dialog icon      |

#### OneOfParams

| Property   | Type                                       | Required | Description                                    |
| :--------- | :----------------------------------------- | :------: | :--------------------------------------------- |
| toggler    | `'select'` `'radio'` `'card'` `'checkbox'` |          | Switch type                                    |
| booleanMap | `Record<'true' 'false', string>`           |          | Special object for oneof toggler type checkbox |

#### FileInput

| Property     | Type                                                                          | Required | Description                                                                            |
| :----------- | :---------------------------------------------------------------------------- | :------: | :------------------------------------------------------------------------------------- |
| accept       | `string`                                                                      |          | Acceptable file extensions, for example: `'.png'`, `'audio/\*'`, `'.jpg, .jpeg, .png'` |
| readAsMethod | `'readAsArrayBuffer'` `'readAsBinaryString'` `'readAsDataURL'` `'readAsText'` |          | File reading method                                                                    |
| ignoreText   | `boolean`                                                                     |          | For `true`, will show the `File uploaded` stub instead of the field value              |

#### DateInput

| Property     | Type                                                 | Required | Description                                                                                                          |
| :----------- | :--------------------------------------------------- | :------: | :------------------------------------------------------------------------------------------------------------------- |
| outputFormat | `string` \| string \| date \| timestamp \| date_time |          | Format returning string (for backend and logic). [Available formats](https://day.js.org/docs/en/display/format)      |
| printFormat  | `string`                                             |          | Format print string (for view in read form). [Available formats](https://day.js.org/docs/en/display/format)          |
| timeZone     | `string`                                             |          | Sets the time zone. [Learn more about time zones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List) |

You can provide all props of [original component](https://preview.gravity-ui.com/date-components/?path=/docs/components-datepicker--docs) through [viewSpec.inputProps](./input-props-map.md).

#### TextContentParams

| Property   | Type                                                                                                                                                                                                                                                                                              | Required | Description                                                         |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------: | :------------------------------------------------------------------ |
| themeLabel | `'normal'` `'info'` `'danger'` `'warning'` `'success'` `'unknown'`                                                                                                                                                                                                                                |          | Label color                                                         |
| text       | `string`                                                                                                                                                                                                                                                                                          |   yes    | Text for input                                                      |
| icon       | `string`                                                                                                                                                                                                                                                                                          |          | Icon name from the [library](https://gravity-ui.com/icons)          |
| iconColor  | `'primary'` `'complementary'` `'secondary'` `'hint'` `'info'` `'info-heavy'` `'positive'` `'positive-heavy'` `'warning'` `'warning-heavy'` `'danger'` `'danger-heavy'` `'utility'` `'utility-heavy'` `'misc'` `'misc-heavy'` `'brand'` `'dark-primary'` `'dark-complementary'` `'dark-secondary'` |          | The color of the icon, if it does not have the themeLabel parameter |
| themeIcon  | `'normal'` `'info'` `'success'` `'warning'` `'danger'` `'utility'`                                                                                                                                                                                                                                |          | Alert color                                                         |
| titleAlert | `string`                                                                                                                                                                                                                                                                                          |          | Alert title                                                         |
| viewAlert  | `'filled'` `'outlined'`                                                                                                                                                                                                                                                                           |          | Alert view                                                          |

#### SelectParams

| Property          | Type                     | Required | Description                     |
| :---------------- | :----------------------- | :------: | :------------------------------ |
| filterPlaceholder | `string`                 |          | Placeholder for filter          |
| meta              | `Record<string, string>` |          | Additional text for enum values |

#### CheckboxGroupParams

| Property  | Type                        | Required | Description                                |
| :-------- | :-------------------------- | :------: | :----------------------------------------- |
| placement | `'horizontal'` `'vertical'` |          | Placement checkbox, default `'horizontal'` |
| disabled  | `Record<string, boolean>`   |          | Disabled checkbox for enum values          |

#### RadioGroupParams

| Property  | Type                        | Required | Description                                   |
| :-------- | :-------------------------- | :------: | :-------------------------------------------- |
| direction | `'horizontal'` `'vertical'` |          | Direction radio group, default `'horizontal'` |
| disabled  | `Record<string, boolean>`   |          | Disabled radio group for enum values          |

#### Link

A component that serves as a wrapper for the value, if necessary, rendering the value as a link.

```typescript
type Link = React.ComponentType<{
  value: FormValue;
  link: Spec['viewSpec']['link'];
}>;
```
