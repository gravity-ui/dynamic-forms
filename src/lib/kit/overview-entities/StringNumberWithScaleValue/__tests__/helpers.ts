import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchemaString} from '../../../../core/types';

export const createSchema = (layout: string | undefined): JsonSchemaString => ({
    type: JsonSchemaType.String,
    title: 'StringNumberWithScaleValue',
    description: 'Description for StringNumberWithScaleValue',
    stringNumber: {type: JsonSchemaType.Number},
    nodeParameters: {
        type: NodeType.String,
        entity: 'string_number_with_scale',
        layout,
        entityProps: {scale: {m: {title: 'm', factor: '1'}, km: {title: 'km', factor: '1000'}}},
        flags: {open: true},
        layoutProps: {descriptionType: 'bottom'},
    },
});

export const value = '1500';
