import {JsonSchemaType} from '../../constants';
import type {
    JsonSchema,
    JsonSchemaArray,
    JsonSchemaNumber,
    JsonSchemaObject,
    JsonSchemaString,
} from '../../types';
import {getSchemaByFinalFormPath, parseFinalFormPath} from '../common';

const nameSchema: JsonSchemaString = {type: JsonSchemaType.String};
const surnameSchema: JsonSchemaString = {type: JsonSchemaType.String};
const hobbySchema: JsonSchemaString = {type: JsonSchemaType.String};
const hobbiesSchema: JsonSchemaArray = {type: JsonSchemaType.Array, items: hobbySchema};
const personalDataSchema: JsonSchemaObject = {
    type: JsonSchemaType.Object,
    properties: {name: nameSchema, surname: surnameSchema, hobbies: hobbiesSchema},
};
const aboutSchema: JsonSchemaString = {type: JsonSchemaType.String};
const friendsSchema: JsonSchemaArray = {
    type: JsonSchemaType.Array,
    items: personalDataSchema,
};
const stringTagSchema: JsonSchemaString = {type: JsonSchemaType.String};
const numberTagSchema: JsonSchemaNumber = {type: JsonSchemaType.Number};
const tagsSchema: JsonSchemaArray = {
    type: JsonSchemaType.Array,
    items: [stringTagSchema, numberTagSchema],
};
const labelSchema: JsonSchemaString = {type: JsonSchemaType.String};
const labelsSchema: JsonSchemaArray = {type: JsonSchemaType.Array, items: labelSchema};

const mainSchema: JsonSchemaObject = {
    type: JsonSchemaType.Object,
    properties: {
        personalData: personalDataSchema,
        about: aboutSchema,
        friends: friendsSchema,
        tags: tagsSchema,
        labels: labelsSchema,
    },
};

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
            const headPath = '';
            const path = '';

            const result = getSchemaByFinalFormPath(path, headPath, mainSchema);

            expect(result).toBe(mainSchema);
        });

        it('should navigate through object properties', () => {
            const headPath = '';
            const path = 'personalData.name';

            const result = getSchemaByFinalFormPath(path, headPath, mainSchema);

            expect(result).toBe(nameSchema);
        });

        it('should navigate through array items (when items is a single schema)', () => {
            const headPath = '';
            const path = 'labels[0]';

            const result = getSchemaByFinalFormPath(path, headPath, mainSchema);

            expect(result).toBe(labelSchema);
        });

        it('should navigate through array items (when items is an array of schemas)', () => {
            const headPath = '';
            const path = 'tags[1]';

            const result = getSchemaByFinalFormPath(path, headPath, mainSchema);

            expect(result).toBe(numberTagSchema);
        });

        it('should handle complex nested paths', () => {
            const headPath = '';
            const path = 'friends[0].hobbies[0]';

            const result = getSchemaByFinalFormPath(path, headPath, mainSchema);

            expect(result).toBe(hobbySchema);
        });

        it('should handle finalFormHeadPath correctly', () => {
            const headPath = 'headPath';
            const path = `${headPath}.personalData.name`;

            const result = getSchemaByFinalFormPath(path, headPath, mainSchema);

            expect(result).toBe(nameSchema);
        });

        it('should return undefined for invalid path', () => {
            const headPath = 'foo';
            const path = 'personalData.name';

            const result = getSchemaByFinalFormPath(path, headPath, mainSchema);

            expect(result).toBeUndefined();
        });

        it('should handle array path with string schema', () => {
            const headPath = '';
            const path = 'personalData[0]';

            const result = getSchemaByFinalFormPath(path, headPath, mainSchema);

            expect(result).toBeUndefined();
        });

        it('should accept path as array of segments', () => {
            const headPath = '';
            const path = ['personalData', 'name'];

            const result = getSchemaByFinalFormPath(path, headPath, mainSchema);

            expect(result).toBe(nameSchema);
        });

        it('should handle undefined schema gracefully', () => {
            const headPath = '';
            const path = 'personalData.name';

            const result = getSchemaByFinalFormPath(
                path,
                headPath,
                undefined as unknown as JsonSchema,
            );

            expect(result).toBeUndefined();
        });

        it('should handle schema without type gracefully', () => {
            const headPath = '';
            const path = 'personalData.name';
            const invalidSchema = {} as JsonSchema;

            const result = getSchemaByFinalFormPath(path, headPath, invalidSchema);

            expect(result).toBeUndefined();
        });
    });
});
