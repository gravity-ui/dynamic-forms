import {TEXT_COLORS} from '@gravity-ui/uikit';

import {
    ArraySpec,
    BooleanSpec,
    NumberSpec,
    ObjectSpec,
    Spec,
    SpecTypes,
    StringSpec,
    dynamicConfig,
} from '../../../lib';

const required: BooleanSpec = {
    type: SpecTypes.Boolean,
    viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Required'},
};

const maxLength: NumberSpec = {
    type: SpecTypes.Number,
    viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Max length'},
};

const minLength: NumberSpec = {
    type: SpecTypes.Number,
    viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Min length'},
};

const maximum: NumberSpec = {
    type: SpecTypes.Number,
    viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Maximum'},
};

const minimum: NumberSpec = {
    type: SpecTypes.Number,
    viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Minimum'},
};

const format: StringSpec = {
    type: SpecTypes.String,
    enum: ['―', 'float', 'int64'],
    viewSpec: {type: 'select', layout: 'row', layoutTitle: 'Format'},
};

const items: ObjectSpec = {
    required: true,
    type: SpecTypes.Object,
    viewSpec: {type: 'spec_selector', layoutTitle: 'Items'},
};

const properties: ArraySpec = {
    type: SpecTypes.Array,
    required: true,
    items: {
        type: SpecTypes.Object,
        properties: {
            key: {
                type: SpecTypes.String,
                viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Key'},
            },
            property: {
                type: SpecTypes.Object,
                required: true,
                viewSpec: {type: 'spec_selector', layoutTitle: 'Property'},
            },
        },
        viewSpec: {type: 'base', layout: 'accordeon', layoutTitle: 'Item'},
    },
    viewSpec: {
        type: 'base',
        layout: 'accordeon',
        layoutTitle: 'Properties',
        table: [
            {label: 'Key', property: 'key'},
            {label: 'Property', property: 'property'},
        ],
    },
};

const pattern: StringSpec = {
    type: SpecTypes.String,
    viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Pattern'},
};

const patternError: StringSpec = {
    type: SpecTypes.String,
    viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Pattern error'},
};

const enumSpec: ArraySpec = {
    type: SpecTypes.Array,
    items: {
        type: SpecTypes.String,
        viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Option'},
    },
    viewSpec: {type: 'base', layout: 'accordeon', layoutTitle: 'Enum'},
};

const description: ArraySpec = {
    type: SpecTypes.Array,
    items: {
        type: SpecTypes.Object,
        properties: {
            property: {
                type: SpecTypes.String,
                viewSpec: {type: 'base', layout: 'table_item'},
            },
            label: {
                type: SpecTypes.String,
                viewSpec: {type: 'base', layout: 'table_item'},
            },
        },
        viewSpec: {type: ''},
    },
    viewSpec: {
        type: 'table',
        layout: 'accordeon',
        layoutTitle: 'Description',
        table: [
            {label: 'Property', property: 'property'},
            {label: 'Label', property: 'label'},
        ],
    },
};

const selectParams: ObjectSpec = {
    type: SpecTypes.Object,
    properties: {
        filterPlaceholder: {
            type: SpecTypes.String,
            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Filter Placeholder'},
        },
        meta: {
            type: SpecTypes.Array,
            items: {
                type: SpecTypes.Object,
                properties: {
                    property: {
                        type: SpecTypes.String,
                        viewSpec: {type: 'base', layout: 'table_item'},
                    },
                    text: {
                        type: SpecTypes.String,
                        viewSpec: {type: 'base', layout: 'table_item'},
                    },
                },
                viewSpec: {type: ''},
            },
            viewSpec: {
                type: 'table',
                layout: 'accordeon',
                layoutTitle: 'Meta',
                table: [
                    {label: 'Property', property: 'property'},
                    {label: 'Text', property: 'text'},
                ],
            },
        },
    },
    viewSpec: {
        type: 'base',
        layout: 'accordeon',
        layoutTitle: 'Select Params',
    },
};

