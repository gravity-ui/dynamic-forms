import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchemaObject} from '../../../../core/types';

const settings: Partial<JsonSchemaObject> = {
    properties: {
        from: {type: JsonSchemaType.Number, minimum: 0},
        to: {type: JsonSchemaType.Number, maximum: 100},
    },
    nodeParameters: {
        entityProps: {propertyKeys: ['from', 'to'], step: 5, marks: 3, tooltipDisplay: 'on'},
    },
};

export const schema: JsonSchemaObject = {
    type: JsonSchemaType.Object,
    title: 'RangeSliderInput',
    description: 'Description for RangeSliderInput',
    ...settings,
    nodeParameters: {
        type: NodeType.Object,
        entity: 'range_slider',
        layout: 'row',
        ...settings.nodeParameters,
        flags: {open: true},
    },
};
export const value = {from: 20, to: 70};
