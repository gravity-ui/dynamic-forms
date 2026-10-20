import {JsonSchemaType, NodeType} from '../../core/constants';
import type {FieldValue, JsonSchema, JsonSchemaArray, JsonSchemaObject} from '../../core/types';

const nameSchema: JsonSchema = {
    type: JsonSchemaType.String,
    title: 'Name',
    description: 'The name shown to other users',
    minLength: 2,
    nodeParameters: {type: NodeType.String, entity: 'base', layout: 'row'},
};

const ageSchema: JsonSchema = {
    type: JsonSchemaType.Number,
    title: 'Age',
    minimum: 0,
    maximum: 100,
    nodeParameters: {type: NodeType.Number, entity: 'base', layout: 'row'},
};

export const arraySchema: JsonSchemaArray = {
    type: JsonSchemaType.Array,
    title: 'Team members',
    description: 'Add the names of your team members',
    items: nameSchema,
    nodeParameters: {
        type: NodeType.Array,
        entity: 'base',
        entityProps: {addButtonText: 'Add member'},
        layout: 'section',
        layoutProps: {descriptionType: 'bottom'},
    },
};

export const objectSchema: JsonSchemaObject = {
    type: JsonSchemaType.Object,
    title: 'Profile',
    description: 'Contact details for the account',
    properties: {name: nameSchema, age: ageSchema},
    nodeParameters: {
        type: NodeType.Object,
        entity: 'base',
        layout: 'section',
        layoutProps: {descriptionType: 'bottom'},
    },
};

export const tableSchema: JsonSchemaArray = {
    ...arraySchema,
    title: 'People',
    items: {
        ...objectSchema,
        properties: {
            name: {...nameSchema, nodeParameters: {...nameSchema.nodeParameters, layout: 'cell'}},
            age: {...ageSchema, nodeParameters: {...ageSchema.nodeParameters, layout: 'cell'}},
        },
    },
    nodeParameters: {
        type: NodeType.Array,
        entity: 'table',
        entityProps: {addButtonText: 'Add person'},
        layout: 'section',
    },
};

export const selectionSchema: JsonSchemaArray = {
    type: JsonSchemaType.Array,
    title: 'Publication statuses',
    items: {type: JsonSchemaType.String, enum: ['draft', 'published', 'archived']},
    nodeParameters: {
        type: NodeType.Array,
        entity: 'select',
        layout: 'row',
        entityProps: {
            enumDescriptions: {draft: 'Draft', published: 'Published', archived: 'Archived'},
        },
    },
};

export const checkboxSchema: JsonSchemaArray = {
    ...selectionSchema,
    nodeParameters: {
        ...selectionSchema.nodeParameters,
        entity: 'checkbox_group',
        entityProps: {...selectionSchema.nodeParameters?.entityProps, direction: 'column'},
    },
};

export const inlineSchema: JsonSchemaObject = {
    ...objectSchema,
    properties: {
        name: {
            ...nameSchema,
            nodeParameters: {...nameSchema.nodeParameters, layout: 'transparent'},
        },
        age: {...ageSchema, nodeParameters: {...ageSchema.nodeParameters, layout: 'transparent'}},
    },
    nodeParameters: {
        type: NodeType.Object,
        entity: 'inline',
        entityProps: {delimiter: ':'},
        layout: 'row',
    },
};

export const oneOfSchema: JsonSchemaObject = {
    type: JsonSchemaType.Object,
    title: 'Contact method',
    properties: {name: nameSchema, age: ageSchema},
    nodeParameters: {
        type: NodeType.Object,
        entity: 'one_of_nested',
        entityProps: {
            booleanToKey: {true: 'name', false: 'age'},
            toggler: {
                title: 'Use name',
                nodeParameters: {type: NodeType.Boolean, entity: 'switch', layout: 'row'},
            },
            withIndent: true,
        },
        layout: 'section',
    },
};

export const fewOfSchema: JsonSchemaObject = {
    ...oneOfSchema,
    title: 'Visible fields',
    nodeParameters: {
        ...oneOfSchema.nodeParameters,
        entity: 'few_of_nested',
        entityProps: {
            toggler: {
                title: 'Fields',
                items: {enum: ['name', 'age']},
                nodeParameters: {
                    type: NodeType.Array,
                    entity: 'select',
                    layout: 'row',
                    entityProps: {enumDescriptions: {name: 'Name', age: 'Age'}},
                },
            },
            withIndent: true,
        },
    },
};

const rangeSchema: JsonSchemaObject = {
    type: JsonSchemaType.Object,
    title: 'Allowed range',
    properties: {
        from: {
            ...ageSchema,
            title: 'From',
            nodeParameters: {...ageSchema.nodeParameters, layout: 'transparent'},
        },
        to: {
            ...ageSchema,
            title: 'To',
            nodeParameters: {...ageSchema.nodeParameters, layout: 'transparent'},
        },
    },
    nodeParameters: {type: NodeType.Object, entity: 'range_input', layout: 'row'},
};

export const structureCases: {name: string; schema: JsonSchema; value: FieldValue}[] = [
    {name: 'array base', schema: arraySchema, value: ['Ada', 'Grace']},
    {
        name: 'array table',
        schema: tableSchema,
        value: [
            {name: 'Ada', age: 37},
            {name: 'Grace', age: 45},
        ],
    },
    {name: 'array select', schema: selectionSchema, value: ['draft', 'published']},
    {name: 'array checkbox group', schema: checkboxSchema, value: ['draft', 'archived']},
    {name: 'object base', schema: objectSchema, value: {name: 'Ada', age: 37}},
    {name: 'object inline', schema: inlineSchema, value: {name: 'Ada', age: 37}},
    {
        name: 'object dot value',
        schema: {
            type: JsonSchemaType.Object,
            title: 'Display name',
            properties: {
                value: {
                    ...nameSchema,
                    nodeParameters: {...nameSchema.nodeParameters, layout: 'transparent'},
                },
            },
            nodeParameters: {type: NodeType.Object, entity: 'dot_value', layout: 'row'},
        },
        value: {value: 'Ada'},
    },
    {name: 'object one of nested', schema: oneOfSchema, value: {name: 'Ada'}},
    {name: 'object few of nested', schema: fewOfSchema, value: {name: 'Ada', age: 37}},
    {name: 'object range input', schema: rangeSchema, value: {from: 20, to: 80}},
    {
        name: 'object range slider',
        schema: {
            ...rangeSchema,
            nodeParameters: {...rangeSchema.nodeParameters, entity: 'range_slider'},
        },
        value: {from: 20, to: 80},
    },
];
