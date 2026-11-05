[← Back to contents](./README.md)

# Kit

A ready registry on `@gravity-ui/uikit`: layouts, 30 entity keys across 6 node types, service components. Exported as `config`, with `untypedConfig` alongside for `createNodeParametersDefiner`.

## Layouts

Keys are the same for every node type. In the form, row and column are `FormRow` and `FormColumn`, in the overview — `OverviewRow` and `OverviewColumn`; the rest are shared. Control size comes from `settings.size`.

| Key           | Form                                    | Overview                        | Props                                                            |
| :------------ | :-------------------------------------- | :------------------------------ | :--------------------------------------------------------------- |
| `row`         | Label on the left, control on the right | Label, dots, value              | `descriptionType`: tooltip or bottom                             |
| `column`      | Label on top                            | Label on top, value below       | Same `descriptionType`                                           |
| `section`     | Section heading                         | Same, empty is hidden           | `withIndent`, Text props                                         |
| `card`        | A card, expanded by default             | Same                            | `likeAccordeon`, `descriptionType`, Card props                   |
| `accordeon`   | Disclosure                              | Same                            | `withIndent`, `titleProps`, `togglerProps`, `withDefaultSummary` |
| `transparent` | Control and error                       | Control, empty is hidden        | `hideEmpty`                                                      |
| `cell`        | Same Transparent                        | Transparent, `hideEmpty: false` | For a table cell                                                 |

## Entity catalog

The key is written in `nodeParameters.entity`. The node type must match the config branch.

### string

| Key                        | Form                              | Overview                                  | Entity props                                                                 |
| :------------------------- | :-------------------------------- | :---------------------------------------- | :--------------------------------------------------------------------------- |
| `base`                     | TextInput                         | Text                                      | TextInput props, except value and onUpdate                                   |
| `textarea`                 | Multiline input                   | Text                                      | TextArea props                                                               |
| `password`                 | Password                          | Text (open in overview — set `writeOnly`) | PasswordInput props                                                          |
| `select`                   | One option from enum              | Raw value                                 | `enumDescriptions`, `optionsMeta`, `filterPlaceholder`                       |
| `radio_group`              | Radio from enum                   | Raw value                                 | `enumDescriptions`, `optionsDisabled`                                        |
| `segmented_radio_group`    | Segments from enum, else select   | Raw value                                 | `enumDescriptions`, `optionsDisabled`                                        |
| `color_picker`             | Color picker                      | Color swatch                              | ColorPicker props                                                            |
| `file_input`               | File, drag-and-drop               | Text                                      | `readAsMethod`: readAsText, readAsDataURL, readAsBinaryString                |
| `monaco_input`             | Code editor                       | Read-only                                 | `language`, `withDialog`. Component from `userContext.MonacoEditor`          |
| `string_number_with_scale` | Number as string + units          | Value in the `viewType` unit              | `scale {title, factor}`, `defaultType`, `viewType`. Bounds in `stringNumber` |
| `alert`                    | Alert, collapses via `flags.open` | Same alert                                | Alert props, `iconName`, `iconProps`                                         |
| `label`                    | Label                             | Label                                     | Label props, `iconName`                                                      |
| `text_content`             | Text with the clear theme         | Same                                      | `title`, `iconName`                                                          |

### any

| Key    | Form       | Overview | Entity props                                                               |
| :----- | :--------- | :------- | :------------------------------------------------------------------------- |
| `date` | DatePicker | Date     | `format`, `outputFormat`, `timeZone`. Node type any, `schema.type` not set |

### number

| Key                 | Form                    | Overview          | Entity props                                                      |
| :------------------ | :---------------------- | :---------------- | :---------------------------------------------------------------- |
| `base`              | Number input            | Text              | NumberInput props. Bounds from `minimum`, `maximum`, `multipleOf` |
| `slider`            | Slider, step 1          | Text              | Slider props                                                      |
| `number_with_scale` | Number × factor + units | Value in the unit | `scale` with a numeric factor, `defaultType`, `viewType`          |

### boolean

| Key      | Form     | Overview | Entity props                                                           |
| :------- | :------- | :------- | :--------------------------------------------------------------------- |
| `base`   | Checkbox | Text     | In the overview `valueDescriptions` and `viewColor` for true and false |
| `switch` | Switch   | Text     | Switch props                                                           |

