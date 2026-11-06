import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchemaObject} from '../../../../core/types';

export const createSchema = (layout: string | undefined): JsonSchemaObject => ({
    type: JsonSchemaType.Object,
    title: 'RangeValue',
    description: 'Description for RangeValue',
    properties: {from: {type: JsonSchemaType.Number}, to: {type: JsonSchemaType.Number}},
    nodeParameters: {
        type: NodeType.Object,
        entity: 'range_input',
        layout,
        entityProps: {propertyKeys: ['from', 'to'], separator: 'to'},
        flags: {open: true},
        layoutProps: {descriptionType: 'bottom'},
    },
});

export const value = {from: 20, to: 80};
