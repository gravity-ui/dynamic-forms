import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchemaString} from '../../../../core/types';

const settings: Partial<JsonSchemaString> = {
    examples: ['Description'],
    nodeParameters: {entityProps: {minRows: 2, maxRows: 4, hasClear: true}},
};

export const schema: JsonSchemaString = {
    type: JsonSchemaType.String,
    title: 'TextAreaInput',
    description: 'Description for TextAreaInput',
    ...settings,
    nodeParameters: {
        type: NodeType.String,
        entity: 'textarea',
        layout: 'row',
        ...settings.nodeParameters,
        flags: {open: true},
    },
};
export const value = 'First line\nSecond line';
