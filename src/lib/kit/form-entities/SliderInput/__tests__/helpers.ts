import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchemaNumber} from '../../../../core/types';

const settings: Partial<JsonSchemaNumber> = {
    minimum: 0,
    maximum: 100,
    nodeParameters: {entityProps: {step: 5, marks: 3, tooltipDisplay: 'on'}},
};

export const schema: JsonSchemaNumber = {
    type: JsonSchemaType.Number,
    title: 'SliderInput',
    description: 'Description for SliderInput',
    ...settings,
    nodeParameters: {
        type: NodeType.Number,
        entity: 'slider',
        layout: 'row',
        ...settings.nodeParameters,
        flags: {open: true},
    },
};
export const value = 25;
