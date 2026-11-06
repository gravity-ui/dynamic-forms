import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchemaArray} from '../../../../core/types';

const settings: Partial<JsonSchemaArray> = {
    items: {type: JsonSchemaType.String, enum: ['alpha', 'beta', 'gamma']},
    examples: [['Choose teams']],
    nodeParameters: {
        entityProps: {
            enumDescriptions: {alpha: 'Alpha', beta: 'Beta', gamma: 'Gamma'},
            optionsMeta: {beta: 'The second team'},
            hasClear: true,
        },
    },
};

export const schema: JsonSchemaArray = {
    type: JsonSchemaType.Array,
    title: 'MultiSelectInput',
    description: 'Description for MultiSelectInput',
    ...settings,
    nodeParameters: {
        type: NodeType.Array,
        entity: 'select',
        layout: 'row',
        ...settings.nodeParameters,
        flags: {open: true},
    },
};
export const value = ['alpha'];
