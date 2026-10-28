import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchemaNumber} from '../../../../core/types';

export const createSchema = (layout: string | undefined): JsonSchemaNumber => ({
    type: JsonSchemaType.Number,
    title: 'NumberValue',
    description: 'Description for NumberValue',

    nodeParameters: {
        type: NodeType.Number,
        entity: 'base',
        layout,
        entityProps: {},
        flags: {open: true},
        layoutProps: {descriptionType: 'bottom'},
    },
});

export const value = 42.5;
