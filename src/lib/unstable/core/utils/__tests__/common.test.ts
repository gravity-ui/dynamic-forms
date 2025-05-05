import {
    createMockArraySchema,
    createMockBooleanSchema,
    createMockNumberSchema,
    createMockObjectSchema,
    createMockStringSchema,
} from '../../../__tests__/helpers.test';
import type {JsonSchema} from '../../types';
import {getSchemaByFinalFormPath, parseFinalFormPath} from '../common';

describe('core/utils/common', () => {
    describe('parseFinalFormPath', () => {
        it('should parse a simple path', () => {
            const result = parseFinalFormPath('foo.bar');

            expect(result).toEqual(['foo', 'bar']);
        });

        it('should parse a path with array indixes', () => {
            const result = parseFinalFormPath('foo[0].bar');

            expect(result).toEqual(['foo', '0', 'bar']);
        });

        it('should parse a path with multiple array indixes', () => {
            const result = parseFinalFormPath('foo[0].bar[1].baz');

            expect(result).toEqual(['foo', '0', 'bar', '1', 'baz']);
        });

        it('should parse a path with only array indixes', () => {
            const result = parseFinalFormPath('[0][1][2]');

            expect(result).toEqual(['0', '1', '2']);
        });

        it('should handle empty path', () => {
            const result = parseFinalFormPath('');

            expect(result).toEqual([]);
        });

        it('should handle path with special characters', () => {
            const result = parseFinalFormPath('foo-bar.baz_qux');

            expect(result).toEqual(['foo-bar', 'baz_qux']);
        });
    });

    describe('getSchemaByFinalFormPath', () => {
        it('should return the main schema when path is empty', () => {
            const mainSchema = createMockObjectSchema({foo: createMockStringSchema()});
            const path = '';
            const headPath = '';

            const result = getSchemaByFinalFormPath(path, headPath, mainSchema);

            expect(result).toBe(mainSchema);
        });

        it('should navigate through object properties', () => {
            const stringSchema = createMockStringSchema();
            const objectSchema = createMockObjectSchema({bar: stringSchema});
            const mainSchema = createMockObjectSchema({foo: objectSchema});
            const path = 'foo.bar';
            const headPath = '';

            const result = getSchemaByFinalFormPath(path, headPath, mainSchema);

            expect(result).toBe(stringSchema);
        });

        it('should navigate through array items (when items is a single schema)', () => {
            const stringSchema = createMockStringSchema();
            const arraySchema = createMockArraySchema(stringSchema);
            const mainSchema = createMockObjectSchema({foo: arraySchema});
            const path = 'foo[0]';
            const headPath = '';

            const result = getSchemaByFinalFormPath(path, headPath, mainSchema);

            expect(result).toBe(stringSchema);
        });

        it('should navigate through array items (when items is an array of schemas)', () => {
            const stringSchema = createMockStringSchema();
            const numberSchema = createMockNumberSchema();
            const booleanSchema = createMockBooleanSchema();
            const arraySchema = createMockArraySchema([stringSchema, numberSchema, booleanSchema]);
            const mainSchema = createMockObjectSchema({foo: arraySchema});
            const path = 'foo[1]';
            const headPath = '';

            const result = getSchemaByFinalFormPath(path, headPath, mainSchema);

            expect(result).toBe(numberSchema);
        });

        it('should handle complex nested paths', () => {
            const booleanSchema = createMockBooleanSchema();
            const objectSchema = createMockObjectSchema({qux: booleanSchema});
            const arraySchema = createMockArraySchema(objectSchema);
            const objectSchema2 = createMockObjectSchema({baz: arraySchema});
            const arraySchema2 = createMockArraySchema(objectSchema2);
            const mainSchema = createMockObjectSchema({foo: arraySchema2});
            const path = 'foo[0].baz[0].qux';
            const headPath = '';

            const result = getSchemaByFinalFormPath(path, headPath, mainSchema);

            expect(result).toBe(booleanSchema);
        });

        it('should handle finalFormHeadPath correctly', () => {
            const stringSchema = createMockStringSchema();
            const objectSchema = createMockObjectSchema({bar: stringSchema});
            const mainSchema = createMockObjectSchema({foo: objectSchema});
            const path = 'baz.foo.bar';
            const headPath = 'baz';

            const result = getSchemaByFinalFormPath(path, headPath, mainSchema);

            expect(result).toBe(stringSchema);
        });

        it('should return undefined for invalid path', () => {
            const stringSchema = createMockStringSchema();
            const mainSchema = createMockObjectSchema({foo: stringSchema});
            const path = 'bar.baz';
            const headPath = 'foo';

            const result = getSchemaByFinalFormPath(path, headPath, mainSchema);

            expect(result).toBeUndefined();
        });

        it('should handle array path with string schema', () => {
            const stringSchema = createMockStringSchema();
            const mainSchema = createMockObjectSchema({foo: stringSchema});
            const path = 'foo[0]';
            const headPath = '';

            const result = getSchemaByFinalFormPath(path, headPath, mainSchema);

            expect(result).toBeUndefined();
        });

        it('should accept path as array of segments', () => {
            const stringSchema = createMockStringSchema();
            const objectSchema = createMockObjectSchema({bar: stringSchema});
            const mainSchema = createMockObjectSchema({foo: objectSchema});
            const path = ['foo', 'bar'];
            const headPath = '';

            const result = getSchemaByFinalFormPath(path, headPath, mainSchema);

            expect(result).toBe(stringSchema);
        });

        it('should handle undefined schema gracefully', () => {
            const path = 'foo.bar';
            const headPath = '';

            const result = getSchemaByFinalFormPath(
                path,
                headPath,
                undefined as unknown as JsonSchema,
            );

            expect(result).toBeUndefined();
        });

        it('should handle schema without type gracefully', () => {
            const invalidSchema = {} as JsonSchema;

            const result = getSchemaByFinalFormPath('foo', '', invalidSchema);

            expect(result).toBeUndefined();
        });
    });
});
