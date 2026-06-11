import {JsonSchemaType} from '../../../constants';
import type {JsonSchemaBoolean} from '../../../types';

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

describe('validate booleans', () => {
    describe('type', () => {
        const schema: JsonSchemaBoolean = {type: JsonSchemaType.Boolean};

        const validValue = true;
        const invalidValue = 'a';

        const ajvError = {
            keyword: 'type',
            instancePath: '',
            schemaPath: '#/type',
            params: {type: JsonSchemaType.Boolean},
            message: AJV_MESSAGES.typeBoolean,
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

            expect(ajvErrorItems).toEqual([{path: [], error: AJV_MESSAGES.typeBoolean}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: AJV_MESSAGES.typeBoolean,
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
            const schemaWithMessage: JsonSchemaBoolean = {
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
            const {validate, setErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setErrors).toHaveBeenCalledWith({});
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            const errors = {[FIELD_NAME]: AJV_MESSAGES.typeBoolean};

            expect(validate(invalidValue, {schema})).toEqual('error');
            expect(setErrors).toHaveBeenCalledWith(errors);
        });
    });
});
