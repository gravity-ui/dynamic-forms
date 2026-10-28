import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchemaString} from '../../../../core/types';

export const createSchema = (layout: string | undefined): JsonSchemaString => ({
    type: JsonSchemaType.String,
    title: 'TextContent',
    description: 'Description for TextContent',

    nodeParameters: {
        type: NodeType.String,
        entity: 'text_content',
        layout,
        entityProps: {iconName: 'CircleInfo', title: '<strong>Build</strong> result'},
        flags: {open: true},
        layoutProps: {descriptionType: 'bottom'},
    },
});

export const value = 'Passed';
