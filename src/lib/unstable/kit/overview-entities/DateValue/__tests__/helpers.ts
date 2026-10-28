import {NodeType} from '../../../../core/constants';
import type {JsonSchemaAny} from '../../../../core/types';

export const createSchema = (layout: string | undefined): JsonSchemaAny => ({
    title: 'DateValue',
    description: 'Description for DateValue',

    nodeParameters: {
        type: NodeType.Any,
        entity: 'date',
        layout,
        entityProps: {format: 'YYYY-MM-DD HH:mm', timeZone: 'UTC'},
        flags: {open: true},
        layoutProps: {descriptionType: 'bottom'},
    },
});

export const value = '2020-01-02T03:04:00Z';
