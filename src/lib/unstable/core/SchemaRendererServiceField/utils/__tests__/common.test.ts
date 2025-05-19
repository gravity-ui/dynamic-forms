import {JsonSchemaType} from '../../../constants';
import type {
    JsonSchemaArray,
    JsonSchemaNumber,
    JsonSchemaObject,
    JsonSchemaString,
} from '../../../types';
import {
    getSchemaByInstancePath,
    getSchemaBySchemaPath,
    getValuePaths,
    parseInstancePath,
    parseSchemaPath,
} from '../common';

const nameSchema: JsonSchemaString = {type: JsonSchemaType.String};
const streetSchema: JsonSchemaString = {type: JsonSchemaType.String};
const citySchema: JsonSchemaString = {type: JsonSchemaType.String};
const addressSchema: JsonSchemaObject = {
    type: JsonSchemaType.Object,
    properties: {street: streetSchema, city: citySchema},
};
const stringTagSchema: JsonSchemaString = {type: JsonSchemaType.String};
const numberTagSchema: JsonSchemaNumber = {type: JsonSchemaType.Number};
const tagsSchema: JsonSchemaArray = {
    type: JsonSchemaType.Array,
    items: [stringTagSchema, numberTagSchema],
};
const labelSchema: JsonSchemaString = {type: JsonSchemaType.String};
const labelsSchema: JsonSchemaArray = {type: JsonSchemaType.Array, items: labelSchema};
const specialFieldSchema: JsonSchemaNumber = {type: JsonSchemaType.Number};
const mainSchema: JsonSchemaObject = {
    type: JsonSchemaType.Object,
    properties: {
        name: nameSchema,
        address: addressSchema,
        tags: tagsSchema,
        labels: labelsSchema,
        'special/field': specialFieldSchema,
    },
};

