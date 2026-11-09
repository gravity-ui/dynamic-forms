import {NodeType} from '../../../../core/constants';
import type {JsonSchemaAny} from '../../../../core/types';

const settings: Partial<JsonSchemaAny> = {
    nodeParameters: {
        entityProps: {
            format: 'DD.MM.YYYY',
            timeZone: 'UTC',
            hasClear: true,
        },
    },
};

export const schema: JsonSchemaAny = {
    title: 'DateInput',
    description: 'Description for DateInput',
    ...settings,
    nodeParameters: {
        type: NodeType.Any,
        entity: 'date',
        layout: 'row',
        ...settings.nodeParameters,
        flags: {open: true},
    },
};
export const value = '2024-02-20T00:00:00.000Z';