const getValidator = (map: Record<string, unknown>): StringSpec => ({
    type: SpecTypes.String,
    enum: ['―', ...Object.keys(map)],
    viewSpec: {type: 'select', layout: 'row', layoutTitle: 'Validator'},
});

const getViewSpec = (properties: Record<string, Spec>, order: string[]): ObjectSpec => ({
    type: SpecTypes.Object,
    required: true,
    properties,
    viewSpec: {type: 'base', layout: 'accordeon', layoutTitle: 'View spec', order},
});

const disabled: BooleanSpec = {
    type: SpecTypes.Boolean,
    viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Disabled'},
};

const getViewType = (map: Record<string, unknown>): StringSpec => ({
    type: SpecTypes.String,
    enum: ['―', ...Object.keys(map)],
    viewSpec: {type: 'select', layout: 'row', layoutTitle: 'Type'},
});

const getLayoutSpec = (map: Record<string, unknown>): StringSpec => ({
    type: SpecTypes.String,
    enum: ['―', ...Object.keys(map)],
    viewSpec: {type: 'select', layout: 'row', layoutTitle: 'Layout'},
});

const layoutTitle: StringSpec = {
    type: SpecTypes.String,
    viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Layout title'},
};

const layoutDescription: StringSpec = {
    type: SpecTypes.String,
    viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Layout description'},
};

const layoutOpen: BooleanSpec = {
    type: SpecTypes.Boolean,
    viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Layout open'},
};

const itemLabel: StringSpec = {
    type: SpecTypes.String,
    viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Item label'},
};

const itemPrefix: StringSpec = {
    type: SpecTypes.String,
    viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Item Prefix'},
};

const addButtonPosition: StringSpec = {
    type: SpecTypes.String,
    enum: ['―', 'down', 'right'],
    viewSpec: {type: 'select', layout: 'row', layoutTitle: 'Add Button Position'},
};

const table: ArraySpec = {
    type: SpecTypes.Array,
    items: {
        type: SpecTypes.Object,
        properties: {
            property: {
                type: SpecTypes.String,
                viewSpec: {type: 'base', layout: 'table_item'},
            },
            label: {
                type: SpecTypes.String,
                viewSpec: {type: 'base', layout: 'table_item'},
            },
        },
        viewSpec: {type: ''},
    },
    viewSpec: {
        type: 'table',
        layout: 'accordeon',
        layoutTitle: 'Table',
        table: [
            {label: 'Property', property: 'property'},
            {label: 'Label', property: 'label'},
        ],
    },
};

const hidden: BooleanSpec = {
    type: SpecTypes.Boolean,
    viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Hidden'},
};

const textContentParams: ObjectSpec = {
    type: SpecTypes.Object,
    properties: {
        text: {
            type: SpecTypes.String,
            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Text'},
        },
        themeLabel: {
            type: SpecTypes.String,
            enum: ['―', 'normal', 'info', 'danger', 'warning', 'success', 'unknown', 'clear'],
            viewSpec: {type: 'select', layout: 'row', layoutTitle: 'Theme label'},
        },
        icon: {
            type: SpecTypes.String,
            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Icon'},
        },
        iconColor: {
            type: SpecTypes.String,
            enum: ['―', ...TEXT_COLORS],
            viewSpec: {type: 'select', layout: 'row', layoutTitle: 'Icon color'},
        },
    },
    viewSpec: {
        type: 'base',
        layout: 'accordeon',
        layoutTitle: 'Text content params',
    },
};

