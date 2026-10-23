import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchemaNumber} from '../../../../core/types';

export const createSchema = (layout: string | undefined): JsonSchemaNumber => ({
    type: JsonSchemaType.Number,
    title: 'NumberWithScaleValue',
    description: 'Description for NumberWithScaleValue',

    nodeParameters: {
        type: NodeType.Number,
        entity: 'number_with_scale',
        layout,
        entityProps: {scale: {m: {title: 'm', factor: 1}, km: {title: 'km', factor: 1000}}},
        flags: {open: true},
        layoutProps: {descriptionType: 'bottom'},
    },
});

export const value = 1500;
