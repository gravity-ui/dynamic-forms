import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchemaString} from '../../../../core/types';

const settings: Partial<JsonSchemaString> = {
    examples: ['Password'],
    nodeParameters: {entityProps: {hasClear: true, hideCopyButton: false, hideRevealButton: false}},
};

export const schema: JsonSchemaString = {
    type: JsonSchemaType.String,
    title: 'PasswordInput',
    description: 'Description for PasswordInput',
    ...settings,
    nodeParameters: {
        type: NodeType.String,
        entity: 'password',
        layout: 'row',
        ...settings.nodeParameters,
        flags: {open: true},
    },
};
export const value = 'test-secret';
