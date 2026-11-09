import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchema, JsonSchemaObject} from '../../../../core/types';

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

export const createSchema = (layout: string | undefined): JsonSchemaObject => ({
    type: JsonSchemaType.Object,
    title: 'ObjectEntity',
    description: 'Description for ObjectEntity',
    properties: {name: nameSchema, age: ageSchema},
    nodeParameters: {
        type: NodeType.Object,
        entity: 'base',
        layout,
        entityProps: {order: ['name', 'age']},
        flags: {open: true},
        layoutProps: {descriptionType: 'bottom'},
    },
});

export const value = {name: 'Ada', age: 37};
