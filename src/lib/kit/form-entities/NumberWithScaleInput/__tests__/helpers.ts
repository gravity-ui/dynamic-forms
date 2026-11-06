import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchemaNumber} from '../../../../core/types';

const settings: Partial<JsonSchemaNumber> = {
    minimum: 0,
    maximum: 10000,
    multipleOf: 100,
    nodeParameters: {
        entityProps: {
            scale: {m: {title: 'm', factor: 1}, km: {title: 'km', factor: 1000}},
            defaultType: 'm',
            viewType: 'km',
        },
    },
};

export const schema: JsonSchemaNumber = {
    type: JsonSchemaType.Number,
    title: 'NumberWithScaleInput',
    description: 'Description for NumberWithScaleInput',
    ...settings,
    nodeParameters: {
        type: NodeType.Number,
        entity: 'number_with_scale',
        layout: 'row',
        ...settings.nodeParameters,
        flags: {open: true},
    },
};
export const value = 1500;
