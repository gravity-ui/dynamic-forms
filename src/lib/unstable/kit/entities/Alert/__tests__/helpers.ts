import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchemaString} from '../../../../core/types';

export const createSchema = (layout: string | undefined): JsonSchemaString => ({
    type: JsonSchemaType.String,
    title: 'Alert',
    description: 'Description for Alert',

    nodeParameters: {
        type: NodeType.String,
        entity: 'alert',
        layout,
        entityProps: {
            theme: 'info',
            iconName: 'CircleInfo',
            title: 'Notice',
            message: '<strong>Review</strong> the settings before saving.',
        },
        flags: {open: true},
        layoutProps: {descriptionType: 'bottom'},
    },
});

export const value = undefined;
