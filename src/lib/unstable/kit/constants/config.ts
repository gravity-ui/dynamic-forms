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
    FewOfNested,
    FileInput,
    Label,
    MultiSelect,
    NumberBase,
    ObjectBase,
    ObjectInline,
    OneOfNested,
    Password,
    RadioGroup,
    RangeSlider,
    SegmentedRadioGroup,
    Select,
    Slider,
    StringBase,
    Switch,
    TextArea,
    TextContent,
} from '../controls';
import {Accordeon, Row, Section, Transparent} from '../wrappers';

export const untypedConfig = {
    [EntityType.Any]: {
        controls: {date_input: {Component: DateInput}},
        views: {},
        wrappers: {
            row: Row,
            section: Section,
            transparent: Transparent,
            accordeon: Accordeon,
        },
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
        wrappers: {
            row: Row,
            section: Section,
            transparent: Transparent,
            accordeon: Accordeon,
        },
        validators: {},
    },
    [EntityType.Boolean]: {
        controls: {base: {Component: Checkbox}, switch: {Component: Switch}},
        views: {},
        wrappers: {
            row: Row,
            section: Section,
            transparent: Transparent,
        },
        validators: {},
    },
    [EntityType.Number]: {
        controls: {
            base: {Component: NumberBase},
            slider: {Component: Slider},
        },
        views: {},
        wrappers: {
            row: Row,
            section: Section,
            transparent: Transparent,
            accordeon: Accordeon,
        },
        validators: {},
    },
    [EntityType.Object]: {
        controls: {
            base: {Component: ObjectBase},
            inline: {Component: ObjectInline},
            dot_value: {Component: DotValue},
            range_slider: {Component: RangeSlider},
            one_of_nested: {Component: OneOfNested, independent: true},
            few_of_nested: {Component: FewOfNested, independent: true},
        },
        views: {},
        wrappers: {
            row: Row,
            section: Section,
            transparent: Transparent,
            accordeon: Accordeon,
        },
        validators: {},
    },
    [EntityType.String]: {
        controls: {
            base: {Component: StringBase},
            color_picker: {Component: ColorPicker},
            file: {Component: FileInput},
            password: {Component: Password},
            radio_group: {Component: RadioGroup},
            segmented_radio_group: {Component: SegmentedRadioGroup},
            select: {Component: Select},
            textarea: {Component: TextArea},
            text_content: {Component: TextContent},
            label: {Component: Label},
            alert: {Component: Alert},
        },
        views: {},
        wrappers: {
            row: Row,
            section: Section,
            transparent: Transparent,
            accordeon: Accordeon,
        },
        validators: {},
    },
} as const;

export const config: SchemaRendererConfig = untypedConfig;
