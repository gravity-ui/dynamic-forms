import {createForm} from 'final-form';

import {
    JsonSchemaType,
    SCHEMA_RENDERER_SERVICE_FIELD,
    type SchemaRendererState,
    getServiceFieldName,
} from '../../../core';
import {
    getArrayItemIndex,
    getArrayItemParentName,
    getBooleanValidationState,
    getValidationState,
    isArrayItem,
    isStringFloat,
    isStringInt,
    isStringNumber,
    isTupleItem,
} from '../common';

describe('getValidationState', () => {
    test('returns invalid when the field is touched and has an error', () => {
        expect(getValidationState({touched: true, error: 'error'} as any)).toBe('invalid');
    });

    test('returns invalid when submit failed and the field has an error', () => {
        expect(getValidationState({submitFailed: true, error: 'error'} as any)).toBe('invalid');
    });

    test('returns undefined when the field is not touched and submit did not fail', () => {
        expect(getValidationState({error: 'error'} as any)).toBeUndefined();
    });

    test('returns undefined when there is no error', () => {
        expect(getValidationState({touched: true} as any)).toBeUndefined();
    });
});

describe('getBooleanValidationState', () => {
    test('returns true when the field is invalid', () => {
        expect(getBooleanValidationState({touched: true, error: 'error'} as any)).toBe(true);
    });

    test('returns false when the field is valid', () => {
        expect(getBooleanValidationState({touched: true} as any)).toBe(false);
    });
});

describe('getArrayItemParentName', () => {
    test('returns the parent name of an array item', () => {
        expect(getArrayItemParentName('form.items[0]')).toBe('form.items');
    });

    test('returns the inner array name for a nested index', () => {
        expect(getArrayItemParentName('form.items[0][1]')).toBe('form.items[0]');
    });
});

describe('getArrayItemIndex', () => {
    test('returns the last bracket index', () => {
        expect(getArrayItemIndex('form.items[0]')).toBe('0');
        expect(getArrayItemIndex('form.items[0][1]')).toBe('1');
    });
});

describe('isArrayItem', () => {
    test('returns true when the name ends with a bracket index', () => {
        expect(isArrayItem('form.items[0]')).toBe(true);
    });

    test('returns false when the name is not an array item', () => {
        expect(isArrayItem('form.items')).toBe(false);
    });
});

describe('isTupleItem', () => {
    test('returns false when the name is not an array item', () => {
        const form = createForm<any>({onSubmit: () => {}});

        expect(isTupleItem('form.items', 'form', form)).toBe(false);
    });

    test('returns true when the parent schema items is a tuple', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const state = {
            schema: {
                type: JsonSchemaType.Object,
                properties: {
                    items: {
                        type: JsonSchemaType.Array,
                        items: [{type: JsonSchemaType.String}, {type: JsonSchemaType.Number}],
                    },
                },
            },
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );
        form.registerField(
            'form.items',
            () => {},
            {},
            {data: {state: {schemaPath: '#/properties/items'}}},
        );

        expect(isTupleItem('form.items[0]', 'form', form)).toBe(true);
    });

    test('returns false when the parent schema items is not a tuple', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const state = {
            schema: {
                type: JsonSchemaType.Object,
                properties: {
                    items: {
                        type: JsonSchemaType.Array,
                        items: {type: JsonSchemaType.String},
                    },
                },
            },
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );
        form.registerField(
            'form.items',
            () => {},
            {},
            {data: {state: {schemaPath: '#/properties/items'}}},
        );

        expect(isTupleItem('form.items[0]', 'form', form)).toBe(false);
    });
});

describe('isStringInt', () => {
    test('accepts integer strings', () => {
        expect(isStringInt('0')).toBe(true);
        expect(isStringInt('-12')).toBe(true);
        expect(isStringInt(42)).toBe(true);
    });

    test('rejects non-integers and leading zeros', () => {
        expect(isStringInt('01')).toBe(false);
        expect(isStringInt('1.5')).toBe(false);
        expect(isStringInt('')).toBe(false);
    });
});

describe('isStringFloat', () => {
    test('accepts integer and decimal strings', () => {
        expect(isStringFloat('0')).toBe(true);
        expect(isStringFloat('8')).toBe(true);
        expect(isStringFloat('1.5')).toBe(true);
        expect(isStringFloat('-0.25')).toBe(true);
    });

    test('rejects invalid numeric strings', () => {
        expect(isStringFloat('.5')).toBe(false);
        expect(isStringFloat('1.')).toBe(false);
        expect(isStringFloat('01.2')).toBe(false);
    });
});

describe('isStringNumber', () => {
    test('accepts integer and decimal strings', () => {
        expect(isStringNumber('12')).toBe(true);
        expect(isStringNumber('1.5')).toBe(true);
    });

    test('rejects non-numeric strings', () => {
        expect(isStringNumber('abc')).toBe(false);
    });
});
