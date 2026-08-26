import {NodeType, type NodesConfig} from '../../core';
import {Alert, ArrayBase, ArrayTable, Monaco, ObjectBase} from '../entities';
import {
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
    NumberWithScale,
    ObjectInline,
    OneOfNested,
    Password,
    RadioGroup,
    RangeInput,
    RangeSlider,
    SegmentedRadioGroup,
    Select,
    Slider,
    StringBase,
    StringNumberWithScale,
    Switch,
    TextArea,
    TextContent,
} from '../form-entities';
import {Accordeon, Card, ColumnRow, Row, Section, Transparent} from '../form-layouts';
import {OverviewBooleanBase, OverviewStringBase} from '../overview-entities';
import {OverviewRow} from '../overview-layouts';

export const untypedConfig = {
    [NodeType.Any]: {
        formEntities: {
            date_input: {Component: DateInput},
        },
        formLayouts: {
            columnRow: {Component: ColumnRow},
            row: {Component: Row},
            section: {Component: Section},
            transparent: {Component: Transparent},
            accordeon: {Component: Accordeon},
            card: {Component: Card},
        },
        overviewEntities: {},
        overviewLayouts: {
            row: {Component: OverviewRow},
        },
        validators: {},
    },
    [NodeType.Array]: {
        formEntities: {
            base: {Component: ArrayBase},
            checkbox_group: {Component: CheckboxGroup},
            select: {Component: MultiSelect},
            array_table: {Component: ArrayTable},
        },
        formLayouts: {
            columnRow: {Component: ColumnRow},
            row: {Component: Row},
            section: {Component: Section},
            transparent: {Component: Transparent},
            accordeon: {Component: Accordeon},
            card: {Component: Card},
        },
        overviewEntities: {
            base: {Component: ArrayBase},
            table: {Component: ArrayTable},
        },
        overviewLayouts: {
            row: {Component: OverviewRow},
        },
        validators: {},
    },
    [NodeType.Boolean]: {
        formEntities: {base: {Component: Checkbox}, switch: {Component: Switch}},
        formLayouts: {
            columnRow: {Component: ColumnRow},
            row: {Component: Row},
            section: {Component: Section},
            transparent: {Component: Transparent},
            card: {Component: Card},
        },
        overviewEntities: {
            base: {Component: OverviewBooleanBase},
            switch: {Component: OverviewBooleanBase},
        },
        overviewLayouts: {
            row: {Component: OverviewRow},
        },
        validators: {},
    },
    [NodeType.Number]: {
        formEntities: {
            base: {Component: NumberBase},
            slider: {Component: Slider},
            number_with_scale: {Component: NumberWithScale},
        },
        formLayouts: {
            columnRow: {Component: ColumnRow},
            row: {Component: Row},
            section: {Component: Section},
            transparent: {Component: Transparent},
            accordeon: {Component: Accordeon},
            card: {Component: Card},
        },
        overviewEntities: {},
        overviewLayouts: {
            row: {Component: OverviewRow},
        },
        validators: {},
    },
    [NodeType.Object]: {
        formEntities: {
            base: {Component: ObjectBase},
            inline: {Component: ObjectInline},
            dot_value: {Component: DotValue},
            range_input: {Component: RangeInput},
            range_slider: {Component: RangeSlider},
            one_of_nested: {Component: OneOfNested, independent: true},
            few_of_nested: {Component: FewOfNested, independent: true},
        },
        formLayouts: {
            columnRow: {Component: ColumnRow},
            row: {Component: Row},
            section: {Component: Section},
            transparent: {Component: Transparent},
            accordeon: {Component: Accordeon},
            card: {Component: Card},
        },
        overviewEntities: {
            base: {Component: ObjectBase},
        },
        overviewLayouts: {
            row: {Component: OverviewRow},
        },
        validators: {},
    },
    [NodeType.String]: {
        formEntities: {
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
            string_number_with_scale: {Component: StringNumberWithScale},
            monaco: {Component: Monaco},
        },
        formLayouts: {
            columnRow: {Component: ColumnRow},
            row: {Component: Row},
            section: {Component: Section},
            transparent: {Component: Transparent},
            accordeon: {Component: Accordeon},
            card: {Component: Card},
        },
        overviewEntities: {
            base: {Component: OverviewStringBase},
            color_picker: {Component: OverviewStringBase},
            // file: {Component: OverviewStringBase},
            password: {Component: OverviewStringBase},
            radio_group: {Component: OverviewStringBase},
            segmented_radio_group: {Component: OverviewStringBase},
            select: {Component: OverviewStringBase},
            textarea: {Component: OverviewStringBase},
            // text_content: {Component: OverviewStringBase},
            // label: {Component: OverviewStringBase},
            alert: {Component: Alert},
            // string_number_with_scale: {Component: OverviewStringBase},
            monaco: {Component: Monaco},
        },
        overviewLayouts: {
            row: {Component: OverviewRow},
        },
        validators: {},
    },
} as const;

export const config: NodesConfig = untypedConfig;