const sizeParams: ObjectSpec = {
    type: SpecTypes.Object,
    properties: {
        defaultType: {
            type: SpecTypes.String,
            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Default type'},
        },
        viewType: {
            type: SpecTypes.String,
            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'View type'},
        },
        scale: {
            required: true,
            type: SpecTypes.Array,
            items: {
                type: SpecTypes.Object,
                properties: {
                    type: {
                        type: SpecTypes.String,
                        viewSpec: {type: 'base', layout: 'table_item'},
                    },
                    factor: {
                        type: SpecTypes.Number,
                        viewSpec: {type: 'base', layout: 'table_item'},
                    },
                    title: {
                        type: SpecTypes.String,
                        viewSpec: {type: 'base', layout: 'table_item'},
                    },
                },
                viewSpec: {type: ''},
            },
            viewSpec: {
                type: 'table',
                layout: 'accordeon',
                layoutTitle: 'Scale',
                table: [
                    {label: 'Type', property: 'type'},
                    {label: 'Factor', property: 'factor'},
                    {label: 'Title', property: 'title'},
                ],
            },
        },
    },
    viewSpec: {
        type: 'base',
        layout: 'accordeon',
        layoutTitle: 'Size parameters',
    },
};

const monacoParams: ObjectSpec = {
    type: SpecTypes.Object,
    properties: {
        language: {
            type: SpecTypes.String,
            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Language'},
        },
        fontSize: {
            type: SpecTypes.Number,
            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Font size'},
        },
    },
    viewSpec: {
        type: 'base',
        layout: 'accordeon',
        layoutTitle: 'Monaco parameters',
    },
};

const oneOfParams: ObjectSpec = {
    type: SpecTypes.Object,
    properties: {
        toggler: {
            type: SpecTypes.String,
            enum: ['―', 'radio', 'select', 'card'],
            viewSpec: {type: 'select', layout: 'row', layoutTitle: 'Switch type'},
        },
    },
    viewSpec: {
        type: 'base',
        layout: 'accordeon',
        layoutTitle: 'OneOf parameters',
    },
};

const placeholder: StringSpec = {
    type: SpecTypes.String,
    viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Placeholder'},
};

const order: ArraySpec = {
    type: SpecTypes.Array,
    items: {
        type: SpecTypes.String,
        viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Property'},
    },
    viewSpec: {type: 'base', layout: 'accordeon', layoutTitle: 'Order'},
};

const fileInput: ObjectSpec = {
    type: SpecTypes.Object,
    properties: {
        accept: {
            type: SpecTypes.String,
            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Accept'},
        },
        readAsMethod: {
            type: SpecTypes.String,
            enum: ['―', 'readAsArrayBuffer', 'readAsBinaryString', 'readAsDataURL', 'readAsText'],
            viewSpec: {type: 'select', layout: 'row', layoutTitle: 'Read As Method'},
        },
        ignoreText: {
            type: SpecTypes.Boolean,
            viewSpec: {
                type: 'base',
                layout: 'row',
                layoutTitle: 'Ignore text',
            },
        },
    },
    viewSpec: {
        type: 'base',
        layout: 'accordeon',
        layoutTitle: 'File Input',
    },
};

const copy: BooleanSpec = {
    type: SpecTypes.Boolean,
    viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Copy'},
};

export const getArrayOptions = (): ObjectSpec => ({
    type: SpecTypes.Object,
    required: true,
    properties: {
        required,
        maxLength,
        minLength,
        items,
        enum: enumSpec,
        description,
        validator: getValidator(dynamicConfig.array.validators),
        viewSpec: getViewSpec(
            {
                disabled,
                type: getViewType(dynamicConfig.array.inputs),
                layout: getLayoutSpec(dynamicConfig.array.layouts),
                layoutTitle,
                layoutDescription,
                layoutOpen,
                itemLabel,
                itemPrefix,
                table,
                placeholder,
                addButtonPosition,
                hidden,
                selectParams,
            },
            [
                'disabled',
                'type',
                'layout',
                'layoutTitle',
                'layoutDescription',
                'layoutOpen',
                'itemLabel',
                'itemPrefix',
                'table',
                'placeholder',
                'addButtonPosition',
                'hidden',
                'selectParams',
            ],
        ),
    },
    viewSpec: {
        type: 'base',
        layout: 'section',
        order: [
            'required',
            'maxLength',
            'minLength',
            'items',
            'enum',
            'description',
            'validator',
            'viewSpec',
        ],
    },
});

