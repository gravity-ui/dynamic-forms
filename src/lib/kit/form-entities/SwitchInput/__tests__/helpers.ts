import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchemaBoolean} from '../../../../core/types';

const settings: Partial<JsonSchemaBoolean> = {
    nodeParameters: {entityProps: {content: 'Notifications enabled'}},
};

export const schema: JsonSchemaBoolean = {
    type: JsonSchemaType.Boolean,
    title: 'SwitchInput',
    description: 'Description for SwitchInput',
    ...settings,
    nodeParameters: {
        type: NodeType.Boolean,
        entity: 'switch',
        layout: 'row',
        ...settings.nodeParameters,
        flags: {open: true},
    },
};
export const value = true;
