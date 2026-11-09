import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchemaArray} from '../../../../core/types';

export const createSchema = (layout: string | undefined): JsonSchemaArray => ({
    type: JsonSchemaType.Array,
    title: 'PrimitiveArrayValue',
    description: 'Description for PrimitiveArrayValue',
    items: {type: JsonSchemaType.String, enum: ['draft', 'published', 'archived']},
    nodeParameters: {
        type: NodeType.Array,
        entity: 'select',
        layout,
        entityProps: {
            direction: 'row',
            enumDescriptions: {draft: 'Draft', published: 'Published', archived: 'Archived'},
        },
        flags: {open: true},
        layoutProps: {descriptionType: 'bottom'},
    },
});

export const value = ['draft', 'published'];
