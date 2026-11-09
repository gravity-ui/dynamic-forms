import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchemaString} from '../../../../core/types';

export const createSchema = (layout: string | undefined): JsonSchemaString => ({
    type: JsonSchemaType.String,
    title: 'ColorPickerValue',
    description: 'Description for ColorPickerValue',

    nodeParameters: {
        type: NodeType.String,
        entity: 'color_picker',
        layout,
        entityProps: {},
        flags: {open: true},
        layoutProps: {descriptionType: 'bottom'},
    },
});

export const value = '#ff5733';
