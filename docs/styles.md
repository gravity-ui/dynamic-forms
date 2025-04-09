# How to Use the CSS API

## How to Adjust Spacing

We base our spacing on the [modular grid system](https://gravity-ui.com/design/branding/module) with a base unit of `4px`.

We take the `--g-spacing` variables from the `@gravity-ui/uikit` package as our foundation.

Here is an example of SCSS variables:

```scss
@mixin variables {
  --g-spacing-base: 4px;

  --g-spacing-0: calc(var(--g-spacing-base) * 0); // 0px
  --g-spacing-half: calc(var(--g-spacing-base) * 0.5); // 2px
  --g-spacing-1: var(--g-spacing-base); // 4px
  --g-spacing-2: calc(var(--g-spacing-base) * 2); // 8px
  --g-spacing-3: calc(var(--g-spacing-base) * 3); // 12px
  --g-spacing-4: calc(var(--g-spacing-base) * 4); // 16px
  --g-spacing-5: calc(var(--g-spacing-base) * 5); // 20px
  --g-spacing-6: calc(var(--g-spacing-base) * 6); // 24px
  --g-spacing-7: calc(var(--g-spacing-base) * 7); // 28px
  --g-spacing-8: calc(var(--g-spacing-base) * 8); // 32px
  --g-spacing-9: calc(var(--g-spacing-base) * 9); // 36px
  --g-spacing-10: calc(var(--g-spacing-base) * 10); // 40px
}
```

## Examples of Overriding SCSS Variables

The CSS API is convenient for fine-tuning styles in components that use `DynamicField` or `DynamicView`.

### 1. Using DynamicField or DynamicView

In your component file:

```tsx
<div className="my-component">
  <DynamicField name="dynamicfield" spec={spec} config={DynamicFormConfig} />
</div>
```

### 2. In a Related SCSS File or Global Stylesheet

```scss
.my-component {
  --df-row-width: 800px;
  --df-row-max-width: 800px;
}
```

This will adjust the `--df-row-width` and `--df-row-max-width` variables for the `DynamicField` component within MyComponent, changing the width to `800px`.

---

## Common variables

Below is a list of common CSS variables that you can use to adjust various aspects of the components:

| Variable                          | Default Value | Description                           |
| :-------------------------------- | :------------ | :------------------------------------ |
| `--df-spacing-inputs`             | `16px`        | Spacing between inputs                |
| `--df-spacing-last-child`         | `0px`         | Spacing for the last values in inputs |
| `--df-spacing-inputs-section`     | `20px`        | Spacing between sections and inputs   |
| `--df-popover-item-max-width`     | `100%`        | Maximum width of the popover item     |
| `--df-popover-item-margin-bottom` | `6px`         | Bottom margin of the popover item     |
| `--df-remove-button-margin-left`  | `4px`         | Left margin for the remove button     |
| `--df-spacing-view`               | `20px`        | Spacing in the view component         |
| `--df-checkbox-height`            | `28px`        | Height of the checkbox                |

---

## Components

### CopyButton

| Variable                  | Default Value      | Description        |
| :------------------------ | :----------------- | :----------------- |
| `--df-copy-button-margin` | `0px 0px 0px 4px ` | Margin copy button |

### Accordeon card

The following CSS variables are specific to the Accordion Card component:

| Variable                                             | Default Value | Description                                         |
| :--------------------------------------------------- | :-----------: | :-------------------------------------------------- |
| `--df-accordeon-card-row-width`                      |    `100%`     | Width of the accordion card row                     |
| `--df-accordeon-card-monaco-input-width`             |    `100%`     | Width of the Monaco input within the accordion card |
| `--df-accordeon-card-header-width`                   |    `100%`     | Width of the accordion card header                  |
| `--df-accordeon-card-header-padding`                 |    `16px`     | Padding of the accordion card header                |
| `--df-accordeon-card-content-description-margin-top` |    `12px`     | Top margin of the content description               |
| `--df-accordeon-card-interal-actions-margin-right`   |     `4px`     | Right margin for internal actions                   |
| `--df-accordeon-card-body-padding`                   |    `20px`     | Padding of the accordion card body                  |

---

### Card

The following CSS variables are specific to the Card component:

| Variable                                   |  Default Value  | Description                                          |
| :----------------------------------------- | :-------------: | :--------------------------------------------------- |
| `--df-card-row-width`                      |     `100%`      | Width of the card row                                |
| `--df-card-monaco-input-width`             |     `100%`      | Width of the Monaco input within the card            |
| `--df-card-header-padding`                 |     `20px`      | Padding of the card header                           |
| `--df-card-title-max-width`                |     `533px`     | Maximum width of the card title                      |
| `--df-card-header-right-child-margin-left` |      `8px`      | Left margin of the header's right child              |
| `--df-card-title-height`                   |     `20px`      | Height of the card title                             |
| `--df-card-title-popover-height`           |     `20px`      | Height of the card title popover                     |
| `--df-card-note-margin-left`               |      `4px`      | Left margin of the card note                         |
| `--df-card-body-padding`                   | `0px 20px 20px` | Padding of the card body (top, right & left, bottom) |

---

### Group indent

The Group Indent variables adjust the indentation and spacing of grouped elements:

| Variable                                                      |    Default Value    | Description                                                           |
| :------------------------------------------------------------ | :-----------------: | :-------------------------------------------------------------------- |
| `--df-group-indent-padding`                                   | `12px 0px 0px 20px` | Padding for the group indent (top, right, bottom, left)               |
| `--df-group-indent-margin`                                    | `-12px 0px 0px 4px` | Margin for the group indent (top, right, bottom, left)                |
| `--df-group-indent-simple-vertical-accordeon-view-margin-top` |       `-12px`       | Top margin for the simple vertical accordion view within group indent |

---

### Error wrapper

Variables for customizing the Error Wrapper component:

| Variable                                   | Default Value | Description                                     |
| :----------------------------------------- | :-----------: | :---------------------------------------------- |
| `--df-error-wrapper-width`                 |    `100%`     | Width of the error wrapper                      |
| `--df-error-wrapper-error-text-margin-top` |     `2px`     | Top margin of the error text within the wrapper |

---

### Generate random value button

Variable for the Generate Random Value button:

| Variable                                        | Default Value | Description                         |
| :---------------------------------------------- | :-----------: | :---------------------------------- |
| `--df-generate-random-value-button-margin-left` |     `8px`     | Left margin for the generate button |

---

### Long value

Variable for the Long Value component:

| Variable                    | Default Value | Description                |
| :-------------------------- | :-----------: | :------------------------- |
| `--df-long-value-max-width` |    `100%`     | Maximum width of the value |

---

### Simple vertical accordeon

Variables for customizing the Simple Vertical Accordion component:

| Variable                                                  | Default Value | Description                                 |
| :-------------------------------------------------------- | :-----------: | :------------------------------------------ |
| `--df-simple-vertical-accordeon-body-padding-left`        |    `20px`     | Left padding of the accordion body          |
| `--df-simple-vertical-accordeon-body-margin-left`         |     `4px`     | Left margin of the accordion body           |
| `--df-simple-vertical-accordeon-header-inner-margin-left` |    `-12px`    | Left margin of the header inner element     |
| `--df-simple-vertical-accordeon-header-inner-max-width`   |    `533px`    | Maximum width of the header inner element   |
| `--df-simple-vertical-accordeon-tooltip-margin`           |   `0px 4px`   | Margin for the tooltip within the accordion |
| `--df-simple-vertical-accordeon-body-margin-top`          |     `4px`     | Top margin of the accordion body            |
| `--df-simple-vertical-accordeon-body-padding-top`         |     `4px`     | Top padding of the accordion body           |

---

### Toggler card

Variables for customizing the Toggler Card component:

| Variable                        |    Default Value    | Description                                                        |
| :------------------------------ | :-----------------: | :----------------------------------------------------------------- |
| `--df-toggler-card-width`       |       `254px`       | Width of the toggler card                                          |
| `--df-toggler-card-padding`     |        `8px`        | Padding inside the toggler card                                    |
| `--df-toggler-card-height`      |       `88px`        | Height of the toggler card                                         |
| `--df-toggler-card-text-margin` | `12px 16px 0px 0px` | Margin for the text in the toggler card (top, right, bottom, left) |
| `--df-toggler-card-text-height` |       `36px`        | Height of the text field within the toggler card                   |

---

## Inputs

### Array base

Variables for the Array Base input component:

| Variable                                       | Default Value  | Description                                     |
| :--------------------------------------------- | :------------: | :---------------------------------------------- |
| `--df-array-base-items-primitive-min-width`    |     `100%`     | Minimum width for primitive array items         |
| `--df-array-base-item-prefix-margin`           | `-8px 0px 8px` | Margin for the item prefix (top, right, bottom) |
| `--df-array-base-add-button-right-margin-left` |     `4px`      | Left margin for the "Add" button on the right   |

---

### Checkbox group

Variables for the Checkbox Group component:

| Variable                                    | Default Value | Description                                                           |
| :------------------------------------------ | :-----------: | :-------------------------------------------------------------------- |
| `--df-checkbox-group-child-margin-right`    |    `12px`     | Right margin for child checkbox elements                              |
| `--df-checkbox-group-vertical-margin-top`   |     `8px`     | Top margin in vertical layout                                         |
| `--df-checkbox-group-vertical-child-margin` | `0px 0px 8px` | Margin for child elements in vertical view (top, right, bottom, left) |
| `--df-checkbox-margint-start`               |     `4px`     | Indent from text to checkbox                                          |

---

### Date input

Variables for the Date Input component:

| Variable                | Default Value | Description                   |
| :---------------------- | :-----------: | :---------------------------- |
| `--df-date-input-width` |    `100%`     | Width of the date input field |

---

### File input

Variables for the File Input component:

| Variable                              | Default Value | Description                                       |
| :------------------------------------ | :-----------: | :------------------------------------------------ |
| `--df-file-input-file-name-margin`    |  `auto 8px`   | Margin for the file name (top/bottom, left/right) |
| `--df-file-input-file-name-max-width` |    `160px`    | Maximum width for the displayed file name         |

---

### Monaco input

Variables for the Monaco Input component:

| Variable                                         |  Default Value  | Description                                               |
| :----------------------------------------------- | :-------------: | :-------------------------------------------------------- |
| `--df-monaco-input-width`                        |     `550px`     | Width of the Monaco editor input                          |
| `--df-monaco-header-height`                      |     `52px`      | Height of the Monaco editor header                        |
| `--df-monaco-header-padding`                     |     `16px`      | Padding inside the Monaco editor header                   |
| `--df-monaco-input-dialog-dialog-footer-padding` | `8px 32px 32px` | Padding for the Monaco dialog footer (top, sides, bottom) |
| `--df-monaco-dialog-header-caption-min-height`   |     `24px`      | Minimum height for the Monaco dialog header caption       |

---

### Multi OneOf

Variables for the Multi OneOf input component:

| Variable                                | Default Value | Description                       |
| :-------------------------------------- | :-----------: | :-------------------------------- |
| `--df-multi-oneof-select-max-width`     |    `305px`    | Maximum width of the select input |
| `--df-multi-oneof-content-flat-margin`  |     `0px`     | Margin for flat content           |
| `--df-multi-oneof-content-flat-padding` |     `0px`     | Padding for flat content          |

---

### Multi Select

Variables for the Multi Select component:

| Variable                      | Default Value | Description                             |
| :---------------------------- | :-----------: | :-------------------------------------- |
| `--df-multi-select-max-width` |    `305px`    | Maximum width of the multi select input |

---

### Number with Scale

Variables for the Number with Scale input component:

| Variable                                    | Default Value | Description                       |
| :------------------------------------------ | :-----------: | :-------------------------------- |
| `--df-number-with-scale-select-max-width`   |    `102px`    | Maximum width of the select input |
| `--df-number-with-scale-select-margin-left` |     `4px`     | Left margin of the select input   |

---

### Object Base

Variables for the Object Base component:

| Variable                                  |   Default Value    | Description                                           |
| :---------------------------------------- | :----------------: | :---------------------------------------------------- |
| `--df-object-base-inline-width`           |      `150px`       | Width of inline input fields                          |
| `--df-object-base-inline-margin`          | `0px 8px 0px 0px ` | Margin for inline elements (top, right, bottom, left) |
| `--df-object-base-delimiter-height`       |       `28px`       | Height of the delimiter (e.g., colon or separator)    |
| `--df-object-base-delimiter-margin-right` |       `8px`        | Right margin of the delimiter                         |

---

### OneOf

Variables for the OneOf component:

| Variable                                               |    Default Value    | Description                              |
| :----------------------------------------------------- | :-----------------: | :--------------------------------------- |
| `--df-oneof-base-padding`                              | `12px 0px 0px 20px` | Base padding (top, right, bottom, left)  |
| `--df-oneof-base-margin`                               | `4px 0px 20px 4px`  | Base margin (top, right, bottom, left)   |
| `--df-oneof-base-simple-vertical-accordeon-margin-top` |       `-12px`       | Top margin for simple vertical accordion |
| `--df-oneof-flat-margin`                               |        `0px`        | Margin for flat layout                   |
| `--df-oneof-flat-padding`                              |        `0px`        | Padding for flat layout                  |

---

### Select

Variables for the Select component:

| Variable                | Default Value | Description                       |
| :---------------------- | :-----------: | :-------------------------------- |
| `--df-select-max-width` |    `305px`    | Maximum width of the select input |

---

### Switch

Variables for the Switch component:

| Variable             | Default Value | Description                    |
| :------------------- | :-----------: | :----------------------------- |
| `--df-switch-height` |    `28px`     | Height of the switch component |

---

### Table Array

Variables for the Table Array component:

| Variable                                                            | Default Value | Description                                                  |
| :------------------------------------------------------------------ | :-----------: | :----------------------------------------------------------- |
| `--df-table-array-table-margin-bottom`                              |     `8px`     | Bottom margin of the table                                   |
| `--df-table-array-cell-max-width`                                   |    `150px`    | Maximum width of a table cell                                |
| `--df-table-array-cell-min-width`                                   |    `150px`    | Minimum width of a table cell                                |
| `--df-table-array-cell-obj-padding-left`                            |     `2px`     | Left padding within a cell containing an object              |
| `--df-table-array-idx-padding-top`                                  |     `6px`     | Top padding for the index column in the table                |
| `--df-table-array-cell-obj-simple-vertical-accordeon-margin-bottom` |     `0px`     | ottom margin for cell objects with simple vertical accordion |

---

### Text Content

Variables for the Text Content component:

| Variable                              | Default Value | Description                                        |
| :------------------------------------ | :-----------: | :------------------------------------------------- |
| `--df-text-content-icon-margin-right` |     `4px`     | Right margin of the icon                           |
| `--df-text-content-separator-margin`  |   `0px 4px`   | Margin of the separator (top, right, bottom, left) |

### Radio Group

Variables for the Text Content component:

| Variable                               | Default Value | Description                      |
| :------------------------------------- | :-----------: | :------------------------------- |
| `--df-radio-group-height`              |    `28px`     | Height of the radio group        |
| `--df-radio-group-vertical-margin-top` |     `8px`     | Top margin in vertical direction |

---

## Views

### Array Base View

Variables for the Array Base View component:

| Variable                                         | Default Value | Description                      |
| :----------------------------------------------- | :-----------: | :------------------------------- |
| `--df-array-base-view-item-prefix-margin-bottom` |     `6px`     | Bottom margin of the item prefix |

---

### Checkbox Group View

Variables for the Checkbox Group View component:

| Variable                                         | Default Value | Description                                                |
| :----------------------------------------------- | :-----------: | :--------------------------------------------------------- |
| `--df-checkbox-group-view-child-margin-right`    |    `12px`     | Right margin of child items                                |
| `--df-checkbox-group-view-vertical-child-margin` | `0px 0px 8px` | Margin for vertical child items (top, right, bottom, left) |

---

### Monaco Input View

Variables for the Monaco Input View component:

| Variable                                 | Default Value | Description                    |
| :--------------------------------------- | :-----------: | :----------------------------- |
| `--df-monaco-base-view-width`            |    `550px`    | Width of the Monaco input view |
| `--df-monaco-view-dialog-footer-padding` |    `16px`     | Padding of the dialog footer   |
| `--df-monaco-view-dialog-header-height`  |    `48px`     | Height of the dialog header    |

---

### Multi OneOf View

Variables for the Multi OneOf View component:

| Variable                                                          | Default Value  | Description                                             |
| :---------------------------------------------------------------- | :------------: | :------------------------------------------------------ |
| `--df-multi-oneof-view-content-multiple-values-child-padding-top` |     `0px`      | Top padding of the multiple values child                |
| `--df-multi-oneof-view-content-flat-child-margin`                 | `0px 0px 20px` | Margin of flat content child (top, right, bottom, left) |
| `--df-multi-oneof-view-content-flat-child-padding`                |     `0px`      | Padding of flat content child                           |

---

### Number with Scale View

Variables for the Number with Scale View component:

| Variable                                       | Default Value | Description             |
| :--------------------------------------------- | :-----------: | :---------------------- |
| `--df-number-with-scale-view-size-margin-left` |     `6px`     | Left margin of the size |

---

### Object Base View

Variables for the Object Base View component:

| Variable                                      |   Default Value   | Description                                          |
| :-------------------------------------------- | :---------------: | :--------------------------------------------------- |
| `--df-object-base-view-content-inline-margin` | `0px 2px 0px 0px` | Margin for inline content (top, right, bottom, left) |
| `--df-object-base-view-delimiter-right`       |       `8px`       | Right position of the delimiter                      |

---

### OneOf View

Variables for the OneOf View component:

| Variable                             | Default Value  | Description                                     |
| :----------------------------------- | :------------: | :---------------------------------------------- |
| `--df-oneof-view-flat-child-margin`  | `0px 0px 20px` | Margin of flat child (top, right, bottom, left) |
| `--df-oneof-view-flat-child-padding` |     `0px`      | Padding of flat child                           |

---

### Table Array View

Variables for the Table Array View component:

| Variable                                    | Default Value | Description                |
| :------------------------------------------ | :-----------: | :------------------------- |
| `--df-table-array-view-cell-min-width`      |    `150px`    | Minimum width of cell      |
| `--df-table-array-view-cell-max-width`      |    `150px`    | Maximum width of cell      |
| `--df-table-array-view-table-margin-bottom` |    `12px`     | Bottom margin of the table |

---

### Text Area View

Variables for the Text Area View component:

| Variable                             | Default Value | Description                 |
| :----------------------------------- | :-----------: | :-------------------------- |
| `--df-text-area-view-chevron-margin` |     `2px`     | Margin for the chevron icon |

---

## Layouts

### Accordion Card Form

Variables for the Accordion Card Form layout:

| Variable                                      | Default Value | Description               |
| :-------------------------------------------- | :-----------: | :------------------------ |
| `--df-accordeon-card-form-body-padding-right` |    `32px`     | Right padding of the body |

---

### Column

Variables for the Column layout:

| Variable                            | Default Value | Description                     |
| :---------------------------------- | :-----------: | :------------------------------ |
| `--df-column-first-row-min-height`  |    `28px`     | Minimum height of the first row |
| `--df-column-title-margin-right`    |     `2px`     | Right margin of the title       |
| `--df-column-note-inner-margin-top` |     `0px`     | Top margin inside the note      |

---

### Row

Variables for the Row layout:

| Variable                          | Default Value | Description                        |
| :-------------------------------- | :-----------: | :--------------------------------- |
| `--df-row-width`                  |    `500px`    | Width of the row                   |
| `--df-row-max-width`              |    `500px`    | Maximum width of the row           |
| `--df-row-left-width`             |    `180px`    | Width of the left section          |
| `--df-row-left-min-height`        |    `28px`     | Minimum height of the left section |
| `--df-row-title-margin-right`     |     `2px`     | Right margin of the title          |
| `--df-row-note-padding-right`     |    `16px`     | Right padding of the note          |
| `--df-row-note-inner-margin-top`  |     `0px`     | Top margin inside the note         |
| `--df-row-right-margin-left`      |    `16px`     | Left margin of the right section   |
| `--df-row-description-margin-top` |     `8px`     | Top margin of the description      |

---

### Section

Variables for the Section layout:

| Variable                              | Default Value | Description                        |
| :------------------------------------ | :-----------: | :--------------------------------- |
| `--df-section-header-margin-bottom`   |    `20px`     | Bottom margin of the header        |
| `--df-section-header-size-s`          |    `18px`     | Headers size for small headers     |
| `--df-section-header-size-m`          |    `20px`     | Headers size for medium headers    |
| `--df-section-title-max-width`        |    `533px`    | Maximum width of the section title |
| `--df-section-note-margin-left`       |     `4px`     | Left margin of the note            |
| `--df-section-description-margin-top` |     `4px`     | Top margin of the description      |

---

### Transparent

Variables for the Transparent layout:

| Variable                                | Default Value | Description                  |
| :-------------------------------------- | :-----------: | :--------------------------- |
| `--df-transparent-array-item-max-width` |    `338px`    | Maximum width of array items |

---

## View Layouts

### View Column

Variables for the View Column layout:

| Variable                                                           | Default Value | Description                                                 |
| :----------------------------------------------------------------- | :-----------: | :---------------------------------------------------------- |
| `--df-view-column-note-margin-inline-start`                        |     `2px`     | Inline start margin for notes                               |
| `--df-view-column-second-row-child-view-transperant-margin-bottom` |     `6px`     | Bottom margin for transparent child views in the second row |

---

### View Row

Variables for the View Row layout:

| Variable                                                   | Default Value | Description                                                          |
| :--------------------------------------------------------- | :-----------: | :------------------------------------------------------------------- |
| `--df-view-row-width`                                      |    `100%`     | Width of the view row                                                |
| `--df-view-row-left-width`                                 |    `300px`    | Width of the left section                                            |
| `--df-view-row-left-max-width`                             |    `300px`    | Maximum width of the left section                                    |
| `--df-view-row-left-min-width`                             |    `300px`    | Minimum width of the left section                                    |
| `--df-view-row-note-margin-inline-start`                   |     `2px`     | Start margin inline for the note                                     |
| `--df-view-row-dots-min-width`                             |    `40px`     | Minimum width for spacer dots (used between left and right sections) |
| `--df-view-row-dots-margin`                                |   `0px 2px`   | Margin around the dots (vertical, horizontal)                        |
| `--df-view-row-right-width`                                |    `480px`    | Width of the right section                                           |
| `--df-view-row-right-child-view-transparent-margin-bottom` |     `6px`     | Bottom margin for transparent child views in the right section       |

---

### View Table Cell

Variables for the ViewTableCell component:

| Variable                                                          | Default Value | Description                                                     |
| :---------------------------------------------------------------- | :-----------: | :-------------------------------------------------------------- |
| `--df-view-table-cell-inner-max-width`                            |    `100%`     | Maximum width of the inner content within the table cell        |
| `--df-view-table-cell-inner-child-view-transparent-margin-bottom` |     `6px`     | Bottom margin for transparent child views within the table cell |

---

### View Transparent

Variables for the ViewTransparent component:

| Variable                                | Default Value | Description                        |
| :-------------------------------------- | :-----------: | :--------------------------------- |
| `--df-view-transparent-inner-max-width` |    `100%`     | Maximum width of the inner content |
| `--df-view-transparent-inner-width`     |    `100%`     | Width of the inner content         |

---

## Hooks

### Use OneOf

Variables for customizing the UseOneOf hook/component:

| Variable                            | Default Value | Description                                |
| :---------------------------------- | :-----------: | :----------------------------------------- |
| `--df-use-oneof-card-child-padding` |     `0px`     | Padding for child elements within the card |
| `--df-use-oneof-card-margin-right`  |     `8px`     | Right margin of the card                   |
