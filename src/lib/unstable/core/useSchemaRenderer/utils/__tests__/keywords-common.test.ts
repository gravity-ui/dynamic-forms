import {JsonSchemaType} from '../../../constants';
import type {JsonSchemaNumber} from '../../../types';

import {
    AJV_MESSAGES,
    FIELD_NAME,
    GLOBAL_ERROR_MESSAGES,
    KEYWORD_SCHEMA_ERROR_MESSAGES,
    SCHEMA_ERROR_MESSAGES,
    createAjvValidate,
    createProcessAjvError,
    createProcessAjvValidateErrors,
    createValidate,
} from './fixtures.test';

describe('validate booleans', () => {
    describe('allOf', () => {
        const schema: JsonSchemaNumber = {
            type: JsonSchemaType.Number,
            allOf: [{minimum: 5}, {maximum: 10}],
        };

        const validValue = 5;
        const invalidValue = 4;

        const ajvError = {
            keyword: 'minimum',
            instancePath: '',
            schemaPath: '#/allOf/0/minimum',
            params: {comparison: '>=', limit: 5},
            message: AJV_MESSAGES.minimum(5),
        };
        const ajvErrors = [ajvError];

        test('ajv: a valid value produces no errors', () => {
            const validate = createAjvValidate({schema});

            validate(validValue);
        });

        test('ajv: an invalid value produces an error', () => {
            const validate = createAjvValidate({schema});

            validate(invalidValue);

            expect(validate.errors).toEqual(ajvErrors);
        });

        test('processAjvValidateErrors: an ajv error is converted into an error item', () => {
            const {processAjvValidateErrors} = createProcessAjvValidateErrors();

            const {ajvErrorItems, entityParametersErrorItems, waiters} = processAjvValidateErrors({
                ajvValidateErrors: ajvErrors,
                errorMessages: {},
                schema,
            });

            expect(ajvErrorItems).toEqual([{path: [], error: AJV_MESSAGES.minimum(5)}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({path: [], error: AJV_MESSAGES.minimum(5)});
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({path: [], error: GLOBAL_ERROR_MESSAGES.minimum});
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaNumber = {
                ...schema,
                entityParameters: {errorMessages: {minimum: SCHEMA_ERROR_MESSAGES.minimum}},
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema: schemaWithMessage});

            expect(onError).toHaveBeenCalledWith({path: [], error: SCHEMA_ERROR_MESSAGES.minimum});
        });

        test('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {
            const schemaWithMessage: JsonSchemaNumber = {
                ...schema,
                allOf: [
                    {
                        minimum: 1,
                        entityParameters: {
                            errorMessages: {minimum: KEYWORD_SCHEMA_ERROR_MESSAGES.minimum},
                        },
                    },
                    {maximum: 10},
                ],
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema: schemaWithMessage});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: KEYWORD_SCHEMA_ERROR_MESSAGES.minimum,
            });
        });

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setErrors).toHaveBeenCalledWith({});
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            const errors = {[FIELD_NAME]: AJV_MESSAGES.minimum(5)};

            expect(validate(invalidValue, {schema})).toEqual('error');
            expect(setErrors).toHaveBeenCalledWith(errors);
        });
    });

    describe('anyOf', () => {
        const schema: JsonSchemaNumber = {
            type: JsonSchemaType.Number,
            anyOf: [{minimum: 10}, {maximum: 1}],
        };

        const validValue = 0;
        const invalidValue = 5;

        const ajvErrors = [
            {
                keyword: 'minimum',
                instancePath: '',
                schemaPath: '#/anyOf/0/minimum',
                params: {comparison: '>=', limit: 10},
                message: AJV_MESSAGES.minimum(10),
            },
            {
                keyword: 'maximum',
                instancePath: '',
                schemaPath: '#/anyOf/1/maximum',
                params: {comparison: '<=', limit: 1},
                message: AJV_MESSAGES.maximum(1),
            },
            {
                keyword: 'anyOf',
                instancePath: '',
                schemaPath: '#/anyOf',
                params: {},
                message: 'must match a schema in anyOf',
            },
        ];
        const [ajvError1, ajvError2, ajvError3] = ajvErrors;

        test('ajv: a valid value produces no errors', () => {
            const validate = createAjvValidate({schema});

            validate(validValue);

            expect(validate.errors).toBe(null);
        });

        test('ajv: an invalid value produces an error', () => {
            const validate = createAjvValidate({schema});

            validate(invalidValue);

            expect(validate.errors).toEqual(ajvErrors);
        });

        test('processAjvValidateErrors: an ajv error is converted into an error item', () => {
            const {processAjvValidateErrors} = createProcessAjvValidateErrors();

            const {ajvErrorItems, entityParametersErrorItems, waiters} = processAjvValidateErrors({
                ajvValidateErrors: ajvErrors,
                errorMessages: {},
                schema,
            });

            expect(ajvErrorItems).toEqual([
                {path: [], error: AJV_MESSAGES.minimum(10)},
                {path: [], error: AJV_MESSAGES.maximum(1)},
            ]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError3, errorMessages: {}, schema});

            expect(onError).not.toHaveBeenCalled();

            processAjvError({error: ajvError1, errorMessages: {}, schema});
            processAjvError({error: ajvError2, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({path: [], error: AJV_MESSAGES.maximum(1)});
            expect(onError).toHaveBeenCalledWith({path: [], error: AJV_MESSAGES.minimum(10)});
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError3, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).not.toHaveBeenCalled();

            processAjvError({error: ajvError1, errorMessages: GLOBAL_ERROR_MESSAGES, schema});
            processAjvError({error: ajvError2, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({path: [], error: GLOBAL_ERROR_MESSAGES.maximum});
            expect(onError).toHaveBeenCalledWith({path: [], error: GLOBAL_ERROR_MESSAGES.minimum});
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaNumber = {
                ...schema,
                entityParameters: {
                    errorMessages: {
                        maximum: SCHEMA_ERROR_MESSAGES.maximum,
                        minimum: SCHEMA_ERROR_MESSAGES.minimum,
                    },
                },
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({
                error: ajvError3,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).not.toHaveBeenCalled();

            processAjvError({
                error: ajvError1,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });
            processAjvError({
                error: ajvError2,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).toHaveBeenCalledWith({path: [], error: SCHEMA_ERROR_MESSAGES.maximum});
            expect(onError).toHaveBeenCalledWith({path: [], error: SCHEMA_ERROR_MESSAGES.minimum});
        });

        test('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {
            const schemaWithMessage: JsonSchemaNumber = {
                ...schema,
                anyOf: [
                    {
                        minimum: 10,
                        entityParameters: {
                            errorMessages: {minimum: KEYWORD_SCHEMA_ERROR_MESSAGES.minimum},
                        },
                    },
                    {
                        maximum: 1,
                        entityParameters: {
                            errorMessages: {maximum: KEYWORD_SCHEMA_ERROR_MESSAGES.maximum},
                        },
                    },
                ],
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({
                error: ajvError3,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).not.toHaveBeenCalled();

            processAjvError({
                error: ajvError1,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });
            processAjvError({
                error: ajvError2,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: KEYWORD_SCHEMA_ERROR_MESSAGES.maximum,
            });
            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: KEYWORD_SCHEMA_ERROR_MESSAGES.minimum,
            });
        });

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setErrors).toHaveBeenCalledWith({});
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            const errors = {[FIELD_NAME]: AJV_MESSAGES.maximum(1)};

            expect(validate(invalidValue, {schema})).toEqual('error');
            expect(setErrors).toHaveBeenCalledWith(errors);
        });
    });

    describe('const', () => {
        const schema: JsonSchemaNumber = {
            type: JsonSchemaType.Number,
            const: 10,
        };

        const validValue = 10;
        const invalidValue = 5;

        const ajvError = {
            keyword: 'const',
            instancePath: '',
            schemaPath: '#/const',
            params: {allowedValue: 10},
            message: AJV_MESSAGES.const,
        };
        const ajvErrors = [ajvError];

        test('ajv: a valid value produces no errors', () => {
            const validate = createAjvValidate({schema});

            validate(validValue);

            expect(validate.errors).toBe(null);
        });

        test('ajv: an invalid value produces an error', () => {
            const validate = createAjvValidate({schema});

            validate(invalidValue);

            expect(validate.errors).toEqual(ajvErrors);
        });

        test('processAjvValidateErrors: an ajv error is converted into an error item', () => {
            const {processAjvValidateErrors} = createProcessAjvValidateErrors();

            const {ajvErrorItems, entityParametersErrorItems, waiters} = processAjvValidateErrors({
                ajvValidateErrors: ajvErrors,
                errorMessages: {},
                schema,
            });

            expect(ajvErrorItems).toEqual([{path: [], error: AJV_MESSAGES.const}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({path: [], error: AJV_MESSAGES.const});
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({path: [], error: GLOBAL_ERROR_MESSAGES.const});
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaNumber = {
                ...schema,
                entityParameters: {errorMessages: {const: SCHEMA_ERROR_MESSAGES.const}},
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({
                error: ajvError,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).toHaveBeenCalledWith({path: [], error: SCHEMA_ERROR_MESSAGES.const});
        });

        // const has no schema, so we can't test this case
        test.skip('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {});

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setErrors).toHaveBeenCalledWith({});
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            const errors = {[FIELD_NAME]: AJV_MESSAGES.const};

            expect(validate(invalidValue, {schema})).toEqual('error');
            expect(setErrors).toHaveBeenCalledWith(errors);
        });
    });

    describe('else', () => {
        const schema: JsonSchemaNumber = {
            type: JsonSchemaType.Number,
            if: {const: 5},
            else: {enum: [10]},
        };

        const validValue = 10;
        const invalidValue = 20;

        const ajvErrors = [
            {
                keyword: 'enum',
                instancePath: '',
                schemaPath: '#/else/enum',
                params: {allowedValues: [10]},
                message: AJV_MESSAGES.enum,
            },
            {
                keyword: 'if',
                instancePath: '',
                schemaPath: '#/if',
                params: {failingKeyword: 'else'},
                message: AJV_MESSAGES.else,
            },
        ];
        const [ajvError1, ajvError2] = ajvErrors;

        test('ajv: a valid value produces no errors', () => {
            const validate = createAjvValidate({schema});

            validate(validValue);

            expect(validate.errors).toBe(null);
        });

        test('ajv: an invalid value produces an error', () => {
            const validate = createAjvValidate({schema});

            validate(invalidValue);

            expect(validate.errors).toEqual(ajvErrors);
        });

        test('processAjvValidateErrors: an ajv error is converted into an error item', () => {
            const {processAjvValidateErrors} = createProcessAjvValidateErrors();

            const {ajvErrorItems, entityParametersErrorItems, waiters} = processAjvValidateErrors({
                ajvValidateErrors: ajvErrors,
                errorMessages: {},
                schema,
            });

            expect(ajvErrorItems).toEqual([{path: [], error: AJV_MESSAGES.enum}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError2, errorMessages: {}, schema});

            expect(onError).not.toHaveBeenCalled();

            processAjvError({error: ajvError1, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({path: [], error: AJV_MESSAGES.enum});
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError2, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).not.toHaveBeenCalled();

            processAjvError({error: ajvError1, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({path: [], error: GLOBAL_ERROR_MESSAGES.enum});
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaNumber = {
                ...schema,
                entityParameters: {errorMessages: {enum: SCHEMA_ERROR_MESSAGES.enum}},
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({
                error: ajvError2,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).not.toHaveBeenCalled();

            processAjvError({
                error: ajvError1,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).toHaveBeenCalledWith({path: [], error: SCHEMA_ERROR_MESSAGES.enum});
        });

        test('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {
            const schemaWithMessage: JsonSchemaNumber = {
                ...schema,
                else: {
                    const: 10,
                    entityParameters: {errorMessages: {enum: KEYWORD_SCHEMA_ERROR_MESSAGES.enum}},
                },
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({
                error: ajvError2,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).not.toHaveBeenCalled();

            processAjvError({
                error: ajvError1,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: KEYWORD_SCHEMA_ERROR_MESSAGES.enum,
            });
        });

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setErrors).toHaveBeenCalledWith({});
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            const errors = {[FIELD_NAME]: AJV_MESSAGES.enum};

            expect(validate(invalidValue, {schema})).toEqual('error');
            expect(setErrors).toHaveBeenCalledWith(errors);
        });
    });

    describe('enum', () => {
        const schema: JsonSchemaNumber = {
            type: JsonSchemaType.Number,
            enum: [1, 2, 3],
        };

        const validValue = 1;
        const invalidValue = 4;

        const ajvError = {
            keyword: 'enum',
            instancePath: '',
            schemaPath: '#/enum',
            params: {allowedValues: [1, 2, 3]},
            message: AJV_MESSAGES.enum,
        };
        const ajvErrors = [ajvError];

        test('ajv: a valid value produces no errors', () => {
            const validate = createAjvValidate({schema});

            validate(validValue);

            expect(validate.errors).toBe(null);
        });

        test('ajv: an invalid value produces an error', () => {
            const validate = createAjvValidate({schema});

            validate(invalidValue);

            expect(validate.errors).toEqual(ajvErrors);
        });

        test('processAjvValidateErrors: an ajv error is converted into an error item', () => {
            const {processAjvValidateErrors} = createProcessAjvValidateErrors();

            const {ajvErrorItems, entityParametersErrorItems, waiters} = processAjvValidateErrors({
                ajvValidateErrors: ajvErrors,
                errorMessages: {},
                schema,
            });

            expect(ajvErrorItems).toEqual([{path: [], error: AJV_MESSAGES.enum}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({path: [], error: AJV_MESSAGES.enum});
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({path: [], error: GLOBAL_ERROR_MESSAGES.enum});
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaNumber = {
                ...schema,
                entityParameters: {errorMessages: {enum: SCHEMA_ERROR_MESSAGES.enum}},
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({
                error: ajvError,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).toHaveBeenCalledWith({path: [], error: SCHEMA_ERROR_MESSAGES.enum});
        });

        // enum has no schema, so we can't test this case
        test.skip('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {});

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setErrors).toHaveBeenCalledWith({});
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            const errors = {[FIELD_NAME]: AJV_MESSAGES.enum};

            expect(validate(invalidValue, {schema})).toEqual('error');
            expect(setErrors).toHaveBeenCalledWith(errors);
        });
    });

    describe('not', () => {
        const schema: JsonSchemaNumber = {
            type: JsonSchemaType.Number,
            not: {minimum: 5},
        };

        const validValue = 1;
        const invalidValue = 10;

        const ajvError = {
            keyword: 'not',
            instancePath: '',
            schemaPath: '#/not',
            params: {},
            message: AJV_MESSAGES.not,
        };
        const ajvErrors = [ajvError];

        test('ajv: a valid value produces no errors', () => {
            const validate = createAjvValidate({schema});

            validate(validValue);

            expect(validate.errors).toBe(null);
        });

        test('ajv: an invalid value produces an error', () => {
            const validate = createAjvValidate({schema});

            validate(invalidValue);

            expect(validate.errors).toEqual(ajvErrors);
        });

        test('processAjvValidateErrors: an ajv error is converted into an error item', () => {
            const {processAjvValidateErrors} = createProcessAjvValidateErrors();

            const {ajvErrorItems, entityParametersErrorItems, waiters} = processAjvValidateErrors({
                ajvValidateErrors: ajvErrors,
                errorMessages: {},
                schema,
            });

            expect(ajvErrorItems).toEqual([{path: [], error: AJV_MESSAGES.not}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({path: [], error: AJV_MESSAGES.not});
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({path: [], error: GLOBAL_ERROR_MESSAGES.not});
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaNumber = {
                ...schema,
                entityParameters: {errorMessages: {not: SCHEMA_ERROR_MESSAGES.not}},
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({
                error: ajvError,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).toHaveBeenCalledWith({path: [], error: SCHEMA_ERROR_MESSAGES.not});
        });

        test('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {
            const schemaWithMessage: JsonSchemaNumber = {
                ...schema,
                not: {
                    minimum: 5,
                    entityParameters: {errorMessages: {not: KEYWORD_SCHEMA_ERROR_MESSAGES.not}},
                },
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({
                error: ajvError,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: KEYWORD_SCHEMA_ERROR_MESSAGES.not,
            });
        });

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setErrors).toHaveBeenCalledWith({});
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            const errors = {[FIELD_NAME]: AJV_MESSAGES.not};

            expect(validate(invalidValue, {schema})).toEqual('error');
            expect(setErrors).toHaveBeenCalledWith(errors);
        });
    });

    describe('oneOf', () => {
        const schema: JsonSchemaNumber = {
            type: JsonSchemaType.Number,
            oneOf: [{maximum: 1}, {minimum: 10}],
        };

        const validValue = 0;
        const invalidValue = 5;

        const ajvErrors = [
            {
                keyword: 'maximum',
                instancePath: '',
                schemaPath: '#/oneOf/0/maximum',
                params: {comparison: '<=', limit: 1},
                message: AJV_MESSAGES.maximum(1),
            },
            {
                keyword: 'minimum',
                instancePath: '',
                schemaPath: '#/oneOf/1/minimum',
                params: {comparison: '>=', limit: 10},
                message: AJV_MESSAGES.minimum(10),
            },
            {
                keyword: 'oneOf',
                instancePath: '',
                schemaPath: '#/oneOf',
                params: {passingSchemas: null},
                message: AJV_MESSAGES.oneOf,
            },
        ];
        const [ajvError1, ajvError2, ajvError3] = ajvErrors;

        test('ajv: a valid value produces no errors', () => {
            const validate = createAjvValidate({schema});

            validate(validValue);

            expect(validate.errors).toBe(null);
        });

        test('ajv: an invalid value produces an error', () => {
            const validate = createAjvValidate({schema});

            validate(invalidValue);

            expect(validate.errors).toEqual(ajvErrors);
        });

        test('processAjvValidateErrors: an ajv error is converted into an error item', () => {
            const {processAjvValidateErrors} = createProcessAjvValidateErrors();

            const {ajvErrorItems, entityParametersErrorItems, waiters} = processAjvValidateErrors({
                ajvValidateErrors: ajvErrors,
                errorMessages: {},
                schema,
            });

            expect(ajvErrorItems).toEqual([
                {path: [], error: AJV_MESSAGES.maximum(1)},
                {path: [], error: AJV_MESSAGES.minimum(10)},
                {path: [], error: AJV_MESSAGES.oneOf},
            ]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError1, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({path: [], error: AJV_MESSAGES.maximum(1)});

            processAjvError({error: ajvError2, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({path: [], error: AJV_MESSAGES.minimum(10)});

            processAjvError({error: ajvError3, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({path: [], error: AJV_MESSAGES.oneOf});
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError1, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: GLOBAL_ERROR_MESSAGES.maximum,
            });

            processAjvError({error: ajvError2, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: GLOBAL_ERROR_MESSAGES.minimum,
            });

            processAjvError({error: ajvError3, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: GLOBAL_ERROR_MESSAGES.oneOf,
            });
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaNumber = {
                ...schema,
                entityParameters: {
                    errorMessages: {
                        maximum: SCHEMA_ERROR_MESSAGES.maximum,
                        minimum: SCHEMA_ERROR_MESSAGES.minimum,
                        oneOf: SCHEMA_ERROR_MESSAGES.oneOf,
                    },
                },
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({
                error: ajvError1,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: SCHEMA_ERROR_MESSAGES.maximum,
            });

            processAjvError({
                error: ajvError2,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: SCHEMA_ERROR_MESSAGES.minimum,
            });

            processAjvError({
                error: ajvError3,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: SCHEMA_ERROR_MESSAGES.oneOf,
            });
        });

        test('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {
            const schemaWithMessage: JsonSchemaNumber = {
                ...schema,
                oneOf: [
                    {
                        maximum: 1,
                        entityParameters: {
                            errorMessages: {maximum: KEYWORD_SCHEMA_ERROR_MESSAGES.maximum},
                        },
                    },
                    {
                        minimum: 10,
                        entityParameters: {
                            errorMessages: {minimum: KEYWORD_SCHEMA_ERROR_MESSAGES.minimum},
                        },
                    },
                ],
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({
                error: ajvError1,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: KEYWORD_SCHEMA_ERROR_MESSAGES.maximum,
            });

            processAjvError({
                error: ajvError2,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: KEYWORD_SCHEMA_ERROR_MESSAGES.minimum,
            });

            processAjvError({
                error: ajvError3,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            // oneOf has no schema by schema path, so it uses the global error message
            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: GLOBAL_ERROR_MESSAGES.oneOf,
            });
        });

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setErrors).toHaveBeenCalledWith({});
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            const errors = {[FIELD_NAME]: AJV_MESSAGES.oneOf};

            expect(validate(invalidValue, {schema})).toEqual('error');
            expect(setErrors).toHaveBeenCalledWith(errors);
        });
    });

    describe('then', () => {
        const schema: JsonSchemaNumber = {
            type: JsonSchemaType.Number,
            if: {const: 5},
            then: {enum: [10]},
        };

        const validValue = 10;
        const invalidValue = 5;

        const ajvErrors = [
            {
                keyword: 'enum',
                instancePath: '',
                schemaPath: '#/then/enum',
                params: {allowedValues: [10]},
                message: AJV_MESSAGES.enum,
            },
            {
                keyword: 'if',
                instancePath: '',
                schemaPath: '#/if',
                params: {failingKeyword: 'then'},
                message: AJV_MESSAGES.then,
            },
        ];
        const [ajvError1, ajvError2] = ajvErrors;

        test('ajv: a valid value produces no errors', () => {
            const validate = createAjvValidate({schema});

            validate(validValue);

            expect(validate.errors).toBe(null);
        });

        test('ajv: an invalid value produces an error', () => {
            const validate = createAjvValidate({schema});

            validate(invalidValue);

            expect(validate.errors).toEqual(ajvErrors);
        });

        test('processAjvValidateErrors: an ajv error is converted into an error item', () => {
            const {processAjvValidateErrors} = createProcessAjvValidateErrors();

            const {ajvErrorItems, entityParametersErrorItems, waiters} = processAjvValidateErrors({
                ajvValidateErrors: ajvErrors,
                errorMessages: {},
                schema,
            });

            expect(ajvErrorItems).toEqual([{path: [], error: AJV_MESSAGES.enum}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError2, errorMessages: {}, schema});

            expect(onError).not.toHaveBeenCalled();

            processAjvError({error: ajvError1, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({path: [], error: AJV_MESSAGES.enum});
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError2, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).not.toHaveBeenCalled();

            processAjvError({error: ajvError1, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({path: [], error: GLOBAL_ERROR_MESSAGES.enum});
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaNumber = {
                ...schema,
                entityParameters: {errorMessages: {enum: SCHEMA_ERROR_MESSAGES.enum}},
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({
                error: ajvError2,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).not.toHaveBeenCalled();

            processAjvError({
                error: ajvError1,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).toHaveBeenCalledWith({path: [], error: SCHEMA_ERROR_MESSAGES.enum});
        });

        test('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {
            const schemaWithMessage: JsonSchemaNumber = {
                ...schema,
                then: {
                    enum: [10],
                    entityParameters: {errorMessages: {enum: KEYWORD_SCHEMA_ERROR_MESSAGES.enum}},
                },
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({
                error: ajvError2,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).not.toHaveBeenCalled();

            processAjvError({
                error: ajvError1,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: KEYWORD_SCHEMA_ERROR_MESSAGES.enum,
            });
        });

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setErrors).toHaveBeenCalledWith({});
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            const errors = {[FIELD_NAME]: AJV_MESSAGES.enum};

            expect(validate(invalidValue, {schema})).toEqual('error');
            expect(setErrors).toHaveBeenCalledWith(errors);
        });
    });
});
