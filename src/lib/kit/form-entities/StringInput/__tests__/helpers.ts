import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchemaString} from '../../../../core/types';

const settings: Partial<JsonSchemaString> = {
    examples: ['Service name'],
    nodeParameters: {entityProps: {hasClear: true}},
};

export const schema: JsonSchemaString = {
    type: JsonSchemaType.String,
    title: 'StringInput',
    description: 'Description for StringInput',
    ...settings,
    nodeParameters: {
        type: NodeType.String,
        entity: 'base',
        layout: 'row',
        ...settings.nodeParameters,
        flags: {open: true},
    },
};
export const value = 'Gravity service';
