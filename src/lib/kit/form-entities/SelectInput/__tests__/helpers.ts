import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchemaString} from '../../../../core/types';

const settings: Partial<JsonSchemaString> = {
    enum: ['draft', 'published', 'archived'],
    examples: ['Choose status'],
    nodeParameters: {
        entityProps: {
            enumDescriptions: {draft: 'Draft', published: 'Published', archived: 'Archived'},
            optionsMeta: {published: 'Visible to every reader'},
            hasClear: true,
        },
    },
};

export const schema: JsonSchemaString = {
    type: JsonSchemaType.String,
    title: 'SelectInput',
    description: 'Description for SelectInput',
    ...settings,
    nodeParameters: {
        type: NodeType.String,
        entity: 'select',
        layout: 'row',
        ...settings.nodeParameters,
        flags: {open: true},
    },
};
export const value = 'draft';
