import {JsonSchemaType} from '../../../constants';
import type {JsonSchemaString} from '../../../types';

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

describe('validate strings', () => {
    describe('maxLength', () => {
        const schema: JsonSchemaString = {
            type: JsonSchemaType.String,
            maxLength: 5,
        };

        const validValue = 'hello';
        const invalidValue = 'abcdef';

        const ajvError = {
            keyword: 'maxLength',
            instancePath: '',
            schemaPath: '#/maxLength',
            params: {limit: 5},
            message: AJV_MESSAGES.maxLength(5),
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

            expect(ajvErrorItems).toEqual([{path: [], error: AJV_MESSAGES.maxLength(5)}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({path: [], error: AJV_MESSAGES.maxLength(5)});
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: GLOBAL_ERROR_MESSAGES.maxLength,
            });
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaString = {
                ...schema,
                entityParameters: {errorMessages: {maxLength: SCHEMA_ERROR_MESSAGES.maxLength}},
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema: schemaWithMessage});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: SCHEMA_ERROR_MESSAGES.maxLength,
            });
        });

        // maxLength has no schema, so we can't test this case
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

            expect(validate(invalidValue, {schema})).toEqual(AJV_MESSAGES.maxLength(5));
            expect(setArrayObjectErrors).toHaveBeenCalledWith({
                headName: FIELD_NAME,
                arrayAndObjectErrors: {},
            });
        });
    });

    describe('minLength', () => {
        const schema: JsonSchemaString = {
            type: JsonSchemaType.String,
            minLength: 5,
        };

        const validValue = 'hello';
        const invalidValue = 'ab';

        const ajvError = {
            keyword: 'minLength',
            instancePath: '',
            schemaPath: '#/minLength',
            params: {limit: 5},
            message: AJV_MESSAGES.minLength(5),
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

            expect(ajvErrorItems).toEqual([{path: [], error: AJV_MESSAGES.minLength(5)}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({path: [], error: AJV_MESSAGES.minLength(5)});
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: GLOBAL_ERROR_MESSAGES.minLength,
            });
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaString = {
                ...schema,
                entityParameters: {errorMessages: {minLength: SCHEMA_ERROR_MESSAGES.minLength}},
            };

            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema: schemaWithMessage});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: SCHEMA_ERROR_MESSAGES.minLength,
            });
        });

        // minLength has no schema, so we can't test this case
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

            expect(validate(invalidValue, {schema})).toEqual(AJV_MESSAGES.minLength(5));
            expect(setArrayObjectErrors).toHaveBeenCalledWith({
                headName: FIELD_NAME,
                arrayAndObjectErrors: {},
            });
        });
    });

    describe('pattern', () => {
        const schema: JsonSchemaString = {
            type: JsonSchemaType.String,
            pattern: '^[a-z]+$',
        };

        const validValue = 'abc';
        const invalidValue = '123';

        const ajvError = {
            keyword: 'pattern',
            instancePath: '',
            schemaPath: '#/pattern',
            params: {pattern: '^[a-z]+$'},
            message: AJV_MESSAGES.pattern('^[a-z]+$'),
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

            expect(ajvErrorItems).toEqual([{path: [], error: AJV_MESSAGES.pattern('^[a-z]+$')}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: AJV_MESSAGES.pattern('^[a-z]+$'),
            });
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({path: [], error: GLOBAL_ERROR_MESSAGES.pattern});
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaString = {
                ...schema,
                entityParameters: {errorMessages: {pattern: SCHEMA_ERROR_MESSAGES.pattern}},
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema: schemaWithMessage});

            expect(onError).toHaveBeenCalledWith({path: [], error: SCHEMA_ERROR_MESSAGES.pattern});
        });

        // pattern has no schema, so we can't test this case
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

            expect(validate(invalidValue, {schema})).toEqual(AJV_MESSAGES.pattern('^[a-z]+$'));
            expect(setArrayObjectErrors).toHaveBeenCalledWith({
                headName: FIELD_NAME,
                arrayAndObjectErrors: {},
            });
        });
    });

    describe('type', () => {
        const schema: JsonSchemaString = {
            type: JsonSchemaType.String,
        };

        const validValue = 'a';
        const invalidValue = 1;

        const ajvError = {
            keyword: 'type',
            instancePath: '',
            schemaPath: '#/type',
            params: {type: JsonSchemaType.String},
            message: AJV_MESSAGES.typeString,
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

            expect(ajvErrorItems).toEqual([{path: [], error: AJV_MESSAGES.typeString}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: AJV_MESSAGES.typeString,
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
            const schemaWithMessage: JsonSchemaString = {
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

            expect(validate(invalidValue, {schema})).toEqual(AJV_MESSAGES.typeString);
            expect(setArrayObjectErrors).toHaveBeenCalledWith({
                headName: FIELD_NAME,
                arrayAndObjectErrors: {},
            });
        });
    });
});
