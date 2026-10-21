import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchemaString} from '../../../../core/types';

export const createSchema = (layout: string | undefined): JsonSchemaString => ({
    type: JsonSchemaType.String,
    title: 'Label',
    description: 'Description for Label',

    nodeParameters: {
        type: NodeType.String,
        entity: 'label',
        layout,
        entityProps: {theme: 'success', iconName: 'Check', title: 'Build status'},
        flags: {open: true},
        layoutProps: {descriptionType: 'bottom'},
    },
});

export const value = 'Ready';
