import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchemaArray} from '../../../../core/types';

const settings: Partial<JsonSchemaArray> = {
    items: {type: JsonSchemaType.String, enum: ['alpha', 'beta', 'gamma']},
    nodeParameters: {
        entityProps: {
            enumDescriptions: {alpha: 'Alpha', beta: 'Beta', gamma: 'Gamma'},
            optionsDisabled: {gamma: true},
            direction: 'row',
        },
    },
};

export const schema: JsonSchemaArray = {
    type: JsonSchemaType.Array,
    title: 'CheckboxGroupInput',
    description: 'Description for CheckboxGroupInput',
    ...settings,
    nodeParameters: {
        type: NodeType.Array,
        entity: 'checkbox_group',
        layout: 'row',
        ...settings.nodeParameters,
        flags: {open: true},
    },
};
export const value = ['alpha'];
