import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchemaString} from '../../../../core/types';

const settings: Partial<JsonSchemaString> = {
    stringNumber: {
        type: JsonSchemaType.Number,
        minimum: '0',
        maximum: '10000',
        multipleOf: '0.001',
    },
    nodeParameters: {
        entityProps: {
            scale: {m: {title: 'm', factor: '1'}, km: {title: 'km', factor: '1000'}},
            defaultType: 'm',
            viewType: 'km',
        },
    },
};

export const schema: JsonSchemaString = {
    type: JsonSchemaType.String,
    title: 'StringNumberWithScaleInput',
    description: 'Description for StringNumberWithScaleInput',
    ...settings,
    nodeParameters: {
        type: NodeType.String,
        entity: 'string_number_with_scale',
        layout: 'row',
        ...settings.nodeParameters,
        flags: {open: true},
    },
};
export const value = '1500';
