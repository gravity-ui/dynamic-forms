import {JsonSchemaType, NodeType} from '../../core/constants';
import type {
    FieldValue,
    JsonSchema,
    JsonSchemaAny,
    JsonSchemaBoolean,
    JsonSchemaNumber,
    JsonSchemaString,
} from '../../core/types';

export const stringSchema = (
    entity = 'base',
    {nodeParameters, ...schema}: Partial<JsonSchemaString> = {},
): JsonSchemaString => ({
    type: JsonSchemaType.String,
    title: 'Service name',
    examples: ['Enter a value'],
    ...schema,
    nodeParameters: {type: NodeType.String, entity, layout: 'row', ...nodeParameters},
});

export const numberSchema = (
    entity = 'base',
    {nodeParameters, ...schema}: Partial<JsonSchemaNumber> = {},
): JsonSchemaNumber => ({
    type: JsonSchemaType.Number,
    title: 'Capacity',
    ...schema,
    nodeParameters: {type: NodeType.Number, entity, layout: 'row', ...nodeParameters},
});

export const booleanSchema = (
    entity = 'base',
    {nodeParameters, ...schema}: Partial<JsonSchemaBoolean> = {},
): JsonSchemaBoolean => ({
    type: JsonSchemaType.Boolean,
    title: 'Notifications',
    ...schema,
    nodeParameters: {type: NodeType.Boolean, entity, layout: 'row', ...nodeParameters},
});

export const selectSchema = stringSchema('select', {
    title: 'Status',
    enum: ['draft', 'published', 'archived'],
    examples: ['Choose status'],
    nodeParameters: {
        entityProps: {
            enumDescriptions: {draft: 'Draft', published: 'Published', archived: 'Archived'},
            optionsMeta: {published: 'Visible to all users'},
        },
    },
});

export const radioSchema = stringSchema('radio_group', {
    title: 'Access',
    enum: ['private', 'team', 'public'],
    nodeParameters: {
        entityProps: {
            enumDescriptions: {private: 'Private', team: 'Team', public: 'Public'},
            optionsDisabled: {public: true},
        },
    },
});

export const segmentedSchema = stringSchema('segmented_radio_group', {
    title: 'Access',
    enum: ['private', 'team'],
    nodeParameters: {
        entityProps: {enumDescriptions: {private: 'Private', team: 'Team'}},
    },
});

export const numberScaleSchema = numberSchema('number_with_scale', {
    title: 'Distance',
    nodeParameters: {
        entityProps: {
            scale: {m: {title: 'm', factor: 1}, km: {title: 'km', factor: 1000}},
            defaultType: 'm',
            viewType: 'km',
        },
    },
});

export const stringScaleSchema = stringSchema('string_number_with_scale', {
    title: 'Exact distance',
    nodeParameters: {
        entityProps: {
            scale: {m: {title: 'm', factor: '1'}, km: {title: 'km', factor: '1000'}},
            defaultType: 'm',
            viewType: 'km',
        },
    },
});

export const dateSchema: JsonSchemaAny = {
    title: 'Release date',
    nodeParameters: {
        type: NodeType.Any,
        entity: 'date',
        layout: 'row',
        entityProps: {format: 'DD.MM.YYYY', timeZone: 'UTC'},
    },
};

export const INITIAL_DATE = '2024-02-20T00:00:00.000Z';

export interface InputCase {
    name: string;
    schema: JsonSchema;
    value?: FieldValue;
    overviewValue?: FieldValue;
}

export const INPUT_CASES: InputCase[] = [
    {name: 'text', schema: stringSchema(), value: 'Gravity service'},
    {
        name: 'textarea',
        schema: stringSchema('textarea', {
            title: 'Description',
            nodeParameters: {entityProps: {minRows: 3}},
        }),
        value: 'First line\nSecond line\nThird line',
    },
    {name: 'password', schema: stringSchema('password', {title: 'Password'}), value: 'test-secret'},
    {name: 'select', schema: selectSchema, value: 'draft'},
    {name: 'radio group', schema: radioSchema, value: 'private'},
    {name: 'segmented radio group', schema: segmentedSchema, value: 'private'},
    {
        name: 'color picker',
        schema: stringSchema('color_picker', {title: 'Accent color'}),
        value: '#5282ff',
    },
    {
        name: 'file input',
        schema: stringSchema('file_input', {
            title: 'Configuration file',
            nodeParameters: {entityProps: {readAsMethod: 'readAsText'}},
        }),
        overviewValue: 'Example document.txt',
    },
    {name: 'checkbox false', schema: booleanSchema(), value: false},
    {name: 'switch true', schema: booleanSchema('switch'), value: true},
    {name: 'number zero', schema: numberSchema(), value: 0},
    {
        name: 'integer',
        schema: numberSchema('base', {type: JsonSchemaType.Integer, title: 'Replicas'}),
        value: 7,
    },
    {
        name: 'slider',
        schema: numberSchema('slider', {title: 'Volume', minimum: 0, maximum: 100}),
        value: 25,
    },
    {name: 'number with scale', schema: numberScaleSchema, value: 1500},
    {name: 'string number with scale', schema: stringScaleSchema, value: '1500'},
    {name: 'date', schema: dateSchema, value: INITIAL_DATE},
];
