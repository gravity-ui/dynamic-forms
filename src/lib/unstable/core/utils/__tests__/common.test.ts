import {JsonSchemaType} from '../../constants';
import type {JsonSchemaObject} from '../../types';
import {
    arrayPathToDotBracket,
    dotBracketToArrayPath,
    getSchemaByPointer,
    getServiceFieldName,
    getValuePaths,
    pointerToArrayPath,
} from '../common';

describe('pointerToArrayPath', () => {
    test('parses a fragment pointer into path segments', () => {
        expect(pointerToArrayPath('#/properties/name')).toEqual(['properties', 'name']);
    });

    test('parses a document pointer into path segments', () => {
        expect(pointerToArrayPath('/properties/name')).toEqual(['properties', 'name']);
    });

    test('returns an empty array for an empty pointer', () => {
        expect(pointerToArrayPath('#')).toEqual([]);
        expect(pointerToArrayPath('')).toEqual([]);
    });

    test('unescapes JSON Pointer tokens', () => {
        expect(pointerToArrayPath('#/foo~1bar')).toEqual(['foo/bar']);
        expect(pointerToArrayPath('#/foo~0bar')).toEqual(['foo~bar']);
    });

    test('decodes URI-encoded characters', () => {
        expect(pointerToArrayPath('#/foo%20bar')).toEqual(['foo bar']);
    });
});

describe('dotBracketToArrayPath', () => {
    test('parses a dotted path with bracket indices', () => {
        expect(dotBracketToArrayPath('items[0].name')).toEqual(['items', '0', 'name']);
    });

    test('parses nested object keys', () => {
        expect(dotBracketToArrayPath('form.a.b')).toEqual(['form', 'a', 'b']);
    });

    test('parses consecutive bracket indices', () => {
        expect(dotBracketToArrayPath('items[0][1]')).toEqual(['items', '0', '1']);
    });

    test('returns an empty array for an empty path', () => {
        expect(dotBracketToArrayPath('')).toEqual([]);
    });
});

describe('arrayPathToDotBracket', () => {
    test('joins object keys with dots and numeric segments with brackets', () => {
        expect(arrayPathToDotBracket(['items', '0', 'name'])).toBe('items[0].name');
    });

    test('returns an empty string for an empty path', () => {
        expect(arrayPathToDotBracket([])).toBe('');
    });

    test('wraps a leading numeric segment in brackets', () => {
        expect(arrayPathToDotBracket(['0', 'name'])).toBe('[0].name');
    });
});

describe('getSchemaByPointer', () => {
    test('returns a nested schema by a string pointer', () => {
        const nameSchema = {type: JsonSchemaType.String, minLength: 5};
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {name: nameSchema},
        };

        expect(getSchemaByPointer(schema, '#/properties/name')).toBe(nameSchema);
    });

    test('returns a nested schema by path segments', () => {
        const nameSchema = {type: JsonSchemaType.String, minLength: 5};
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {name: nameSchema},
        };

        expect(getSchemaByPointer(schema, ['properties', 'name'])).toBe(nameSchema);
    });

    test('returns the root schema when the pointer is empty', () => {
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {name: {type: JsonSchemaType.String}},
        };

        expect(getSchemaByPointer(schema, '#')).toBe(schema);
        expect(getSchemaByPointer(schema, [])).toBe(schema);
    });

    test('returns undefined when the pointer does not resolve', () => {
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {name: {type: JsonSchemaType.String}},
        };

        expect(getSchemaByPointer(schema, '#/properties/missing')).toBeUndefined();
    });
});

describe('getValuePaths', () => {
    test('returns leaf paths of a nested object', () => {
        expect(getValuePaths({properties: {a: {type: JsonSchemaType.String}}})).toEqual([
            ['properties', 'a', 'type'],
        ]);
    });

    test('returns index paths of an array', () => {
        expect(getValuePaths([1, {type: JsonSchemaType.String}])).toEqual([['0'], ['1', 'type']]);
    });

    test('returns an empty array for a root primitive, empty object, or empty array', () => {
        expect(getValuePaths('x')).toEqual([]);
        expect(getValuePaths({})).toEqual([]);
        expect(getValuePaths([])).toEqual([]);
    });

    test('treats null as a leaf', () => {
        expect(getValuePaths({a: null})).toEqual([['a']]);
    });
});

describe('getServiceFieldName', () => {
    test('joins the service field with a head name', () => {
        expect(getServiceFieldName('SCHEMA_RENDERER_SERVICE_FIELD', 'form')).toBe(
            'SCHEMA_RENDERER_SERVICE_FIELD.form',
        );
    });

    test('returns the service field when the head name is empty', () => {
        expect(getServiceFieldName('SCHEMA_RENDERER_SERVICE_FIELD', '')).toBe(
            'SCHEMA_RENDERER_SERVICE_FIELD',
        );
    });
});
