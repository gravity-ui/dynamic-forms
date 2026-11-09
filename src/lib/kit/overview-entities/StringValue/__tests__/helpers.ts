import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchemaString} from '../../../../core/types';

export const createSchema = (layout: string | undefined): JsonSchemaString => ({
    type: JsonSchemaType.String,
    title: 'StringValue',
    description: 'Description for StringValue',

    nodeParameters: {
        type: NodeType.String,
        entity: 'base',
        layout,
        entityProps: {},
        flags: {open: true},
        layoutProps: {descriptionType: 'bottom'},
    },
});

export const value = 'A detailed account description';
