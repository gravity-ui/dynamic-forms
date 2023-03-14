import {DynamicFormConfig, DynamicViewConfig, StringSpec, ValidatorType} from '../../core';
import {
    Accordeon,
    AccordeonCardLayout,
    ArrayBase,
    ArrayBaseView,
    BaseView,
    CardAccordeon,
    CardOneOf,
    CardOneOfView,
    CardSection,
    Checkbox,
    Group,
    Group2,
    MonacoInput,
    MonacoInputCard,
    MonacoView,
    MonacoViewCard,
    MultiSelect,
    MultiSelectView,
    NumberWithScale,
    NumberWithScaleView,
    ObjectBase,
    ObjectBaseView,
    OneOf,
    OneOfCard,
    OneOfCardView,
    OneOfView,
    Row,
    Row2,
    Secret,
    Section,
    Section2,
    SectionCard,
    SectionCard2,
    SectionWithSubtitle,
    SectionWithSubtitle2,
    Select,
    TableArrayInput,
    TableArrayView,
    TableCell,
    Text,
    TextArea,
    TextAreaView,
    TextContent,
    Transparent,
    ViewAccordeon,
    ViewAccordeonCard,
    ViewCardAccordeon,
    ViewCardSection,
    ViewGroup,
    ViewGroup2,
    ViewRow,
    ViewRow2,
    ViewSection,
    ViewSection2,
    ViewSectionCard,
    ViewSectionCard2,
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
        },
        layouts: {
            row: Row,
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
            card_oneof: {Component: CardOneOf, independent: true},
            secret: {Component: Secret, independent: true},
            base: {Component: ObjectBase, independent: true},
        },
        layouts: {
            row: Row,
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
            number_with_scale: {Component: NumberWithScale},
            monaco_input: {Component: MonacoInput},
            text_content: {Component: TextContent, independent: true},
        },
        layouts: {
            row: Row,
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

export const dynamicCardConfig: DynamicFormConfig = {
    array: {
        inputs: {
            select: {Component: MultiSelect},
            table: {Component: TableArrayInput},
            base: {Component: ArrayBase},
        },
        layouts: {
            row: Row2,
            accordeon: AccordeonCardLayout,
            section: SectionWithSubtitle,
            section2: SectionWithSubtitle2,
            group: SectionCard,
            group2: SectionCard2,
            table_item: TableCell,
            transparent: Transparent,
        },
        validators: {
            base: getArrayValidator(),
        },
    },
    boolean: {
        inputs: {
            base: {Component: Checkbox},
        },
        layouts: {
            row: Row2,
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
            row: Row2,
            table_item: TableCell,
            transparent: Transparent,
        },
        validators: {
            base: getNumberValidator(),
        },
    },
    object: {
        inputs: {
            oneof: {Component: OneOfCard, independent: true},
            secret: {Component: Secret, independent: true},
            base: {Component: ObjectBase, independent: true},
        },
        layouts: {
            row: Row2,
            accordeon: AccordeonCardLayout,
            section: SectionWithSubtitle,
            section2: SectionWithSubtitle2,
            group: SectionCard,
            group2: SectionCard2,
            transparent: Transparent,
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
            number_with_scale: {Component: NumberWithScale},
            monaco_input: {Component: MonacoInputCard},
            text_content: {Component: TextContent, independent: true},
        },
        layouts: {
            row: Row2,
            table_item: TableCell,
            transparent: Transparent,
            section: SectionWithSubtitle,
            section2: SectionWithSubtitle2,
            group: SectionCard,
            group2: SectionCard2,
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
        },
        layouts: {
            row: ViewRow,
            table_item: ViewTableCell,
        },
    },
    number: {
        views: {
            base: {Component: BaseView},
        },
        layouts: {
            row: ViewRow,
            table_item: ViewTableCell,
            transparent: ViewTransparent,
        },
    },
    object: {
        views: {
            oneof: {Component: OneOfView, independent: true},
            card_oneof: {Component: CardOneOfView, independent: true},
            secret: undefined,
            base: {Component: ObjectBaseView, independent: true},
        },
        layouts: {
            row: ViewRow,
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
            number_with_scale: {Component: NumberWithScaleView},
            monaco_input: {Component: MonacoView},
            text_content: undefined,
        },
        layouts: {
            row: ViewRow,
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

export const dynamicViewCardConfig: DynamicViewConfig = {
    array: {
        views: {
            select: {Component: MultiSelectView},
            table: {Component: TableArrayView},
            base: {Component: ArrayBaseView},
        },
        layouts: {
            row: ViewRow2,
            accordeon: ViewAccordeonCard,
            section: ViewSection,
            section2: ViewSection2,
            group: ViewSectionCard,
            group2: ViewSectionCard2,
            table_item: ViewTableCell,
            transparent: ViewTransparent,
        },
    },
    boolean: {
        views: {
            base: {Component: BaseView},
        },
        layouts: {
            row: ViewRow2,
            table_item: ViewTableCell,
        },
    },
    number: {
        views: {
            base: {Component: BaseView},
        },
        layouts: {
            row: ViewRow2,
            table_item: ViewTableCell,
            transparent: ViewTransparent,
        },
    },
    object: {
        views: {
            oneof: {Component: OneOfCardView, independent: true},
            secret: undefined,
            base: {Component: ObjectBaseView, independent: true},
        },
        layouts: {
            row: ViewRow2,
            accordeon: ViewAccordeonCard,
            section: ViewSection,
            section2: ViewSection2,
            group: ViewSectionCard,
            group2: ViewSectionCard2,
            transparent: ViewTransparent,
        },
    },
    string: {
        views: {
            password: undefined,
            textarea: {Component: TextAreaView},
            select: {Component: BaseView},
            base: {Component: BaseView},
            number_with_scale: {Component: NumberWithScaleView},
            monaco_input: {Component: MonacoViewCard},
            text_content: undefined,
        },
        layouts: {
            row: ViewRow2,
            table_item: ViewTableCell,
            transparent: ViewTransparent,
            section: ViewSection,
            section2: ViewSection2,
            group: ViewSectionCard,
            group2: ViewSectionCard2,
        },
    },
};