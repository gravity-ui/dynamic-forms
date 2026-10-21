import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchemaBoolean} from '../../../../core/types';

const settings: Partial<JsonSchemaBoolean> = {
    nodeParameters: {entityProps: {content: 'Receive updates'}},
};

export const schema: JsonSchemaBoolean = {
    type: JsonSchemaType.Boolean,
    title: 'CheckboxInput',
    description: 'Description for CheckboxInput',
    ...settings,
    nodeParameters: {
        type: NodeType.Boolean,
        entity: 'base',
        layout: 'row',
        ...settings.nodeParameters,
        flags: {open: true},
    },
};
export const value = false;
