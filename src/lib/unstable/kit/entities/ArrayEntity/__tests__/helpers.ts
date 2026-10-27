import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchema, JsonSchemaArray} from '../../../../core/types';

const nameSchema: JsonSchema = {
    type: JsonSchemaType.String,
    title: 'Name',
    minLength: 2,
    nodeParameters: {type: NodeType.String, entity: 'base', layout: 'row'},
};

export const createSchema = (layout: string | undefined): JsonSchemaArray => ({
    type: JsonSchemaType.Array,
    title: 'ArrayEntity',
    description: 'Description for ArrayEntity',
    items: nameSchema,
    nodeParameters: {
        type: NodeType.Array,
        entity: 'base',
        layout,
        entityProps: {addButtonText: 'Add member'},
        flags: {open: true},
        layoutProps: {descriptionType: 'bottom'},
    },
});

export const value = ['Ada', 'Grace'];
