import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchemaString} from '../../../../core/types';

const settings: Partial<JsonSchemaString> = {
    nodeParameters: {entityProps: {withAlpha: false, compact: false}},
};

export const schema: JsonSchemaString = {
    type: JsonSchemaType.String,
    title: 'ColorPickerInput',
    description: 'Description for ColorPickerInput',
    ...settings,
    nodeParameters: {
        type: NodeType.String,
        entity: 'color_picker',
        layout: 'row',
        ...settings.nodeParameters,
        flags: {open: true},
    },
};
export const value = '#5282ff';