export const getBooleanOptions = (): ObjectSpec => ({
    type: SpecTypes.Object,
    required: true,
    properties: {
        required,
        validator: getValidator(dynamicConfig.boolean.validators),
        viewSpec: getViewSpec(
            {
                disabled,
                type: getViewType(dynamicConfig.boolean.inputs),
                layout: getLayoutSpec(dynamicConfig.boolean.layouts),
                layoutTitle,
                layoutDescription,
                layoutOpen,
                hidden,
            },
            [
                'disabled',
                'type',
                'layout',
                'layoutTitle',
                'layoutDescription',
                'layoutOpen',
                'hidden',
            ],
        ),
    },
    viewSpec: {
        type: 'base',
        layout: 'section',
        order: ['required', 'validator', 'viewSpec'],
    },
});

export const getNumberOptions = (): ObjectSpec => ({
    type: SpecTypes.Object,
    required: true,
    properties: {
        required,
        maximum,
        minimum,
        format,
        validator: getValidator(dynamicConfig.number.validators),
        viewSpec: getViewSpec(
            {
                disabled,
                type: getViewType(dynamicConfig.number.inputs),
                layout: getLayoutSpec(dynamicConfig.number.layouts),
                layoutTitle,
                layoutDescription,
                layoutOpen,
                placeholder,
                copy,
                hidden,
            },
            [
                'disabled',
                'type',
                'layout',
                'layoutTitle',
                'layoutDescription',
                'layoutOpen',
                'placeholder',
                'copy',
                'hidden',
            ],
        ),
    },
    viewSpec: {
        type: 'base',
        layout: 'section',
        order: ['required', 'maximum', 'minimum', 'format', 'validator', 'viewSpec'],
    },
});

export const getObjectOptions = (): ObjectSpec => ({
    type: SpecTypes.Object,
    required: true,
    properties: {
        required,
        properties,
        description,
        validator: getValidator(dynamicConfig.object.validators),
        viewSpec: getViewSpec(
            {
                disabled,
                type: getViewType(dynamicConfig.object.inputs),
                layout: getLayoutSpec(dynamicConfig.object.layouts),
                layoutTitle,
                layoutDescription,
                layoutOpen,
                order,
                oneOfParams,
                placeholder,
                hidden,
            },
            [
                'disabled',
                'type',
                'layout',
                'layoutTitle',
                'layoutDescription',
                'layoutOpen',
                'order',
                'oneOfParams',
                'placeholder',
                'hidden',
            ],
        ),
    },
    viewSpec: {
        type: 'base',
        layout: 'section',
        order: ['required', 'properties', 'description', 'validator', 'viewSpec'],
    },
});

export const getStringOptions = (): ObjectSpec => ({
    type: SpecTypes.Object,
    required: true,
    properties: {
        required,
        maxLength,
        minLength,
        pattern,
        patternError,
        maximum,
        minimum,
        format,
        enum: enumSpec,
        description,
        validator: getValidator(dynamicConfig.string.validators),
        viewSpec: getViewSpec(
            {
                disabled,
                type: getViewType(dynamicConfig.string.inputs),
                layout: getLayoutSpec(dynamicConfig.string.layouts),
                layoutTitle,
                layoutDescription,
                layoutOpen,
                sizeParams,
                monacoParams,
                textContentParams,
                placeholder,
                fileInput,
                copy,
                hidden,
                selectParams,
            },
            [
                'disabled',
                'type',
                'layout',
                'layoutTitle',
                'layoutDescription',
                'layoutOpen',
                'sizeParams',
                'monacoParams',
                'textContentParams',
                'placeholder',
                'fileInput',
                'copy',
                'hidden',
                'selectParams',
            ],
        ),
    },
    viewSpec: {
        type: 'base',
        layout: 'section',
        order: [
            'required',
            'maxLength',
            'minLength',
            'pattern',
            'patternError',
            'maximum',
            'minimum',
            'format',
            'enum',
            'description',
            'validator',
            'viewSpec',
        ],
    },
});
