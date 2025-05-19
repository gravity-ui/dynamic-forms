import {ARRAY_AND_OBJECT_ERRORS, JsonSchemaType} from '../../../constants';
import type {ValidateErrorItem} from '../../types';
import {processErrorItems} from '../process-error-items';

describe('processErrorItems', () => {
    const headName = 'headName';
    const fieldName1 = 'fieldName1';
    const fieldName2 = 'fieldName2';
    const fieldName3 = 'fieldName3';
    const fieldName4 = 'fieldName4';

    it('should return an object with ARRAY_AND_OBJECT_ERRORS property', () => {
        const result = processErrorItems({
            errorItems: [],
            headName,
            mainSchema: {type: JsonSchemaType.Object},
        });

        expect(result).toEqual({[ARRAY_AND_OBJECT_ERRORS]: {}});
    });

    it('should skip error items with falsy error property', () => {
        const errorItems: ValidateErrorItem[] = [
            {error: undefined, path: [headName, fieldName1]},
            {error: false, path: [headName, fieldName2]},
        ];

        const result = processErrorItems({
            errorItems,
            headName,
            mainSchema: {
                type: JsonSchemaType.Object,
                properties: {
                    [fieldName1]: {type: JsonSchemaType.String},
                    [fieldName2]: {type: JsonSchemaType.String},
                },
            },
        });

        expect(result).toEqual({[ARRAY_AND_OBJECT_ERRORS]: {}});
    });

    it('should handle boolean error values for non-array/object schemas', () => {
        const error = true;
        const errorItems: ValidateErrorItem[] = [{error, path: [headName, fieldName1]}];

        const result = processErrorItems({
            errorItems,
            headName,
            mainSchema: {
                type: JsonSchemaType.Object,
                properties: {
                    [fieldName1]: {type: JsonSchemaType.String},
                },
            },
        });

        expect(result).toEqual({[ARRAY_AND_OBJECT_ERRORS]: {}, [headName]: {[fieldName1]: error}});
    });

    it('should handle string error values for non-array/object schemas', () => {
        const error = 'error message';
        const errorItems: ValidateErrorItem[] = [{error, path: [headName, fieldName1]}];

        const result = processErrorItems({
            errorItems,
            headName,
            mainSchema: {
                type: JsonSchemaType.Object,
                properties: {
                    [fieldName1]: {type: JsonSchemaType.String},
                },
            },
        });

        expect(result).toEqual({[ARRAY_AND_OBJECT_ERRORS]: {}, [headName]: {[fieldName1]: error}});
    });

    it('should handle undefined error values for non-array/object schemas', () => {
        const errorItems: ValidateErrorItem[] = [{error: undefined, path: [headName, fieldName1]}];

        const result = processErrorItems({
            errorItems,
            headName,
            mainSchema: {
                type: JsonSchemaType.Object,
                properties: {
                    [fieldName1]: {type: JsonSchemaType.String},
                },
            },
        });

        expect(result).toEqual({[ARRAY_AND_OBJECT_ERRORS]: {}});
    });

    it('should handle array schema types by adding to ARRAY_AND_OBJECT_ERRORS', () => {
        const error = 'array error';
        const errorItems: ValidateErrorItem[] = [{error, path: [headName, fieldName1]}];

        const result = processErrorItems({
            errorItems,
            headName,
            mainSchema: {
                type: JsonSchemaType.Object,
                properties: {
                    [fieldName1]: {type: JsonSchemaType.Array},
                },
            },
        });

        expect(result).toEqual({[ARRAY_AND_OBJECT_ERRORS]: {[`${headName}.${fieldName1}`]: error}});
    });

    it('should handle object schema types by adding to ARRAY_AND_OBJECT_ERRORS', () => {
        const error = 'object error';
        const errorItems: ValidateErrorItem[] = [{error, path: [headName, fieldName1]}];

        const result = processErrorItems({
            errorItems,
            headName,
            mainSchema: {
                type: JsonSchemaType.Object,
                properties: {
                    [fieldName1]: {type: JsonSchemaType.Object},
                },
            },
        });

        expect(result).toEqual({[ARRAY_AND_OBJECT_ERRORS]: {[`${headName}.${fieldName1}`]: error}});
    });

    it('should handle object-like error values by processing nested paths', () => {
        const errorObject = {[fieldName1]: {[fieldName2]: 'nested error'}};
        const errorItems: ValidateErrorItem[] = [{error: errorObject, path: [headName]}];

        const result = processErrorItems({
            errorItems,
            headName,
            mainSchema: {
                type: JsonSchemaType.Object,
                properties: {
                    [fieldName1]: {
                        type: JsonSchemaType.Object,
                        properties: {
                            [fieldName2]: {type: JsonSchemaType.String},
                        },
                    },
                },
            },
        });

        expect(result).toEqual({[ARRAY_AND_OBJECT_ERRORS]: {}, [headName]: errorObject});
    });

    it('should handle object-like error values with array/object nested schemas', () => {
        const error2 = 'array error';
        const error3 = 'object error';
        const errorObject = {
            [fieldName1]: {
                [fieldName2]: error2,
                [fieldName3]: error3,
            },
        };

        const errorItems: ValidateErrorItem[] = [{error: errorObject, path: [headName]}];

        const result = processErrorItems({
            errorItems,
            headName,
            mainSchema: {
                type: JsonSchemaType.Object,
                properties: {
                    [fieldName1]: {
                        type: JsonSchemaType.Object,
                        properties: {
                            [fieldName2]: {type: JsonSchemaType.Array},
                            [fieldName3]: {type: JsonSchemaType.Object},
                        },
                    },
                },
            },
        });

        expect(result).toEqual({
            [ARRAY_AND_OBJECT_ERRORS]: {
                [`${headName}.${fieldName1}.${fieldName2}`]: error2,
                [`${headName}.${fieldName1}.${fieldName3}`]: error3,
            },
        });
    });

    it('should handle multiple error items', () => {
        const error1 = 'string error';
        const error4 = 'nested error';
        const errorItems: ValidateErrorItem[] = [
            {error: error1, path: [headName, fieldName1]},
            {error: true, path: [headName, fieldName2]},
            {error: {[fieldName4]: error4}, path: [headName, fieldName3]},
        ];

        const result = processErrorItems({
            errorItems,
            headName,
            mainSchema: {
                type: JsonSchemaType.Object,
                properties: {
                    [fieldName1]: {type: JsonSchemaType.String},
                    [fieldName2]: {type: JsonSchemaType.Boolean},
                    [fieldName3]: {
                        type: JsonSchemaType.Object,
                        properties: {[fieldName4]: {type: JsonSchemaType.Array}},
                    },
                },
            },
        });

        expect(result).toEqual({
            [ARRAY_AND_OBJECT_ERRORS]: {
                [`${headName}.${fieldName3}.${fieldName4}`]: error4,
            },
            [headName]: {[fieldName1]: error1, [fieldName2]: true},
        });
    });

    it('should do nothing if schema is not found', () => {
        const errorItems: ValidateErrorItem[] = [
            {
                error: 'error message',
                path: [headName, 'nonExistentField'],
            },
        ];

        const result = processErrorItems({
            errorItems,
            headName,
            mainSchema: {type: JsonSchemaType.Object},
        });

        expect(result).toEqual({[ARRAY_AND_OBJECT_ERRORS]: {}});
    });
});
