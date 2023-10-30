import {DynamicFormConfig, DynamicViewConfig, StringSpec, ValidatorType} from '../../core';
import {
    Accordeon,
    ArrayBase,
    ArrayBaseView,
    BaseView,
    CardAccordeon,
    CardOneOf,
    CardOneOfView,
    CardSection,
    Checkbox,
    FileInput,
    FileInputView,
    Group,
    Group2,
    MonacoInput,
    MonacoView,
    MultiOneOf,
    MultiOneOfFlat,
    MultiOneOfFlatView,
    MultiOneOfView,
    MultiSelect,
    MultiSelectView,
    NumberWithScale,
    NumberWithScaleView,
    ObjectBase,
    ObjectBaseView,
    ObjectInline,
    ObjectInlineView,
    ObjectValueInput,
    ObjectValueInputView,
    OneOf,
    OneOfFlat,
    OneOfFlatView,
    OneOfView,
    Row,
    RowVerbose,
    Secret,
    Section,
    Section2,
    Select,
    Switch,
    TableArrayInput,
    TableArrayView,
    TableCell,
    Text,
    TextArea,
    TextAreaView,
    TextContent,
    TextLink,
    TextLinkView,
    Transparent,
    ViewAccordeon,
    ViewCardAccordeon,
    ViewCardSection,
    ViewGroup,
    ViewGroup2,
    ViewRow,
    ViewSection,
    ViewSection2,
    ViewTableCell,
    ViewTransparent,
} from '../components';
import {
    getArrayValidator,
    getBooleanValidator,
    getNumberValidator,
    getObjectValidator,
    getStringValidator,
} from '../validators';

export const dynamicConfig: DynamicFormConfig = {
    array: {
        inputs: {
            select: {Component: MultiSelect},
            table: {Component: TableArrayInput},
            base: {Component: ArrayBase},
        },
        layouts: {
            row: Row,
            row_verbose: RowVerbose,
            accordeon: Accordeon,
            section: Section,
            section2: Section2,
            group: Group,
            group2: Group2,
            table_item: TableCell,
            transparent: Transparent,
            card_accordeon: CardAccordeon,
            card_section: CardSection,
        },
        validators: {
            base: getArrayValidator(),
        },
    },
    boolean: {
        inputs: {
            base: {Component: Checkbox},
            switch: {Component: Switch},
        },
        layouts: {
            row: Row,
            row_verbose: RowVerbose,
            table_item: TableCell,
        },
        validators: {
            base: getBooleanValidator(),
        },
    },
    number: {
        inputs: {
            base: {Component: Text},
        },
        layouts: {
            row: Row,
            row_verbose: RowVerbose,
            table_item: TableCell,
            transparent: Transparent,
        },
        validators: {
            base: getNumberValidator(),
        },
    },
    object: {
        inputs: {
            oneof: {Component: OneOf, independent: true},
            oneof_flat: {Component: OneOfFlat, independent: true},
            card_oneof: {Component: CardOneOf, independent: true},
            secret: {Component: Secret, independent: true},
            base: {Component: ObjectBase, independent: true},
            text_link: {Component: TextLink, independent: true},
            object_value: {Component: ObjectValueInput, independent: true},
            multi_oneof: {Component: MultiOneOf, independent: true},
            multi_oneof_flat: {Component: MultiOneOfFlat, independent: true},
            inline: {Component: ObjectInline, independent: true},
        },
        layouts: {
            row: Row,
            row_verbose: RowVerbose,
            accordeon: Accordeon,
            section: Section,
            section2: Section2,
            group: Group,
            group2: Group2,
            transparent: Transparent,
            card_accordeon: CardAccordeon,
            card_section: CardSection,
        },
        validators: {
            base: getObjectValidator(),
        },
    },
    string: {
        inputs: {
            password: {Component: Text},
            textarea: {Component: TextArea},
            select: {Component: Select},
            base: {Component: Text},
            file_input: {Component: FileInput},
            number_with_scale: {Component: NumberWithScale},
            monaco_input: {Component: MonacoInput},
            text_content: {Component: TextContent, independent: true},
        },
        layouts: {
            row: Row,
            row_verbose: RowVerbose,
            table_item: TableCell,
            transparent: Transparent,
            section: Section,
            section2: Section2,
            group: Group,
            group2: Group2,
            card_section: CardSection,
        },
        validators: {
            base: getStringValidator(),
            number: getNumberValidator() as unknown as ValidatorType<string, StringSpec>,
        },
    },
};

export const dynamicViewConfig: DynamicViewConfig = {
    array: {
        views: {
            select: {Component: MultiSelectView},
            table: {Component: TableArrayView},
            base: {Component: ArrayBaseView},
        },
        layouts: {
            row: ViewRow,
            row_verbose: ViewRow,
            accordeon: ViewAccordeon,
            section: ViewSection,
            section2: ViewSection2,
            group: ViewGroup,
            group2: ViewGroup2,
            table_item: ViewTableCell,
            transparent: ViewTransparent,
            card_accordeon: ViewCardAccordeon,
            card_section: ViewCardSection,
        },
    },
    boolean: {
        views: {
            base: {Component: BaseView},
            switch: {Component: BaseView},
        },
        layouts: {
            row: ViewRow,
            row_verbose: ViewRow,
            table_item: ViewTableCell,
        },
    },
    number: {
        views: {
            base: {Component: BaseView},
        },
        layouts: {
            row: ViewRow,
            row_verbose: ViewRow,
            table_item: ViewTableCell,
            transparent: ViewTransparent,
        },
    },
    object: {
        views: {
            oneof: {Component: OneOfView, independent: true},
            oneof_flat: {Component: OneOfFlatView, independent: true},
            card_oneof: {Component: CardOneOfView, independent: true},
            secret: undefined,
            base: {Component: ObjectBaseView, independent: true},
            text_link: {Component: TextLinkView, independent: true},
            object_value: {Component: ObjectValueInputView, independent: true},
            multi_oneof: {Component: MultiOneOfView, independent: true},
            multi_oneof_flat: {Component: MultiOneOfFlatView, independent: true},
            inline: {Component: ObjectInlineView, independent: true},
        },
        layouts: {
            row: ViewRow,
            row_verbose: ViewRow,
            accordeon: ViewAccordeon,
            section: ViewSection,
            section2: ViewSection2,
            group: ViewGroup,
            group2: ViewGroup2,
            transparent: ViewTransparent,
            card_accordeon: ViewCardAccordeon,
            card_section: ViewCardSection,
        },
    },
    string: {
        views: {
            password: undefined,
            textarea: {Component: TextAreaView},
            select: {Component: BaseView},
            base: {Component: BaseView},
            file_input: {Component: FileInputView},
            number_with_scale: {Component: NumberWithScaleView},
            monaco_input: {Component: MonacoView},
            text_content: undefined,
        },
        layouts: {
            row: ViewRow,
            row_verbose: ViewRow,
            table_item: ViewTableCell,
            transparent: ViewTransparent,
            section: ViewSection,
            section2: ViewSection2,
            group: ViewGroup,
            group2: ViewGroup2,
            card_section: ViewCardSection,
        },
    },
};
