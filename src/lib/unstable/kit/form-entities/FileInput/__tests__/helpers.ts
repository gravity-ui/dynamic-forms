import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchemaString} from '../../../../core/types';

const settings: Partial<JsonSchemaString> = {
    nodeParameters: {entityProps: {readAsMethod: 'readAsText', accept: ['text/plain']}},
};

export const schema: JsonSchemaString = {
    type: JsonSchemaType.String,
    title: 'FileInput',
    description: 'Description for FileInput',
    ...settings,
    nodeParameters: {
        type: NodeType.String,
        entity: 'file_input',
        layout: 'row',
        ...settings.nodeParameters,
        flags: {open: true},
    },
};
export const value = undefined;
