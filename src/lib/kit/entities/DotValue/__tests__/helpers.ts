import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchema, JsonSchemaObject} from '../../../../core/types';

const nameSchema: JsonSchema = {
    type: JsonSchemaType.String,
    title: 'Name',
    minLength: 2,
    nodeParameters: {type: NodeType.String, entity: 'base', layout: 'row'},
};

export const createSchema = (layout: string | undefined): JsonSchemaObject => ({
    type: JsonSchemaType.Object,
    title: 'DotValue',
    description: 'Description for DotValue',
    properties: {
        value: {
            ...nameSchema,
            nodeParameters: {...nameSchema.nodeParameters, layout: 'transparent'},
        },
    },
    nodeParameters: {
        type: NodeType.Object,
        entity: 'dot_value',
        layout,
        entityProps: {},
        flags: {open: true},
        layoutProps: {descriptionType: 'bottom'},
    },
});

export const value = {value: 'Ada'};
