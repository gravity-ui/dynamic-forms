import {EntityType, type SchemaRendererConfig} from '../../core';
import {
    Alert,
    ArrayBase,
    ArrayTable,
    Checkbox,
    CheckboxGroup,
    ColorPicker,
    DateInput,
    DotValue,
    FileInput,
    Label,
    MultiSelect,
    NumberBase,
    ObjectBase,
    Password,
    RadioGroup,
    RangeSlider,
    Select,
    Slider,
    StringBase,
    Switch,
    TextArea,
    TextContent,
} from '../controls';
import {Row, Transparent} from '../wrappers';

export const untypedConfig = {
    [EntityType.Any]: {
        controls: {date_input: {Component: DateInput}},
        views: {},
        wrappers: {row: Row, transparent: Transparent},
        validators: {},
    },
    [EntityType.Array]: {
        controls: {
            base: {Component: ArrayBase},
            checkbox_group: {Component: CheckboxGroup},
            select: {Component: MultiSelect},
            array_table: {Component: ArrayTable},
        },
        views: {},
        wrappers: {row: Row, transparent: Transparent},
        validators: {},
    },
    [EntityType.Boolean]: {
        controls: {base: {Component: Checkbox}, switch: {Component: Switch}},
        views: {},
        wrappers: {row: Row, transparent: Transparent},
        validators: {},
    },
    [EntityType.Number]: {
        controls: {
            base: {Component: NumberBase},
            slider: {Component: Slider},
        },
        views: {},
        wrappers: {row: Row, transparent: Transparent},
        validators: {},
    },
    [EntityType.Object]: {
        controls: {
            base: {Component: ObjectBase},
            dot_value: {Component: DotValue},
            range_slider: {Component: RangeSlider},
        },
        views: {},
        wrappers: {row: Row, transparent: Transparent},
        validators: {},
    },
    [EntityType.String]: {
        controls: {
            base: {Component: StringBase},
            color_picker: {Component: ColorPicker},
            file: {Component: FileInput},
            password: {Component: Password},
            radio_group: {Component: RadioGroup},
            select: {Component: Select},
            textarea: {Component: TextArea},
            text_content: {Component: TextContent},
            label: {Component: Label},
            alert: {Component: Alert},
        },
        views: {},
        wrappers: {row: Row, transparent: Transparent},
        validators: {},
    },
} as const;

export const config: SchemaRendererConfig = untypedConfig;