describe('SchemaRendererServiceField/utils/common', () => {
    describe('parseSchemaPath', () => {
        it('should parse a simple schema path', () => {
            const result = parseSchemaPath('#/properties/name/minLength');

            expect(result).toEqual(['properties', 'name']);
        });

        it('should parse a nested schema path', () => {
            const result = parseSchemaPath('#/properties/address/properties/street/maxLength');

            expect(result).toEqual(['properties', 'address', 'properties', 'street']);
        });

        it('should handle URL encoded characters', () => {
            const result = parseSchemaPath('#/properties/special%20field/minimum');

            expect(result).toEqual(['properties', 'special field']);
        });

        it('should handle schema path with only one segment', () => {
            const result = parseSchemaPath('#/type');

            expect(result).toEqual([]);
        });

        it('should handle path with tilde escaping for slash', () => {
            const result = parseSchemaPath('#/properties/path~1to~1file/maximum');

            expect(result).toEqual(['properties', 'path/to/file']);
        });

        it('should handle path with tilde escaping for tilde', () => {
            const result = parseSchemaPath('#/properties/tilde~0character/not');

            expect(result).toEqual(['properties', 'tilde~character']);
        });

        it('should handle complex paths with multiple escaped characters', () => {
            const result = parseSchemaPath(
                '#/properties/complex~1path~0with~1special%20chars/const',
            );

            expect(result).toEqual(['properties', 'complex/path~with/special chars']);
        });

        it('should handle paths with array indexes', () => {
            const result = parseSchemaPath('#/properties/items/0/name/minLength');

            expect(result).toEqual(['properties', 'items', '0', 'name']);
        });

        it('should return an empty array for invalid schema path format', () => {
            const result = parseSchemaPath('invalid-path');

            expect(result).toEqual([]);
        });
    });

    describe('parseInstancePath', () => {
        it('should return an empty array for empty instance path', () => {
            const result = parseInstancePath('');

            expect(result).toEqual([]);
        });

        it('should parse a simple instance path', () => {
            const result = parseInstancePath('/name');

            expect(result).toEqual(['name']);
        });

        it('should parse a nested instance path', () => {
            const result = parseInstancePath('/address/street');

            expect(result).toEqual(['address', 'street']);
        });

        it('should handle path with tilde escaping for slash', () => {
            const result = parseInstancePath('/path~1to~1file');

            expect(result).toEqual(['path/to/file']);
        });

        it('should handle path with tilde escaping for tilde', () => {
            const result = parseInstancePath('/tilde~0character');

            expect(result).toEqual(['tilde~character']);
        });

        it('should handle complex paths with multiple escaped characters', () => {
            const result = parseInstancePath('/complex~1path~0with~1special');

            expect(result).toEqual(['complex/path~with/special']);
        });

        it('should handle paths with array indexes', () => {
            const result = parseInstancePath('/items/0/name');

            expect(result).toEqual(['items', '0', 'name']);
        });

        it('should handle deep nested paths', () => {
            const result = parseInstancePath('/users/5/addresses/2/street');

            expect(result).toEqual(['users', '5', 'addresses', '2', 'street']);
        });

        it('should handle paths with consecutive slashes', () => {
            const result = parseInstancePath('/path//with//double/slashes');

            expect(result).toEqual(['path', '', 'with', '', 'double', 'slashes']);
        });
    });

    describe('getSchemaBySchemaPath', () => {
        it('should return the main schema for empty path array', () => {
            const result = getSchemaBySchemaPath('#/', mainSchema);

            expect(result).toBe(mainSchema);
        });

        it('should return the schema for a simple path', () => {
            const result = getSchemaBySchemaPath('#/properties/name/minLength', mainSchema);

            expect(result).toBe(nameSchema);
        });

        it('should return the schema for a nested path', () => {
            const result = getSchemaBySchemaPath(
                '#/properties/address/properties/street/minLength',
                mainSchema,
            );

            expect(result).toBe(streetSchema);
        });

        it('should return the schema for a path with array indexes', () => {
            const result = getSchemaBySchemaPath('#/properties/tags/items/1/maximum', mainSchema);

            expect(result).toBe(numberTagSchema);
        });

        it('should handle array with single schema for items', () => {
            const result = getSchemaBySchemaPath('#/properties/labels/items/minLength', mainSchema);

            expect(result).toBe(labelSchema);
        });

        it('should return undefined for a path that does not exist', () => {
            const result = getSchemaBySchemaPath('#/properties/nonexistent/minLength', mainSchema);

            expect(result).toBeUndefined();
        });

        it('should handle paths with special characters', () => {
            const result = getSchemaBySchemaPath(
                '#/properties/special~1field/maxLength',
                mainSchema,
            );

            expect(result).toBe(specialFieldSchema);
        });
    });

    describe('getSchemaByInstancePath', () => {
        it('should return the main schema for empty instance path', () => {
            const result = getSchemaByInstancePath('', mainSchema);

            expect(result).toBe(mainSchema);
        });

        it('should return the schema for a simple object property path', () => {
            const result = getSchemaByInstancePath('/name', mainSchema);

            expect(result).toBe(nameSchema);
        });

        it('should return the schema for a nested object property path', () => {
            const result = getSchemaByInstancePath('/address/street', mainSchema);

            expect(result).toBe(streetSchema);
        });

        it('should return the schema for an array item path with specific index', () => {
            const result = getSchemaByInstancePath('/tags/1', mainSchema);

            expect(result).toBe(numberTagSchema);
        });

        it('should handle array with single schema for items', () => {
            const result = getSchemaByInstancePath('/labels/0', mainSchema);

            expect(result).toBe(labelSchema);
        });

        it('should return undefined for a path that does not exist', () => {
            const result = getSchemaByInstancePath('/nonexistent', mainSchema);

            expect(result).toBeUndefined();
        });

        it('should handle paths with special characters', () => {
            const result = getSchemaByInstancePath('/special~1field', mainSchema);

            expect(result).toBe(specialFieldSchema);
        });

        it('should return undefined for a path that starts valid but ends invalid', () => {
            const result = getSchemaByInstancePath('/address/nonexistent', mainSchema);

            expect(result).toBeUndefined();
        });

        it('should return undefined when traversing non-object and non-array schemas', () => {
            const result = getSchemaByInstancePath('/name/invalid', mainSchema);

            expect(result).toBeUndefined();
        });
    });

    describe('getValuePaths', () => {
        it('should return a path for a primitive value', () => {
            const result = getValuePaths('test');

            expect(result).toEqual([]);
        });

        it('should return a path for a number value', () => {
            const result = getValuePaths(42);

            expect(result).toEqual([]);
        });

        it('should return a path for a boolean value', () => {
            const result = getValuePaths(true);

            expect(result).toEqual([]);
        });

        it('should return a path for null', () => {
            const result = getValuePaths(null);

            expect(result).toEqual([]);
        });

        it('should return a path for undefined', () => {
            const result = getValuePaths(undefined);

            expect(result).toEqual([]);
        });

        it('should return an empty array for an empty array', () => {
            const result = getValuePaths([]);

            expect(result).toEqual([]);
        });

        it('should return an empty array for an empty object', () => {
            const result = getValuePaths({});

            expect(result).toEqual([]);
        });

        it('should return paths for an array of primitive values', () => {
            const result = getValuePaths(['a', 'b', 'c']);

            expect(result).toEqual([['0'], ['1'], ['2']]);
        });

        it('should return paths for an object with primitive values', () => {
            const result = getValuePaths({a: 1, b: 2, c: 3});

            expect(result).toEqual([['a'], ['b'], ['c']]);
        });

        it('should return paths for a nested array', () => {
            const result = getValuePaths([
                ['a', 'b'],
                ['c', 'd'],
            ]);

            expect(result).toEqual([
                ['0', '0'],
                ['0', '1'],
                ['1', '0'],
                ['1', '1'],
            ]);
        });

        it('should return paths for a nested object', () => {
            const result = getValuePaths({a: {b: 1}, c: {d: 2}});

            expect(result).toEqual([
                ['a', 'b'],
                ['c', 'd'],
            ]);
        });

        it('should return paths for a mixed nested array and object', () => {
            const result = getValuePaths([{a: 1}, {b: 2}]);

            expect(result).toEqual([
                ['0', 'a'],
                ['1', 'b'],
            ]);
        });

        it('should return paths for a complex nested structure', () => {
            const result = getValuePaths({
                a: [1, 2],
                b: {c: 3, d: [4, {e: 5}]},
            });

            expect(result).toEqual([
                ['a', '0'],
                ['a', '1'],
                ['b', 'c'],
                ['b', 'd', '0'],
                ['b', 'd', '1', 'e'],
            ]);
        });

        it('should handle initial path parameter', () => {
            const result = getValuePaths(
                {
                    a: [1, 2],
                    b: {c: 3, d: [4, {e: 5}]},
                },
                ['parent'],
            );

            expect(result).toEqual([
                ['parent', 'a', '0'],
                ['parent', 'a', '1'],
                ['parent', 'b', 'c'],
                ['parent', 'b', 'd', '0'],
                ['parent', 'b', 'd', '1', 'e'],
            ]);
        });
    });
});
