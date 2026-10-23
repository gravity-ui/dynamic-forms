import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchemaNumber, JsonSchemaObject} from '../../../../core/types';

export const fromSchema: JsonSchemaNumber = {
    type: JsonSchemaType.Number,
    minimum: 0,
    nodeParameters: {type: NodeType.Number, entity: 'base', layout: 'cell'},
};

export const toSchema: JsonSchemaNumber = {
    type: JsonSchemaType.Number,
    maximum: 100,
    nodeParameters: {type: NodeType.Number, entity: 'base', layout: 'cell'},
};

const settings: Partial<JsonSchemaObject> = {
    properties: {
        from: fromSchema,
        to: toSchema,
    },
    nodeParameters: {entityProps: {propertyKeys: ['from', 'to'], separator: 'to'}},
};

export const schema: JsonSchemaObject = {
    type: JsonSchemaType.Object,
    title: 'RangeInput',
    description: 'Description for RangeInput',
    ...settings,
    nodeParameters: {
        type: NodeType.Object,
        entity: 'range_input',
        layout: 'row',
        ...settings.nodeParameters,
        flags: {open: true},
    },
};
export const value = {from: 20, to: 70};
