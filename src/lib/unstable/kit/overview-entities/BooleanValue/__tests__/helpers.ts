import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchemaBoolean} from '../../../../core/types';

export const createSchema = (layout: string | undefined): JsonSchemaBoolean => ({
    type: JsonSchemaType.Boolean,
    title: 'BooleanValue',
    description: 'Description for BooleanValue',

    nodeParameters: {
        type: NodeType.Boolean,
        entity: 'base',
        layout,
        entityProps: {
            valueDescriptions: {true: 'Enabled', false: 'Disabled'},
            viewColor: {true: 'positive', false: 'danger'},
        },
        flags: {open: true},
        layoutProps: {descriptionType: 'bottom'},
    },
});

export const value = true;