### array

| Key              | Form                          | Overview       | Entity props                                                     |
| :--------------- | :---------------------------- | :------------- | :--------------------------------------------------------------- |
| `base`           | List + add button             | List or dash   | `addButtonText`. A tuple `items[]` is fixed, no buttons          |
| `table`          | Table of objects              | Table          | `order`, `addButtonText`. Columns from `items.properties`        |
| `select`         | Multiselect from `items.enum` | List of values | `enumDescriptions`, `optionsMeta`                                |
| `checkbox_group` | Checkbox group                | List of values | `enumDescriptions`, `optionsDisabled`, `direction` row or column |

### object

| Key             | Form                     | Overview              | Entity props                                                      |
| :-------------- | :----------------------- | :-------------------- | :---------------------------------------------------------------- |
| `base`          | Children by `properties` | Same children         | `order`, `groups`. independent: the entity sets the layout itself |
| `inline`        | Children in one row      | Same row              | `delimiter` as a string or a map, `order`                         |
| `dot_value`     | Only `properties.value`  | Same or dash          | Empty value and `*_UNSPECIFIED` strings reset the object          |
| `one_of_nested` | Exactly one branch       | The selected branch   | `toggler`, `order`, `withIndent`, `booleanToKey`. independent     |
| `few_of_nested` | Several branches         | The selected branches | `toggler`, `order`, `withIndent`. independent                     |
| `range_input`   | Two fields, from ≤ to    | Range                 | `propertyKeys`, `separator`. Patches `minimum` and `maximum`      |
| `range_slider`  | Range slider             | Range                 | `propertyKeys`                                                    |

## Service components

Layouts and entities are built from them; useful in your own components (see [Extension](./extension.md)).

| Component                                         | Role                                                              |
| :------------------------------------------------ | :---------------------------------------------------------------- |
| `LayoutContainer`                                 | The layout wrapper: `flags.hidden`, hideEmpty, room for buttons.  |
| `EntityContainer`                                 | Width, the droppable flag, the filled state.                      |
| `EntityTitle`                                     | The heading from `title`, an asterisk for required. Empty — null. |
| `EntityDescription`                               | The description from `description`, beside or below.              |
| `EntityError`                                     | The error text when the field is touched or submit has failed.    |
| `HTMLContent`                                     | HTML/MD via `RenderHTMLOrMD` or `dangerouslySetInnerHTML`.        |
| `LayoutButtons`                                   | Row buttons: remove an array item, copy, reset.                   |
| `ArrayRemoveButton` / `CopyButton` / `DropButton` | Standalone buttons for custom layouts.                            |
| `EmptyEntityValue`                                | A dash for an empty value in the overview.                        |
| `LongValue`                                       | Long text expandable on click.                                    |
| `MonacoContainer`                                 | An editor frame with a fullscreen dialog.                         |

## Buttons and empty values

- **Remove and reset.** A homogeneous array item in the form gets a remove button; a tuple item does not. An empty array after removal stays `[]`. An optional object field gets a reset menu: it writes `undefined`, and `{}` to the parent for the last key.
- **Empty in the overview.** An empty value is the `DASH` dash via `EmptyEntityValue`. Overview layouts hide themselves when there is no filled value inside (CSS `:has([data-fill='populated'])`); the exception is `cell`.

### oneOf and fewOf

The toggler is described entirely in `entityProps.toggler` and does not get into the form value. The value keeps an object whose keys are the selected branches. `one_of_nested` holds a single key (a boolean toggler is converted via `booleanToKey`), `few_of_nested` holds several.

### Object: order and groups

`order` is property names or `name` + `schemaPath` pairs when a child lies deeper than `properties`. `groups` render a heading with their own layout and list the same fields; a group does not register a value.

The object’s own `order` accepts strings and `{name, schemaPath}` pairs. `groups[].order` accepts only pairs; `schemaPath` is relative to the object’s pointer, for example `properties/login`.

## Styles

Classes are prefixed with `sr-`, theming is via `@gravity-ui/uikit` variables. In `view: 'fit'` mode a container with `width: max` is capped at 450px.
