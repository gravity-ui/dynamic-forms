import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchemaNumber} from '../../../../core/types';

const settings: Partial<JsonSchemaNumber> = {
    minimum: 0,
    maximum: 100,
    multipleOf: 0.5,
    examples: [10],
    nodeParameters: {entityProps: {hasClear: true}},
};

export const schema: JsonSchemaNumber = {
    type: JsonSchemaType.Number,
    title: 'NumberInput',
    description: 'Description for NumberInput',
    ...settings,
    nodeParameters: {
        type: NodeType.Number,
        entity: 'base',
        layout: 'row',
        ...settings.nodeParameters,
        flags: {open: true},
    },
};
export const value = 12.5;
