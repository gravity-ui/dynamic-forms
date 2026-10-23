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
    title: 'OneOfNested',
    description: 'Description for OneOfNested',
    properties: {name: nameSchema, age: ageSchema},
    nodeParameters: {
        type: NodeType.Object,
        entity: 'one_of_nested',
        layout,
        entityProps: {
            booleanToKey: {true: 'name', false: 'age'},
            toggler: {
                type: JsonSchemaType.Boolean,
                title: 'Use name',
                nodeParameters: {type: NodeType.Boolean, entity: 'switch', layout: 'row'},
            },
            withIndent: true,
            order: ['name', 'age'],
        },
        flags: {open: true},
        layoutProps: {descriptionType: 'bottom'},
    },
});

export const value = {name: 'Ada'};
