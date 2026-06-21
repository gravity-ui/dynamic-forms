import {JsonSchemaType} from '../../../constants';
import type {JsonSchemaObject} from '../../../types';

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

describe('validate objects', () => {
    describe('additionalProperties (boolean)', () => {
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {a: {type: JsonSchemaType.String}},
            additionalProperties: false,
        };

        const validValue = {a: 'x'};
        const invalidValue = {a: 'x', extra: 1};

        const ajvError = {
            keyword: 'additionalProperties',
            instancePath: '',
            schemaPath: '#/additionalProperties',
            params: {additionalProperty: 'extra'},
            message: AJV_MESSAGES.additionalProperties,
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

            expect(ajvErrorItems).toEqual([{path: [], error: AJV_MESSAGES.additionalProperties}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: AJV_MESSAGES.additionalProperties,
            });
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: GLOBAL_ERROR_MESSAGES.additionalProperties,
            });
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaObject = {
                ...schema,
                entityParameters: {
                    errorMessages: {
                        additionalProperties: SCHEMA_ERROR_MESSAGES.additionalProperties,
                    },
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
                error: SCHEMA_ERROR_MESSAGES.additionalProperties,
            });
        });

        // additionalProperties has no schema, so we can't test this case
        test.skip('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {});

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setErrors).toHaveBeenCalledWith({});
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            const errors = {[FIELD_NAME]: AJV_MESSAGES.additionalProperties};

            expect(validate(invalidValue, {schema})).toEqual('error');
            expect(setErrors).toHaveBeenCalledWith(errors);
        });
    });

    describe('additionalProperties (schema)', () => {
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {a: {type: JsonSchemaType.String}},
            additionalProperties: {type: JsonSchemaType.Number},
        };

        const validValue = {a: 'x', extra: 1};
        const invalidValue = {a: 'x', extra: 'y'};

        const ajvError = {
            keyword: 'type',
            instancePath: '/extra',
            schemaPath: '#/additionalProperties/type',
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

            expect(ajvErrorItems).toEqual([{path: ['extra'], error: AJV_MESSAGES.typeNumber}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({
                path: ['extra'],
                error: AJV_MESSAGES.typeNumber,
            });
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({
                path: ['extra'],
                error: GLOBAL_ERROR_MESSAGES.type,
            });
        });

        // additional properties has no schema by instance path, so we can't test this case
        test.skip('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {});

        test('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {
            const schemaWithKeywordMessage: JsonSchemaObject = {
                ...schema,
                additionalProperties: {
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
                path: ['extra'],
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

            const errors = {[`${FIELD_NAME}.extra`]: AJV_MESSAGES.typeNumber};

            expect(validate(invalidValue, {schema})).toEqual('error');
            expect(setErrors).toHaveBeenCalledWith(errors);
        });
    });

    describe('dependencies (list)', () => {
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {a: {type: JsonSchemaType.String}, b: {type: JsonSchemaType.String}},
            dependencies: {a: ['b']},
        };

        const validValue = {a: 'x', b: 'y'};
        const invalidValue = {a: 'x'};

        const ajvError = {
            keyword: 'dependencies',
            instancePath: '',
            schemaPath: '#/dependencies',
            params: {property: 'a', missingProperty: 'b', depsCount: 1, deps: 'b'},
            message: AJV_MESSAGES.dependencies('b', 'a'),
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

            expect(ajvErrorItems).toEqual([
                {path: ['b'], error: AJV_MESSAGES.dependencies('b', 'a')},
            ]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({
                path: ['b'],
                error: AJV_MESSAGES.dependencies('b', 'a'),
            });
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({
                path: ['b'],
                error: GLOBAL_ERROR_MESSAGES.dependencies,
            });
        });

        // case with error message as a string
        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaObject = {
                ...schema,
                properties: {
                    a: {type: JsonSchemaType.String},
                    b: {
                        type: JsonSchemaType.String,
                        entityParameters: {
                            errorMessages: {dependencies: SCHEMA_ERROR_MESSAGES.dependencies},
                        },
                    },
                },
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({
                error: ajvError,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).toHaveBeenCalledWith({
                path: ['b'],
                error: SCHEMA_ERROR_MESSAGES.dependencies,
            });
        });

        // case with error message as an object
        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaObject = {
                ...schema,
                properties: {
                    a: {type: JsonSchemaType.String},
                    b: {
                        type: JsonSchemaType.String,
                        entityParameters: {
                            errorMessages: {dependencies: {b: SCHEMA_ERROR_MESSAGES.dependencies}},
                        },
                    },
                },
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({
                error: ajvError,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).toHaveBeenCalledWith({
                path: ['b'],
                error: SCHEMA_ERROR_MESSAGES.dependencies,
            });
        });

        // dependencies has same schema path and instance path in this case, so we dont need to test this
        test.skip('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {});

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setErrors).toHaveBeenCalledWith({});
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            const errors = {[`${FIELD_NAME}.b`]: AJV_MESSAGES.dependencies('b', 'a')};

            expect(validate(invalidValue, {schema})).toEqual('error');
            expect(setErrors).toHaveBeenCalledWith(errors);
        });
    });

    describe('dependencies (schema)', () => {
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {a: {type: JsonSchemaType.String}, b: {type: JsonSchemaType.String}},
            dependencies: {a: {properties: {b: {type: JsonSchemaType.String, minLength: 2}}}},
        };

        const validValue = {};
        const invalidValue = {a: 'x', b: 'y'};

        const ajvError = {
            keyword: 'minLength',
            instancePath: '/b',
            schemaPath: '#/dependencies/a/properties/b/minLength',
            params: {limit: 2},
            message: AJV_MESSAGES.minLength(2),
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

            expect(ajvErrorItems).toEqual([{path: ['b'], error: AJV_MESSAGES.minLength(2)}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({
                path: ['b'],
                error: AJV_MESSAGES.minLength(2),
            });
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({
                path: ['b'],
                error: GLOBAL_ERROR_MESSAGES.minLength,
            });
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaObject = {
                ...schema,
                properties: {
                    b: {
                        type: JsonSchemaType.String,
                        entityParameters: {
                            errorMessages: {minLength: SCHEMA_ERROR_MESSAGES.minLength},
                        },
                    },
                },
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({
                error: ajvError,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).toHaveBeenCalledWith({
                path: ['b'],
                error: SCHEMA_ERROR_MESSAGES.minLength,
            });
        });

        test('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {
            const schemaWithKeywordMessage: JsonSchemaObject = {
                ...schema,
                dependencies: {
                    a: {
                        properties: {
                            b: {
                                type: JsonSchemaType.String,
                                minLength: 2,
                                entityParameters: {
                                    errorMessages: {
                                        minLength: KEYWORD_SCHEMA_ERROR_MESSAGES.minLength,
                                    },
                                },
                            },
                        },
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
                path: ['b'],
                error: KEYWORD_SCHEMA_ERROR_MESSAGES.minLength,
            });
        });

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setErrors).toHaveBeenCalledWith({});
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            const errors = {[`${FIELD_NAME}.b`]: AJV_MESSAGES.minLength(2)};

            expect(validate(invalidValue, {schema})).toEqual('error');
            expect(setErrors).toHaveBeenCalledWith(errors);
        });
    });

    describe('maxProperties', () => {
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            maxProperties: 1,
        };
        const validValue = {a: 1};
        const invalidValue = {a: 1, b: 2};

        const ajvError = {
            keyword: 'maxProperties',
            instancePath: '',
            schemaPath: '#/maxProperties',
            params: {limit: 1},
            message: AJV_MESSAGES.maxProperties(1),
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

            expect(ajvErrorItems).toEqual([{path: [], error: AJV_MESSAGES.maxProperties(1)}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({path: [], error: AJV_MESSAGES.maxProperties(1)});
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: GLOBAL_ERROR_MESSAGES.maxProperties,
            });
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaObject = {
                ...schema,
                entityParameters: {
                    errorMessages: {maxProperties: SCHEMA_ERROR_MESSAGES.maxProperties},
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
                error: SCHEMA_ERROR_MESSAGES.maxProperties,
            });
        });

        // maxProperties has no schema, so we can't test this case
        test.skip('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {});

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setErrors).toHaveBeenCalledWith({});
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            const errors = {[FIELD_NAME]: AJV_MESSAGES.maxProperties(1)};

            expect(validate(invalidValue, {schema})).toEqual('error');
            expect(setErrors).toHaveBeenCalledWith(errors);
        });
    });

    describe('minProperties', () => {
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            minProperties: 1,
        };

        const validValue = {a: 1};
        const invalidValue = {};

        const ajvError = {
            keyword: 'minProperties',
            instancePath: '',
            schemaPath: '#/minProperties',
            params: {limit: 1},
            message: AJV_MESSAGES.minProperties(1),
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

            expect(ajvErrorItems).toEqual([{path: [], error: AJV_MESSAGES.minProperties(1)}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({path: [], error: AJV_MESSAGES.minProperties(1)});
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: GLOBAL_ERROR_MESSAGES.minProperties,
            });
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaObject = {
                ...schema,
                entityParameters: {
                    errorMessages: {minProperties: SCHEMA_ERROR_MESSAGES.minProperties},
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
                error: SCHEMA_ERROR_MESSAGES.minProperties,
            });
        });

        // minProperties has no schema, so we can't test this case
        test.skip('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {});

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setErrors).toHaveBeenCalledWith({});
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            const errors = {[FIELD_NAME]: AJV_MESSAGES.minProperties(1)};

            expect(validate(invalidValue, {schema})).toEqual('error');
            expect(setErrors).toHaveBeenCalledWith(errors);
        });
    });

    describe('properties', () => {
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {a: {type: JsonSchemaType.String}},
        };
        const validValue = {a: 'x'};
        const invalidValue = {a: 1};

        const ajvError = {
            keyword: 'type',
            instancePath: '/a',
            schemaPath: '#/properties/a/type',
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

            expect(ajvErrorItems).toEqual([{path: ['a'], error: AJV_MESSAGES.typeString}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({path: ['a'], error: AJV_MESSAGES.typeString});
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({
                path: ['a'],
                error: GLOBAL_ERROR_MESSAGES.type,
            });
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaObject = {
                ...schema,
                properties: {
                    a: {
                        type: JsonSchemaType.String,
                        entityParameters: {errorMessages: {type: SCHEMA_ERROR_MESSAGES.type}},
                    },
                },
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({
                error: ajvError,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).toHaveBeenCalledWith({
                path: ['a'],
                error: SCHEMA_ERROR_MESSAGES.type,
            });
        });

        // properties has same schema path and instance path in this case, so we dont need to test this
        test.skip('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {});

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setErrors).toHaveBeenCalledWith({});
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            const errors = {[`${FIELD_NAME}.a`]: AJV_MESSAGES.typeString};

            expect(validate(invalidValue, {schema})).toEqual('error');
            expect(setErrors).toHaveBeenCalledWith(errors);
        });
    });

    describe('propertyNames', () => {
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            propertyNames: {pattern: '^[a-z]+$'},
        };
        const validValue = {a: 1};
        const invalidValue = {A: 1};

        const ajvError1 = {
            keyword: 'pattern',
            instancePath: '',
            schemaPath: '#/propertyNames/pattern',
            params: {pattern: '^[a-z]+$'},
            message: AJV_MESSAGES.pattern('^[a-z]+$'),
            propertyName: 'A',
        };
        const ajvError2 = {
            keyword: 'propertyNames',
            instancePath: '',
            schemaPath: '#/propertyNames',
            params: {propertyName: 'A'},
            message: AJV_MESSAGES.propertyNames,
        };
        const ajvErrors = [ajvError1, ajvError2];

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
                {path: ['A'], error: AJV_MESSAGES.pattern('^[a-z]+$')},
                {path: [], error: AJV_MESSAGES.propertyNames},
            ]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError1, errorMessages: {}, schema});
            processAjvError({error: ajvError2, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({
                path: ['A'],
                error: AJV_MESSAGES.pattern('^[a-z]+$'),
            });
            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: AJV_MESSAGES.propertyNames,
            });
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError1, errorMessages: GLOBAL_ERROR_MESSAGES, schema});
            processAjvError({error: ajvError2, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({
                path: ['A'],
                error: GLOBAL_ERROR_MESSAGES.pattern,
            });
            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: GLOBAL_ERROR_MESSAGES.propertyNames,
            });
        });

        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaObject = {
                ...schema,
                entityParameters: {
                    errorMessages: {
                        propertyNames: SCHEMA_ERROR_MESSAGES.propertyNames,
                    },
                },
            };
            const {processAjvError, onError} = createProcessAjvError();

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

            // propertyNames has no schema in properties, so it resolves global error message
            expect(onError).toHaveBeenCalledWith({
                path: ['A'],
                error: GLOBAL_ERROR_MESSAGES.pattern,
            });
            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: SCHEMA_ERROR_MESSAGES.propertyNames,
            });
        });

        test('processAjvError: a message from the keyword schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {
            const schemaWithKeywordMessage: JsonSchemaObject = {
                ...schema,
                propertyNames: {
                    pattern: '^[a-z]+$',
                    entityParameters: {
                        errorMessages: {pattern: KEYWORD_SCHEMA_ERROR_MESSAGES.pattern},
                    },
                },
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({
                error: ajvError1,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithKeywordMessage,
            });
            processAjvError({
                error: ajvError2,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithKeywordMessage,
            });

            expect(onError).toHaveBeenCalledWith({
                path: ['A'],
                error: KEYWORD_SCHEMA_ERROR_MESSAGES.pattern,
            });
            // propertyNames schme path is the same as instance path, so it resolves global error message
            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: GLOBAL_ERROR_MESSAGES.propertyNames,
            });
        });

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setErrors).toHaveBeenCalledWith({});
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            const errors = {
                [FIELD_NAME]: AJV_MESSAGES.propertyNames,
                [`${FIELD_NAME}.A`]: AJV_MESSAGES.pattern('^[a-z]+$'),
            };

            expect(validate(invalidValue, {schema})).toEqual('error');
            expect(setErrors).toHaveBeenCalledWith(errors);
        });
    });

    describe('required', () => {
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {a: {type: JsonSchemaType.Number}},
            required: ['a'],
        };
        const validValue = {a: 1};
        const invalidValue = {};

        const ajvError = {
            keyword: 'required',
            instancePath: '',
            schemaPath: '#/required',
            params: {missingProperty: 'a'},
            message: AJV_MESSAGES.required('a'),
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

            expect(ajvErrorItems).toEqual([{path: ['a'], error: AJV_MESSAGES.required('a')}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({path: ['a'], error: AJV_MESSAGES.required('a')});
        });

        test('processAjvError: a global error message takes precedence over the ajv text', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: GLOBAL_ERROR_MESSAGES, schema});

            expect(onError).toHaveBeenCalledWith({
                path: ['a'],
                error: GLOBAL_ERROR_MESSAGES.required,
            });
        });

        // by instancePath we resolve child schema
        test('processAjvError: a message from the instance schema entityParameters takes precedence over the ajv text and global error messages (by instancePath)', () => {
            const schemaWithMessage: JsonSchemaObject = {
                ...schema,
                properties: {
                    a: {
                        type: JsonSchemaType.Number,
                        entityParameters: {
                            errorMessages: {required: SCHEMA_ERROR_MESSAGES.required},
                        },
                    },
                },
            };
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({
                error: ajvError,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).toHaveBeenCalledWith({
                path: ['a'],
                error: SCHEMA_ERROR_MESSAGES.required,
            });
        });

        // by schemaPath we resolve parent schema, case with error message as a string
        test('processAjvError: a message from the parent schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {
            const schemaWithMessage: JsonSchemaObject = {
                ...schema,
                entityParameters: {
                    errorMessages: {required: SCHEMA_ERROR_MESSAGES.required},
                },
            };

            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({
                error: ajvError,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).toHaveBeenCalledWith({
                path: ['a'],
                error: SCHEMA_ERROR_MESSAGES.required,
            });
        });

        // by schemaPath we resolve parent schema, case with error message as an object
        test('processAjvError: a message from the parent schema entityParameters takes precedence over the ajv text, global error messages, and instance schema entityParameters (by schemaPath)', () => {
            const schemaWithMessage: JsonSchemaObject = {
                ...schema,
                entityParameters: {
                    errorMessages: {required: {a: SCHEMA_ERROR_MESSAGES.required}},
                },
            };

            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({
                error: ajvError,
                errorMessages: GLOBAL_ERROR_MESSAGES,
                schema: schemaWithMessage,
            });

            expect(onError).toHaveBeenCalledWith({
                path: ['a'],
                error: SCHEMA_ERROR_MESSAGES.required,
            });
        });

        test('validate: a valid value is not flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            expect(validate(validValue, {schema})).toBe(false);
            expect(setErrors).toHaveBeenCalledWith({});
        });

        test('validate: an invalid value is flagged as an error', () => {
            const {validate, setErrors} = createValidate();

            const errors = {[`${FIELD_NAME}.a`]: AJV_MESSAGES.required('a')};

            expect(validate(invalidValue, {schema})).toEqual('error');
            expect(setErrors).toHaveBeenCalledWith(errors);
        });
    });

    describe('type', () => {
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
        };

        const validValue = {};
        const invalidValue = 'a';

        const ajvError = {
            keyword: 'type',
            instancePath: '',
            schemaPath: '#/type',
            params: {type: JsonSchemaType.Object},
            message: AJV_MESSAGES.typeObject,
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

            expect(ajvErrorItems).toEqual([{path: [], error: AJV_MESSAGES.typeObject}]);
            expect(entityParametersErrorItems).toEqual([]);
            expect(waiters).toEqual({});
        });

        test('processAjvError: with no custom messages the ajv text is used', () => {
            const {processAjvError, onError} = createProcessAjvError();

            processAjvError({error: ajvError, errorMessages: {}, schema});

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: AJV_MESSAGES.typeObject,
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
            const schemaWithMessage: JsonSchemaObject = {
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

            const errors = {[FIELD_NAME]: AJV_MESSAGES.typeObject};

            expect(validate(invalidValue, {schema})).toEqual('error');
            expect(setErrors).toHaveBeenCalledWith(errors);
        });
    });
});
