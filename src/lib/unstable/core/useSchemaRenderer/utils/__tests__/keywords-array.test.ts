import type {ErrorObject} from 'ajv';

import {JsonSchemaType} from '../../../constants';
import type {ArrayValue, JsonSchemaArray} from '../../../types';

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

describe('validate arrays', () => {
    // additionalItems requires tuple-form `items` — use 2-element tuple (avoids 1-tuple strict warning).
    describe('additionalItems (boolean)', () => {
        const schema: JsonSchemaArray = {
            type: JsonSchemaType.Array,
            items: [{type: JsonSchemaType.String}, {type: JsonSchemaType.Number}],
            additionalItems: false,
        };

        const validValue = ['a', 1];
        const invalidValue = ['a', 1, 'x'];

        const ajvError: ErrorObject = {
            keyword: 'additionalItems',
            instancePath: '',
            schemaPath: '#/additionalItems',
            params: {limit: 2},
            message: AJV_MESSAGES.additionalItems(2),
        };
        const ajvErrors = [ajvError];

        test('ajv: a valid value produces no errors', () => {
            const validate = createAjvValidate({schema});

            validate(validValue);

            expect(validate.errors).toBe(null);
        });

        test('ajv: an extra item with additionalItems=false produces an error', () => {
            const validate = createAjvValidate({schema});

            validate(invalidValue);

            expect(validate.errors).toEqual(ajvErrors);
        });

        test('ajv: an extra item is allowed when additionalItems=true', () => {
            const validate = createAjvValidate({schema: {...schema, additionalItems: true}});

            validate(invalidValue);

            expect(validate.errors).toEqual(null);
        });

        test('processAjvValidateErrors: an ajv error is converted into an error item', () => {
            const {processAjvValidateErrors} = createProcessAjvValidateErrors();

            const {ajvErrorItems, entityParametersErrorItems, waiters} = processAjvValidateErrors({
                ajvValidateErrors: ajvErrors,
                errorMessages: {},
                schema,
            });

            expect(ajvErrorItems).toEqual([{path: [], error: AJV_MESSAGES.additionalItems(2)}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: AJV_MESSAGES.additionalItems(2),
            });
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: GLOBAL_ERROR_MESSAGES.additionalItems,
            });
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaArray = {
                ...schema,
                entityParameters: {
                    errorMessages: {additionalItems: SCHEMA_ERROR_MESSAGES.additionalItems},
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
                error: SCHEMA_ERROR_MESSAGES.additionalItems,
            });
        });

        // additionalItems=false has no schema, so we can't test this case
        test.skip('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {});

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setErrors).toHaveBeenCalledWith({});
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            const errors = {[FIELD_NAME]: AJV_MESSAGES.additionalItems(2)};

            expect(validate(invalidValue, {schema})).toBe('error');
            expect(setErrors).toHaveBeenCalledWith(errors);
        });
    });

    // additionalItems requires tuple-form `items` — use 2-element tuple (avoids 1-tuple strict warning).
    describe('additionalItems (schema)', () => {
        const schema: JsonSchemaArray = {
            type: JsonSchemaType.Array,
            items: [{type: JsonSchemaType.String}, {type: JsonSchemaType.Number}],
            additionalItems: {type: JsonSchemaType.Number},
        };

        const validValue = ['a', 1, 2];
        const invalidValue = ['a', 1, 'x'];

        const ajvError: ErrorObject = {
            keyword: 'type',
            instancePath: '/2',
            schemaPath: '#/additionalItems/type',
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

            expect(ajvErrorItems).toEqual([{path: ['2'], error: AJV_MESSAGES.typeNumber}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({
                path: ['2'],
                error: AJV_MESSAGES.typeNumber,
            });
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({
                path: ['2'],
                error: GLOBAL_ERROR_MESSAGES.type,
            });
        });

        // items has no schema for additionalItems instance paths, so we can't test this case
        test.skip('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {});

        test('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {
            const schemaWithKeywordMessage: JsonSchemaArray = {
                ...schema,
                additionalItems: {
                    type: JsonSchemaType.Number,
                    entityParameters: {errorMessages: {type: KEYWORD_SCHEMA_ERROR_MESSAGES.type}},
                },
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({
                error: ajvError,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithKeywordMessage,
            });

            expect(onError).toHaveBeenCalledWith({
                path: ['2'],
                error: KEYWORD_SCHEMA_ERROR_MESSAGES.type,
            });
        });

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setErrors).toHaveBeenCalledWith({});
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            const errors = {[`${FIELD_NAME}[2]`]: AJV_MESSAGES.typeNumber};

            expect(validate(invalidValue, {schema})).toBe('error');
            expect(setErrors).toHaveBeenCalledWith(errors);
        });
    });

    describe('contains (boolean)', () => {
        const schema: JsonSchemaArray = {
            type: JsonSchemaType.Array,
            items: {type: JsonSchemaType.Number},
            contains: true,
        };

        const validValue = [1];
        const invalidValue: ArrayValue = [];

        const ajvError: ErrorObject = {
            keyword: 'contains',
            instancePath: '',
            schemaPath: '#/contains',
            params: {minContains: 1},
            message: AJV_MESSAGES.contains,
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

            expect(ajvErrorItems).toEqual([{path: [], error: AJV_MESSAGES.contains}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: AJV_MESSAGES.contains,
            });
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: GLOBAL_ERROR_MESSAGES.contains,
            });
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaArray = {
                ...schema,
                entityParameters: {
                    errorMessages: {contains: SCHEMA_ERROR_MESSAGES.contains},
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
                error: SCHEMA_ERROR_MESSAGES.contains,
            });
        });

        // contains has no schema, so we can't test this case
        test.skip('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {});

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setErrors).toHaveBeenCalledWith({});
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            const errors = {[FIELD_NAME]: AJV_MESSAGES.contains};

            expect(validate(invalidValue, {schema})).toBe('error');
            expect(setErrors).toHaveBeenCalledWith(errors);
        });
    });

    describe('contains (schema)', () => {
        const schema: JsonSchemaArray = {
            type: JsonSchemaType.Array,
            contains: {type: JsonSchemaType.Number},
        };

        const validValue = [1];
        const invalidValue: ArrayValue = [];

        const ajvError: ErrorObject = {
            keyword: 'contains',
            instancePath: '',
            schemaPath: '#/contains',
            params: {minContains: 1},
            message: AJV_MESSAGES.contains,
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

            expect(ajvErrorItems).toEqual([{path: [], error: AJV_MESSAGES.contains}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: AJV_MESSAGES.contains,
            });
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: GLOBAL_ERROR_MESSAGES.contains,
            });
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaArray = {
                ...schema,
                entityParameters: {
                    errorMessages: {contains: SCHEMA_ERROR_MESSAGES.contains},
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
                error: SCHEMA_ERROR_MESSAGES.contains,
            });
        });

        test('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {
            const schemaWithKeywordMessage: JsonSchemaArray = {
                ...schema,
                contains: {
                    type: JsonSchemaType.Number,
                    entityParameters: {
                        errorMessages: {contains: KEYWORD_SCHEMA_ERROR_MESSAGES.contains},
                    },
                },
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({
                error: ajvError,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithKeywordMessage,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: KEYWORD_SCHEMA_ERROR_MESSAGES.contains,
            });
        });

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setErrors).toHaveBeenCalledWith({});
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            const errors = {[FIELD_NAME]: AJV_MESSAGES.contains};

            expect(validate(invalidValue, {schema})).toBe('error');
            expect(setErrors).toHaveBeenCalledWith(errors);
        });
    });

    describe('items (single schema)', () => {
        const schema: JsonSchemaArray = {
            type: JsonSchemaType.Array,
            items: {type: JsonSchemaType.String},
        };

        const validValue = ['a'];
        const invalidValue: ArrayValue = [1];

        const ajvError: ErrorObject = {
            keyword: 'type',
            instancePath: '/0',
            schemaPath: '#/items/type',
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

            expect(ajvErrorItems).toEqual([{path: ['0'], error: AJV_MESSAGES.typeString}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({
                path: ['0'],
                error: AJV_MESSAGES.typeString,
            });
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({
                path: ['0'],
                error: GLOBAL_ERROR_MESSAGES.type,
            });
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaArray = {
                ...schema,
                items: {
                    type: JsonSchemaType.String,
                    entityParameters: {errorMessages: {type: SCHEMA_ERROR_MESSAGES.type}},
                },
            };

            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({
                error: ajvError,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).toHaveBeenCalledWith({
                path: ['0'],
                error: SCHEMA_ERROR_MESSAGES.type,
            });
        });

        // items has same schema path and instance path in this case, so we dont need to test this
        test.skip('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {});

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setErrors).toHaveBeenCalledWith({});
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            const errors = {[`${FIELD_NAME}[0]`]: AJV_MESSAGES.typeString};

            expect(validate(invalidValue, {schema})).toBe('error');
            expect(setErrors).toHaveBeenCalledWith(errors);
        });
    });

    describe('items (tuple)', () => {
        const schema: JsonSchemaArray = {
            type: JsonSchemaType.Array,
            items: [{type: JsonSchemaType.String}, {type: JsonSchemaType.Number}],
        };

        const validValue = ['a', 1];
        const invalidValue: ArrayValue = ['a', 'b'];

        const ajvError: ErrorObject = {
            keyword: 'type',
            instancePath: '/1',
            schemaPath: '#/items/1/type',
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

            expect(ajvErrorItems).toEqual([{path: ['1'], error: AJV_MESSAGES.typeNumber}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({
                path: ['1'],
                error: AJV_MESSAGES.typeNumber,
            });
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({
                path: ['1'],
                error: GLOBAL_ERROR_MESSAGES.type,
            });
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaArray = {
                ...schema,
                items: [
                    {type: JsonSchemaType.String},
                    {
                        type: JsonSchemaType.Number,
                        entityParameters: {errorMessages: {type: SCHEMA_ERROR_MESSAGES.type}},
                    },
                ],
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({
                error: ajvError,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).toHaveBeenCalledWith({
                path: ['1'],
                error: SCHEMA_ERROR_MESSAGES.type,
            });
        });

        // items has same schema path and instance path in this case, so we dont need to test this
        test.skip('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {});

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setErrors).toHaveBeenCalledWith({});
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            const errors = {[`${FIELD_NAME}[1]`]: AJV_MESSAGES.typeNumber};

            expect(validate(invalidValue, {schema})).toBe('error');
            expect(setErrors).toHaveBeenCalledWith(errors);
        });
    });

    describe('maxItems', () => {
        const schema: JsonSchemaArray = {
            type: JsonSchemaType.Array,
            maxItems: 1,
        };

        const validValue = [1];
        const invalidValue: ArrayValue = [1, 2];

        const ajvError: ErrorObject = {
            keyword: 'maxItems',
            instancePath: '',
            schemaPath: '#/maxItems',
            params: {limit: 1},
            message: AJV_MESSAGES.maxItems(1),
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

            expect(ajvErrorItems).toEqual([{path: [], error: AJV_MESSAGES.maxItems(1)}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: AJV_MESSAGES.maxItems(1),
            });
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: GLOBAL_ERROR_MESSAGES.maxItems,
            });
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaArray = {
                ...schema,
                entityParameters: {
                    errorMessages: {maxItems: SCHEMA_ERROR_MESSAGES.maxItems},
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
                error: SCHEMA_ERROR_MESSAGES.maxItems,
            });
        });

        // maxItems has no schema, so we can't test this case
        test.skip('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {});

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setErrors).toHaveBeenCalledWith({});
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            const errors = {[FIELD_NAME]: AJV_MESSAGES.maxItems(1)};

            expect(validate(invalidValue, {schema})).toBe('error');
            expect(setErrors).toHaveBeenCalledWith(errors);
        });
    });

    describe('minItems', () => {
        const schema: JsonSchemaArray = {
            type: JsonSchemaType.Array,
            minItems: 2,
        };

        const validValue = [1, 2];
        const invalidValue: ArrayValue = [1];

        const ajvError: ErrorObject = {
            keyword: 'minItems',
            instancePath: '',
            schemaPath: '#/minItems',
            params: {limit: 2},
            message: AJV_MESSAGES.minItems(2),
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

            expect(ajvErrorItems).toEqual([{path: [], error: AJV_MESSAGES.minItems(2)}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: AJV_MESSAGES.minItems(2),
            });
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: GLOBAL_ERROR_MESSAGES.minItems,
            });
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaArray = {
                ...schema,
                entityParameters: {errorMessages: {minItems: SCHEMA_ERROR_MESSAGES.minItems}},
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({
                error: ajvError,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: SCHEMA_ERROR_MESSAGES.minItems,
            });
        });

        // minItems has no schema, so we can't test this case
        test.skip('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {});

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setErrors).toHaveBeenCalledWith({});
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            const errors = {[FIELD_NAME]: AJV_MESSAGES.minItems(2)};

            expect(validate(invalidValue, {schema})).toBe('error');
            expect(setErrors).toHaveBeenCalledWith(errors);
        });
    });

    describe('type', () => {
        const schema: JsonSchemaArray = {
            type: JsonSchemaType.Array,
        };

        const validValue = [1];
        const invalidValue = 'a';

        const ajvError = {
            keyword: 'type',
            instancePath: '',
            schemaPath: '#/type',
            params: {type: JsonSchemaType.Array},
            message: AJV_MESSAGES.typeArray,
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

            expect(ajvErrorItems).toEqual([{path: [], error: AJV_MESSAGES.typeArray}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: AJV_MESSAGES.typeArray,
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
            const schemaWithMessage: JsonSchemaArray = {
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

            const errors = {[FIELD_NAME]: AJV_MESSAGES.typeArray};

            expect(validate(invalidValue, {schema})).toBe('error');
            expect(setErrors).toHaveBeenCalledWith(errors);
        });
    });

    describe('uniqueItems', () => {
        const schema: JsonSchemaArray = {
            type: JsonSchemaType.Array,
            uniqueItems: true,
        };

        const validValue = [1, 2];
        const invalidValue: ArrayValue = [1, 1];

        const ajvError: ErrorObject = {
            keyword: 'uniqueItems',
            instancePath: '',
            schemaPath: '#/uniqueItems',
            params: {i: 1, j: 0},
            message: AJV_MESSAGES.uniqueItems(0, 1),
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

            expect(ajvErrorItems).toEqual([{path: [], error: AJV_MESSAGES.uniqueItems(0, 1)}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: AJV_MESSAGES.uniqueItems(0, 1),
            });
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: GLOBAL_ERROR_MESSAGES.uniqueItems,
            });
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaArray = {
                ...schema,
                entityParameters: {errorMessages: {uniqueItems: SCHEMA_ERROR_MESSAGES.uniqueItems}},
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({
                error: ajvError,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: SCHEMA_ERROR_MESSAGES.uniqueItems,
            });
        });

        // uniqueItems has no schema, so we can't test this case
        test.skip('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {});

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setErrors).toHaveBeenCalledWith({});
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            const errors = {[FIELD_NAME]: AJV_MESSAGES.uniqueItems(0, 1)};

            expect(validate(invalidValue, {schema})).toBe('error');
            expect(setErrors).toHaveBeenCalledWith(errors);
        });
    });
});
