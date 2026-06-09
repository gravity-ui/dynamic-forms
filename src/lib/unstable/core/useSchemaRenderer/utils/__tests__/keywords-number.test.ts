import {JsonSchemaType} from '../../../constants';
import type {JsonSchemaNumber} from '../../../types';

import {
    AJV_MESSAGES,
    FIELD_NAME,
    GLOBAL_ERROR_MESSAGES,
    SCHEMA_ERROR_MESSAGES,
    createAjvValidate,
    createProcessAjvError,
    createProcessAjvValidateErrors,
    createValidate,
} from './fixtures.test';

describe('validate numbers', () => {
    describe('exclusiveMaximum', () => {
        const schema: JsonSchemaNumber = {
            type: JsonSchemaType.Number,
            exclusiveMaximum: 5,
        };

        const validValue = 4;
        const invalidValue = 5;

        const ajvError = {
            keyword: 'exclusiveMaximum',
            instancePath: '',
            schemaPath: '#/exclusiveMaximum',
            params: {comparison: '<', limit: 5},
            message: AJV_MESSAGES.exclusiveMaximum(5),
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

            expect(ajvErrorItems).toEqual([{path: [], error: AJV_MESSAGES.exclusiveMaximum(5)}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: AJV_MESSAGES.exclusiveMaximum(5),
            });
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: GLOBAL_ERROR_MESSAGES.exclusiveMaximum,
            });
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaNumber = {
                ...schema,
                entityParameters: {
                    errorMessages: {exclusiveMaximum: SCHEMA_ERROR_MESSAGES.exclusiveMaximum},
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
                error: SCHEMA_ERROR_MESSAGES.exclusiveMaximum,
            });
        });

        // exclusiveMaximum has no schema, so we can't test this case
        test.skip('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {});

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setArrayObjectErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setArrayObjectErrors).toHaveBeenCalledWith({
                headName: FIELD_NAME,
                arrayAndObjectErrors: {},
            });
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setArrayObjectErrors} = createValidate();

            expect(validate(invalidValue, {schema})).toEqual(AJV_MESSAGES.exclusiveMaximum(5));
            expect(setArrayObjectErrors).toHaveBeenCalledWith({
                headName: FIELD_NAME,
                arrayAndObjectErrors: {},
            });
        });
    });

    describe('exclusiveMinimum', () => {
        const schema: JsonSchemaNumber = {
            type: JsonSchemaType.Number,
            exclusiveMinimum: 5,
        };

        const validValue = 6;
        const invalidValue = 5;

        const ajvError = {
            keyword: 'exclusiveMinimum',
            instancePath: '',
            schemaPath: '#/exclusiveMinimum',
            params: {comparison: '>', limit: 5},
            message: AJV_MESSAGES.exclusiveMinimum(5),
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

            expect(ajvErrorItems).toEqual([{path: [], error: AJV_MESSAGES.exclusiveMinimum(5)}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: AJV_MESSAGES.exclusiveMinimum(5),
            });
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: GLOBAL_ERROR_MESSAGES.exclusiveMinimum,
            });
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaNumber = {
                ...schema,
                entityParameters: {
                    errorMessages: {exclusiveMinimum: SCHEMA_ERROR_MESSAGES.exclusiveMinimum},
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
                error: SCHEMA_ERROR_MESSAGES.exclusiveMinimum,
            });
        });

        // exclusiveMinimum has no schema, so we can't test this case
        test.skip('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {});

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setArrayObjectErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setArrayObjectErrors).toHaveBeenCalledWith({
                headName: FIELD_NAME,
                arrayAndObjectErrors: {},
            });
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setArrayObjectErrors} = createValidate();

            expect(validate(invalidValue, {schema})).toEqual(AJV_MESSAGES.exclusiveMinimum(5));
            expect(setArrayObjectErrors).toHaveBeenCalledWith({
                headName: FIELD_NAME,
                arrayAndObjectErrors: {},
            });
        });
    });

    describe('maximum', () => {
        const schema: JsonSchemaNumber = {
            type: JsonSchemaType.Number,
            maximum: 5,
        };

        const validValue = 4;
        const invalidValue = 6;

        const ajvError = {
            keyword: 'maximum',
            instancePath: '',
            schemaPath: '#/maximum',
            params: {comparison: '<=', limit: 5},
            message: AJV_MESSAGES.maximum(5),
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

            expect(ajvErrorItems).toEqual([{path: [], error: AJV_MESSAGES.maximum(5)}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: AJV_MESSAGES.maximum(5),
            });
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: GLOBAL_ERROR_MESSAGES.maximum,
            });
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaNumber = {
                ...schema,
                entityParameters: {errorMessages: {maximum: SCHEMA_ERROR_MESSAGES.maximum}},
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({
                error: ajvError,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: SCHEMA_ERROR_MESSAGES.maximum,
            });
        });

        // maximum has no schema, so we can't test this case
        test.skip('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {});

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setArrayObjectErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setArrayObjectErrors).toHaveBeenCalledWith({
                headName: FIELD_NAME,
                arrayAndObjectErrors: {},
            });
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setArrayObjectErrors} = createValidate();

            expect(validate(invalidValue, {schema})).toEqual(AJV_MESSAGES.maximum(5));
            expect(setArrayObjectErrors).toHaveBeenCalledWith({
                headName: FIELD_NAME,
                arrayAndObjectErrors: {},
            });
        });
    });

    describe('minimum', () => {
        const schema: JsonSchemaNumber = {
            type: JsonSchemaType.Number,
            minimum: 5,
        };

        const validValue = 6;
        const invalidValue = 4;

        const ajvError = {
            keyword: 'minimum',
            instancePath: '',
            schemaPath: '#/minimum',
            params: {comparison: '>=', limit: 5},
            message: AJV_MESSAGES.minimum(5),
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

            expect(ajvErrorItems).toEqual([{path: [], error: AJV_MESSAGES.minimum(5)}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: AJV_MESSAGES.minimum(5),
            });
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: GLOBAL_ERROR_MESSAGES.minimum,
            });
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaNumber = {
                ...schema,
                entityParameters: {errorMessages: {minimum: SCHEMA_ERROR_MESSAGES.minimum}},
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({
                error: ajvError,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: SCHEMA_ERROR_MESSAGES.minimum,
            });
        });

        // minimum has no schema, so we can't test this case
        test.skip('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {});

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setArrayObjectErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setArrayObjectErrors).toHaveBeenCalledWith({
                headName: FIELD_NAME,
                arrayAndObjectErrors: {},
            });
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setArrayObjectErrors} = createValidate();

            expect(validate(invalidValue, {schema})).toEqual(AJV_MESSAGES.minimum(5));
            expect(setArrayObjectErrors).toHaveBeenCalledWith({
                headName: FIELD_NAME,
                arrayAndObjectErrors: {},
            });
        });
    });

    describe('multipleOf', () => {
        const schema: JsonSchemaNumber = {
            type: JsonSchemaType.Number,
            multipleOf: 3,
        };

        const validValue = 6;
        const invalidValue = 4;

        const ajvError = {
            keyword: 'multipleOf',
            instancePath: '',
            schemaPath: '#/multipleOf',
            params: {multipleOf: 3},
            message: AJV_MESSAGES.multipleOf(3),
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

            expect(ajvErrorItems).toEqual([{path: [], error: AJV_MESSAGES.multipleOf(3)}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: AJV_MESSAGES.multipleOf(3),
            });
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: GLOBAL_ERROR_MESSAGES.multipleOf,
            });
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaNumber = {
                ...schema,
                entityParameters: {errorMessages: {multipleOf: SCHEMA_ERROR_MESSAGES.multipleOf}},
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({
                error: ajvError,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: SCHEMA_ERROR_MESSAGES.multipleOf,
            });
        });

        // multipleOf has no schema, so we can't test this case
        test.skip('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {});

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setArrayObjectErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setArrayObjectErrors).toHaveBeenCalledWith({
                headName: FIELD_NAME,
                arrayAndObjectErrors: {},
            });
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setArrayObjectErrors} = createValidate();

            expect(validate(invalidValue, {schema})).toEqual(AJV_MESSAGES.multipleOf(3));
            expect(setArrayObjectErrors).toHaveBeenCalledWith({
                headName: FIELD_NAME,
                arrayAndObjectErrors: {},
            });
        });
    });

    describe('type', () => {
        const schema: JsonSchemaNumber = {
            type: JsonSchemaType.Number,
        };

        const validValue = 888;
        const invalidValue = 'a';

        const ajvError = {
            keyword: 'type',
            instancePath: '',
            schemaPath: '#/type',
            params: {type: JsonSchemaType.Number},
            message: AJV_MESSAGES.typeNumber,
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

            expect(ajvErrorItems).toEqual([{path: [], error: AJV_MESSAGES.typeNumber}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: AJV_MESSAGES.typeNumber,
            });
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: GLOBAL_ERROR_MESSAGES.type,
            });
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaNumber = {
                ...schema,
                entityParameters: {errorMessages: {type: SCHEMA_ERROR_MESSAGES.type}},
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({
                error: ajvError,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: SCHEMA_ERROR_MESSAGES.type,
            });
        });

        // type has no schema, so we can't test this case
        test.skip('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {});

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setArrayObjectErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setArrayObjectErrors).toHaveBeenCalledWith({
                headName: FIELD_NAME,
                arrayAndObjectErrors: {},
            });
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setArrayObjectErrors} = createValidate();

            expect(validate(invalidValue, {schema})).toEqual(AJV_MESSAGES.typeNumber);
            expect(setArrayObjectErrors).toHaveBeenCalledWith({
                headName: FIELD_NAME,
                arrayAndObjectErrors: {},
            });
        });
    });
});
