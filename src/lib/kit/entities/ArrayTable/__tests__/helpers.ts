import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchema, JsonSchemaArray} from '../../../../core/types';

const nameSchema: JsonSchema = {
    type: JsonSchemaType.String,
    title: 'Name',
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

export const createSchema = (layout: string | undefined): JsonSchemaArray => ({
    type: JsonSchemaType.Array,
    title: 'ArrayTable',
    description: 'Description for ArrayTable',
    items: {
        type: JsonSchemaType.Object,
        properties: {
            name: {...nameSchema, nodeParameters: {...nameSchema.nodeParameters, layout: 'cell'}},
            age: {...ageSchema, nodeParameters: {...ageSchema.nodeParameters, layout: 'cell'}},
        },
        nodeParameters: {type: NodeType.Object, entity: 'base', layout: 'section'},
    },
    nodeParameters: {
        type: NodeType.Array,
        entity: 'table',
        layout,
        entityProps: {order: ['name', 'age'], addButtonText: 'Add person'},
        flags: {open: true},
        layoutProps: {descriptionType: 'bottom'},
    },
});

export const value = [
    {name: 'Ada', age: 37},
    {name: 'Grace', age: 45},
];
