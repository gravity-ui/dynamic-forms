import Ajv from 'ajv';

import {JsonSchemaType} from '../../../constants';
import type {
    ArrayValue,
    JsonSchemaArray,
    JsonSchemaBoolean,
    JsonSchemaNumber,
    JsonSchemaObject,
    JsonSchemaString,
    ObjectValue,
} from '../../../types';
import {processAjvError} from '../process-ajv-error';

const ajv = new Ajv({
    allErrors: true,
    allowMatchingProperties: true,
});

describe('SchemaRendererServiceField/utils/process-ajv-error', () => {
    describe('with type array schema', () => {
        const mainSchema: JsonSchemaArray = {type: JsonSchemaType.Array};
        const errorMessages = {type: 'type error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/type',
            keyword: 'type',
            params: {
                type: 'array',
            },
            message: 'must be array',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = 'not array';
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.type,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const typeErrorMessage = 'type error from schema entity parameters';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                entityParameters: {
                    errorMessages: {
                        type: typeErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: typeErrorMessage,
            });
        });
    });

    describe('with boolean contains array schema', () => {
        const mainSchema: JsonSchemaArray = {
            type: JsonSchemaType.Array,
            contains: true,
        };
        const errorMessages = {contains: 'boolean contains error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/contains',
            keyword: 'contains',
            params: {
                minContains: 1,
            },
            message: 'must contain at least 1 valid item(s)',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value: ArrayValue = [];
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.contains,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const containsErrorMessage = 'boolean contains error from schema entity parameters';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                entityParameters: {
                    errorMessages: {
                        contains: containsErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: containsErrorMessage,
            });
        });
    });

    describe('with schema contains array schema', () => {
        const mainSchema: JsonSchemaArray = {
            type: JsonSchemaType.Array,
            contains: {type: JsonSchemaType.Number},
        };
        const errorMessages = {contains: 'schema contains error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/contains',
            keyword: 'contains',
            params: {
                minContains: 1,
            },
            message: 'must contain at least 1 valid item(s)',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value: ArrayValue = [];
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.contains,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const containsErrorMessage = 'schema contains error from schema entity parameters';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                entityParameters: {
                    errorMessages: {
                        contains: containsErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: containsErrorMessage,
            });
        });
    });

    describe('with max items array schema', () => {
        const mainSchema: JsonSchemaArray = {
            type: JsonSchemaType.Array,
            maxItems: 0,
        };
        const errorMessages = {maxItems: 'max items error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/maxItems',
            keyword: 'maxItems',
            params: {
                limit: 0,
            },
            message: 'must NOT have more than 0 items',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value: ArrayValue = [''];
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.maxItems,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const maxItemsErrorMessage = 'max items error from schema entity parameters';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                entityParameters: {
                    errorMessages: {
                        maxItems: maxItemsErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: maxItemsErrorMessage,
            });
        });
    });

    describe('with min items array schema', () => {
        const mainSchema: JsonSchemaArray = {
            type: JsonSchemaType.Array,
            minItems: 1,
        };
        const errorMessages = {minItems: 'min items error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/minItems',
            keyword: 'minItems',
            params: {
                limit: 1,
            },
            message: 'must NOT have fewer than 1 items',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value: ArrayValue = [];
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.minItems,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const minItemsErrorMessage = 'min items error from schema entity parameters';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                entityParameters: {
                    errorMessages: {
                        minItems: minItemsErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: minItemsErrorMessage,
            });
        });
    });

    describe('with unique items array schema', () => {
        const mainSchema: JsonSchemaArray = {
            type: JsonSchemaType.Array,
            uniqueItems: true,
        };
        const errorMessages = {uniqueItems: 'unique items error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/uniqueItems',
            keyword: 'uniqueItems',
            params: {
                i: 1,
                j: 0,
            },
            message: 'must NOT have duplicate items (items ## 0 and 1 are identical)',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value: ArrayValue = ['', ''];
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.uniqueItems,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const uniqueItemsErrorMessage = 'unique items error from schema entity parameters';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                entityParameters: {
                    errorMessages: {
                        uniqueItems: uniqueItemsErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: uniqueItemsErrorMessage,
            });
        });
    });

    describe('with all of array schema', () => {
        const mainSchema: JsonSchemaArray = {
            type: JsonSchemaType.Array,
            allOf: [{type: JsonSchemaType.Array, const: ['value']}],
        };
        const errorMessages = {const: 'const(by all of) error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/allOf/0/const',
            keyword: 'const',
            params: {
                allowedValue: ['value'],
            },
            message: 'must be equal to constant',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value: ArrayValue = [];
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.const,
            });
        });

        it('should call onError with message from schema entity parameters by schema path', () => {
            const allOfConstErrorMessage =
                'const(by all of, by schema path) error from schema entity parameters';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                allOf: [
                    {
                        type: JsonSchemaType.Array,
                        const: ['value'],
                        entityParameters: {
                            errorMessages: {
                                const: allOfConstErrorMessage,
                            },
                        },
                    },
                ],
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: allOfConstErrorMessage,
            });
        });

        it('should call onError with message from schema entity parameters by instance path', () => {
            const allOfConstErrorMessage =
                'const(by all of, by instance path) error from schema entity parameters';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                entityParameters: {
                    errorMessages: {
                        const: allOfConstErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: allOfConstErrorMessage,
            });
        });
    });

    describe('with any of array schema', () => {
        const mainSchema: JsonSchemaArray = {
            type: JsonSchemaType.Array,
            anyOf: [{type: JsonSchemaType.Array, const: ['value']}],
        };
        const errorMessages = {anyOf: 'any of error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/anyOf',
            keyword: 'anyOf',
            params: {},
            message: 'must match a schema in anyOf',
        };
        const errors = [
            {
                instancePath: '',
                schemaPath: '#/anyOf/0/const',
                keyword: 'const',
                params: {
                    allowedValue: ['value'],
                },
                message: 'must be equal to constant',
            },
            error,
        ];
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value: ArrayValue = [];
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual(errors);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.anyOf,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const anyOfErrorMessage = 'any of error from schema entity parameters';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                entityParameters: {
                    errorMessages: {
                        anyOf: anyOfErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: anyOfErrorMessage,
            });
        });
    });

    describe('with const array schema', () => {
        const mainSchema: JsonSchemaArray = {
            type: JsonSchemaType.Array,
            const: ['value'],
        };
        const errorMessages = {const: 'const error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/const',
            keyword: 'const',
            params: {
                allowedValue: ['value'],
            },
            message: 'must be equal to constant',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value: ArrayValue = [];
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.const,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const constErrorMessage = 'const error from schema entity parameters';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                entityParameters: {
                    errorMessages: {
                        const: constErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: constErrorMessage,
            });
        });
    });

    describe('with if then array schema', () => {
        const mainSchema: JsonSchemaArray = {
            type: JsonSchemaType.Array,
            if: {type: JsonSchemaType.Array, const: ['']},
            then: {type: JsonSchemaType.Array, const: ['value']},
        };
        const errorMessages = {then: 'if then error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/if',
            keyword: 'if',
            params: {
                failingKeyword: 'then',
            },
            message: 'must match "then" schema',
        };
        const errors = [
            {
                instancePath: '',
                schemaPath: '#/then/const',
                keyword: 'const',
                params: {
                    allowedValue: ['value'],
                },
                message: 'must be equal to constant',
            },
            error,
        ];
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value: ArrayValue = [''];
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual(errors);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.then,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const ifThenErrorMessage = 'if then error from schema entity parameters';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                entityParameters: {
                    errorMessages: {
                        then: ifThenErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: ifThenErrorMessage,
            });
        });
    });

    describe('with if else array schema', () => {
        const mainSchema: JsonSchemaArray = {
            type: JsonSchemaType.Array,
            if: {type: JsonSchemaType.Array, const: ['value']},
            else: {type: JsonSchemaType.Array, const: ['value']},
        };
        const errorMessages = {else: 'if else error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/if',
            keyword: 'if',
            params: {
                failingKeyword: 'else',
            },
            message: 'must match "else" schema',
        };
        const errors = [
            {
                instancePath: '',
                schemaPath: '#/else/const',
                keyword: 'const',
                params: {
                    allowedValue: ['value'],
                },
                message: 'must be equal to constant',
            },
            error,
        ];
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value: ArrayValue = [''];
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual(errors);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.else,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const ifElseErrorMessage = 'if else error from schema entity parameters';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                entityParameters: {
                    errorMessages: {
                        else: ifElseErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: ifElseErrorMessage,
            });
        });
    });

    describe('with enum array schema', () => {
        const mainSchema: JsonSchemaArray = {type: JsonSchemaType.Array, enum: [['value']]};
        const errorMessages = {enum: 'enum error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/enum',
            keyword: 'enum',
            params: {
                allowedValues: [['value']],
            },
            message: 'must be equal to one of the allowed values',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value: ArrayValue = [''];
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.enum,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const enumErrorMessage = 'enum error from schema entity parameters';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                entityParameters: {
                    errorMessages: {
                        enum: enumErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: enumErrorMessage,
            });
        });
    });

    describe('with not array schema', () => {
        const mainSchema: JsonSchemaArray = {
            type: JsonSchemaType.Array,
            not: {type: JsonSchemaType.Array, const: ['value']},
        };
        const errorMessages = {not: 'not error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/not',
            keyword: 'not',
            params: {},
            message: 'must NOT be valid',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value: ArrayValue = ['value'];
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.not,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const notErrorMessage = 'not error from schema entity parameters';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                entityParameters: {
                    errorMessages: {
                        not: notErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: notErrorMessage,
            });
        });
    });

    describe('with one of array schema', () => {
        const mainSchema: JsonSchemaArray = {
            type: JsonSchemaType.Array,
            oneOf: [{type: JsonSchemaType.Array, const: ['value']}],
        };
        const errorMessages = {oneOf: 'one of error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/oneOf',
            keyword: 'oneOf',
            params: {
                passingSchemas: null,
            },
            message: 'must match exactly one schema in oneOf',
        };
        const errors = [
            {
                instancePath: '',
                schemaPath: '#/oneOf/0/const',
                keyword: 'const',
                params: {
                    allowedValue: ['value'],
                },
                message: 'must be equal to constant',
            },
            error,
        ];
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value: ArrayValue = [''];
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual(errors);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.oneOf,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const oneOfErrorMessage = 'one of error from schema entity parameters';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                entityParameters: {
                    errorMessages: {
                        oneOf: oneOfErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: oneOfErrorMessage,
            });
        });
    });

    describe('with type boolean schema', () => {
        const mainSchema: JsonSchemaBoolean = {type: JsonSchemaType.Boolean};
        const errorMessages = {type: 'type error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/type',
            keyword: 'type',
            params: {
                type: 'boolean',
            },
            message: 'must be boolean',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = 'not boolean';
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.type,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const typeErrorMessage = 'type error from schema entity parameters';
            const schema: JsonSchemaBoolean = {
                type: JsonSchemaType.Boolean,
                entityParameters: {
                    errorMessages: {
                        type: typeErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: typeErrorMessage,
            });
        });
    });

    describe('with all of boolean schema', () => {
        const mainSchema: JsonSchemaBoolean = {
            type: JsonSchemaType.Boolean,
            allOf: [{type: JsonSchemaType.Boolean, const: true}],
        };
        const errorMessages = {const: 'const(by all of) error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/allOf/0/const',
            keyword: 'const',
            params: {
                allowedValue: true,
            },
            message: 'must be equal to constant',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = false;
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.const,
            });
        });

        it('should call onError with message from schema entity parameters by schema path', () => {
            const allOfConstErrorMessage =
                'const(by all of, by schema path) error from schema entity parameters';
            const schema: JsonSchemaBoolean = {
                type: JsonSchemaType.Boolean,
                allOf: [
                    {
                        type: JsonSchemaType.Boolean,
                        const: true,
                        entityParameters: {
                            errorMessages: {
                                const: allOfConstErrorMessage,
                            },
                        },
                    },
                ],
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: allOfConstErrorMessage,
            });
        });

        it('should call onError with message from schema entity parameters by instance path', () => {
            const allOfConstErrorMessage =
                'const(by all of, by instance path) error from schema entity parameters';
            const schema: JsonSchemaBoolean = {
                type: JsonSchemaType.Boolean,
                entityParameters: {
                    errorMessages: {
                        const: allOfConstErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: allOfConstErrorMessage,
            });
        });
    });

    describe('with any of boolean schema', () => {
        const mainSchema: JsonSchemaBoolean = {
            type: JsonSchemaType.Boolean,
            anyOf: [{type: JsonSchemaType.Boolean, const: true}],
        };
        const errorMessages = {anyOf: 'any of error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/anyOf',
            keyword: 'anyOf',
            params: {},
            message: 'must match a schema in anyOf',
        };
        const errors = [
            {
                instancePath: '',
                schemaPath: '#/anyOf/0/const',
                keyword: 'const',
                params: {
                    allowedValue: true,
                },
                message: 'must be equal to constant',
            },
            error,
        ];
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = false;
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual(errors);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.anyOf,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const anyOfErrorMessage = 'any of error from schema entity parameters';
            const schema: JsonSchemaBoolean = {
                type: JsonSchemaType.Boolean,
                entityParameters: {
                    errorMessages: {
                        anyOf: anyOfErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: anyOfErrorMessage,
            });
        });
    });

    describe('with const boolean schema', () => {
        const mainSchema: JsonSchemaBoolean = {type: JsonSchemaType.Boolean, const: true};
        const errorMessages = {const: 'const error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/const',
            keyword: 'const',
            params: {
                allowedValue: true,
            },
            message: 'must be equal to constant',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = false;
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.const,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const constErrorMessage = 'const error from schema entity parameters';
            const schema: JsonSchemaBoolean = {
                type: JsonSchemaType.Boolean,
                entityParameters: {
                    errorMessages: {
                        const: constErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: constErrorMessage,
            });
        });
    });

    describe('with if then boolean schema', () => {
        const mainSchema: JsonSchemaBoolean = {
            type: JsonSchemaType.Boolean,
            if: {type: JsonSchemaType.Boolean, const: false},
            then: {type: JsonSchemaType.Boolean, const: true},
        };
        const errorMessages = {then: 'if then error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/if',
            keyword: 'if',
            params: {
                failingKeyword: 'then',
            },
            message: 'must match "then" schema',
        };
        const errors = [
            {
                instancePath: '',
                schemaPath: '#/then/const',
                keyword: 'const',
                params: {
                    allowedValue: true,
                },
                message: 'must be equal to constant',
            },
            error,
        ];
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = false;
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual(errors);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.then,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const ifThenErrorMessage = 'if then error from schema entity parameters';
            const schema: JsonSchemaBoolean = {
                type: JsonSchemaType.Boolean,
                entityParameters: {
                    errorMessages: {
                        then: ifThenErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: ifThenErrorMessage,
            });
        });
    });

    describe('with if else boolean schema', () => {
        const mainSchema: JsonSchemaBoolean = {
            type: JsonSchemaType.Boolean,
            if: {type: JsonSchemaType.Boolean, const: true},
            else: {type: JsonSchemaType.Boolean, const: true},
        };
        const errorMessages = {else: 'if else error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/if',
            keyword: 'if',
            params: {
                failingKeyword: 'else',
            },
            message: 'must match "else" schema',
        };
        const errors = [
            {
                instancePath: '',
                schemaPath: '#/else/const',
                keyword: 'const',
                params: {
                    allowedValue: true,
                },
                message: 'must be equal to constant',
            },
            error,
        ];
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = false;
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual(errors);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.else,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const ifElseErrorMessage = 'if else error from schema entity parameters';
            const schema: JsonSchemaBoolean = {
                type: JsonSchemaType.Boolean,
                entityParameters: {
                    errorMessages: {
                        else: ifElseErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: ifElseErrorMessage,
            });
        });
    });

    describe('with enum boolean schema', () => {
        const mainSchema: JsonSchemaBoolean = {type: JsonSchemaType.Boolean, enum: [true]};
        const errorMessages = {enum: 'enum error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/enum',
            keyword: 'enum',
            params: {
                allowedValues: [true],
            },
            message: 'must be equal to one of the allowed values',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = false;
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.enum,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const enumErrorMessage = 'enum error from schema entity parameters';
            const schema: JsonSchemaBoolean = {
                type: JsonSchemaType.Boolean,
                entityParameters: {
                    errorMessages: {
                        enum: enumErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: enumErrorMessage,
            });
        });
    });

    describe('with not boolean schema', () => {
        const mainSchema: JsonSchemaBoolean = {
            type: JsonSchemaType.Boolean,
            not: {type: JsonSchemaType.Boolean, const: false},
        };
        const errorMessages = {not: 'not error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/not',
            keyword: 'not',
            params: {},
            message: 'must NOT be valid',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = false;
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.not,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const notErrorMessage = 'not error from schema entity parameters';
            const schema: JsonSchemaBoolean = {
                type: JsonSchemaType.Boolean,
                entityParameters: {
                    errorMessages: {
                        not: notErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: notErrorMessage,
            });
        });
    });

    describe('with one of boolean schema', () => {
        const mainSchema: JsonSchemaBoolean = {
            type: JsonSchemaType.Boolean,
            oneOf: [{type: JsonSchemaType.Boolean, const: true}],
        };
        const errorMessages = {oneOf: 'one of error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/oneOf',
            keyword: 'oneOf',
            params: {
                passingSchemas: null,
            },
            message: 'must match exactly one schema in oneOf',
        };
        const errors = [
            {
                instancePath: '',
                schemaPath: '#/oneOf/0/const',
                keyword: 'const',
                params: {
                    allowedValue: true,
                },
                message: 'must be equal to constant',
            },
            error,
        ];
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = false;
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual(errors);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.oneOf,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const oneOfErrorMessage = 'one of error from schema entity parameters';
            const schema: JsonSchemaBoolean = {
                type: JsonSchemaType.Boolean,
                entityParameters: {
                    errorMessages: {
                        oneOf: oneOfErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: oneOfErrorMessage,
            });
        });
    });

    describe('with type number schema', () => {
        const mainSchema: JsonSchemaNumber = {type: JsonSchemaType.Number};
        const errorMessages = {type: 'type error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/type',
            keyword: 'type',
            params: {
                type: 'number',
            },
            message: 'must be number',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = 'not number';
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.type,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const typeErrorMessage = 'type error from schema entity parameters';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                entityParameters: {
                    errorMessages: {
                        type: typeErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: typeErrorMessage,
            });
        });
    });

    describe('with exclusive maximum number schema', () => {
        const mainSchema: JsonSchemaNumber = {
            type: JsonSchemaType.Number,
            exclusiveMaximum: 1,
        };
        const errorMessages = {exclusiveMaximum: 'exclusive maximum error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/exclusiveMaximum',
            keyword: 'exclusiveMaximum',
            params: {
                comparison: '<',
                limit: 1,
            },
            message: 'must be < 1',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = 1;
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.exclusiveMaximum,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const exclusiveMaximumErrorMessage =
                'exclusive maximum error from schema entity parameters';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                entityParameters: {
                    errorMessages: {
                        exclusiveMaximum: exclusiveMaximumErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: exclusiveMaximumErrorMessage,
            });
        });
    });

    describe('with exclusive minimum number schema', () => {
        const mainSchema: JsonSchemaNumber = {
            type: JsonSchemaType.Number,
            exclusiveMinimum: 1,
        };
        const errorMessages = {exclusiveMinimum: 'exclusive minimum error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/exclusiveMinimum',
            keyword: 'exclusiveMinimum',
            params: {
                comparison: '>',
                limit: 1,
            },
            message: 'must be > 1',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = 1;
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.exclusiveMinimum,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const exclusiveMinimumErrorMessage =
                'exclusive minimum error from schema entity parameters';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                entityParameters: {
                    errorMessages: {
                        exclusiveMinimum: exclusiveMinimumErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: exclusiveMinimumErrorMessage,
            });
        });
    });

    describe('with maximum number schema', () => {
        const mainSchema: JsonSchemaNumber = {
            type: JsonSchemaType.Number,
            maximum: 1,
        };
        const errorMessages = {maximum: 'maximum error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/maximum',
            keyword: 'maximum',
            params: {
                comparison: '<=',
                limit: 1,
            },
            message: 'must be <= 1',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = 2;
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.maximum,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const maximumErrorMessage = 'maximum error from schema entity parameters';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                entityParameters: {
                    errorMessages: {
                        maximum: maximumErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: maximumErrorMessage,
            });
        });
    });

    describe('with minimum number schema', () => {
        const mainSchema: JsonSchemaNumber = {
            type: JsonSchemaType.Number,
            minimum: 1,
        };
        const errorMessages = {minimum: 'minimum error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/minimum',
            keyword: 'minimum',
            params: {
                comparison: '>=',
                limit: 1,
            },
            message: 'must be >= 1',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = 0;
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.minimum,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const minimumErrorMessage = 'minimum error from schema entity parameters';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                entityParameters: {
                    errorMessages: {
                        minimum: minimumErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: minimumErrorMessage,
            });
        });
    });

    describe('with multiple of number schema', () => {
        const mainSchema: JsonSchemaNumber = {
            type: JsonSchemaType.Number,
            multipleOf: 2,
        };
        const errorMessages = {multipleOf: 'multiple of error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/multipleOf',
            keyword: 'multipleOf',
            params: {
                multipleOf: 2,
            },
            message: 'must be multiple of 2',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = 1;
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.multipleOf,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const multipleOfErrorMessage = 'multiple of error from schema entity parameters';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                entityParameters: {
                    errorMessages: {
                        multipleOf: multipleOfErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: multipleOfErrorMessage,
            });
        });
    });

    describe('with all of number schema', () => {
        const mainSchema: JsonSchemaNumber = {
            type: JsonSchemaType.Number,
            allOf: [{type: JsonSchemaType.Number, const: 1}],
        };
        const errorMessages = {const: 'const(by all of) error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/allOf/0/const',
            keyword: 'const',
            params: {
                allowedValue: 1,
            },
            message: 'must be equal to constant',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = 0;
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.const,
            });
        });

        it('should call onError with message from schema entity parameters by schema path', () => {
            const allOfConstErrorMessage =
                'const(by all of, by schema path) error from schema entity parameters';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                allOf: [
                    {
                        type: JsonSchemaType.Number,
                        const: 1,
                        entityParameters: {
                            errorMessages: {
                                const: allOfConstErrorMessage,
                            },
                        },
                    },
                ],
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: allOfConstErrorMessage,
            });
        });

        it('should call onError with message from schema entity parameters by instance path', () => {
            const allOfConstErrorMessage =
                'const(by all of, by instance path) error from schema entity parameters';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                entityParameters: {
                    errorMessages: {
                        const: allOfConstErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: allOfConstErrorMessage,
            });
        });
    });

    describe('with any of number schema', () => {
        const mainSchema: JsonSchemaNumber = {
            type: JsonSchemaType.Number,
            anyOf: [{type: JsonSchemaType.Number, const: 1}],
        };
        const errorMessages = {anyOf: 'any of error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/anyOf',
            keyword: 'anyOf',
            params: {},
            message: 'must match a schema in anyOf',
        };
        const errors = [
            {
                instancePath: '',
                schemaPath: '#/anyOf/0/const',
                keyword: 'const',
                params: {
                    allowedValue: 1,
                },
                message: 'must be equal to constant',
            },
            error,
        ];
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = 0;
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual(errors);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.anyOf,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const anyOfErrorMessage = 'any of error from schema entity parameters';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                entityParameters: {
                    errorMessages: {
                        anyOf: anyOfErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: anyOfErrorMessage,
            });
        });
    });

    describe('with const number schema', () => {
        const mainSchema: JsonSchemaNumber = {type: JsonSchemaType.Number, const: 1};
        const errorMessages = {const: 'const error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/const',
            keyword: 'const',
            params: {
                allowedValue: 1,
            },
            message: 'must be equal to constant',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = 0;
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.const,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const constErrorMessage = 'const error from schema entity parameters';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                entityParameters: {
                    errorMessages: {
                        const: constErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: constErrorMessage,
            });
        });
    });

    describe('with if then number schema', () => {
        const mainSchema: JsonSchemaNumber = {
            type: JsonSchemaType.Number,
            if: {type: JsonSchemaType.Number, const: 1},
            then: {type: JsonSchemaType.Number, const: 2},
        };
        const errorMessages = {then: 'if then error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/if',
            keyword: 'if',
            params: {
                failingKeyword: 'then',
            },
            message: 'must match "then" schema',
        };
        const errors = [
            {
                instancePath: '',
                schemaPath: '#/then/const',
                keyword: 'const',
                params: {
                    allowedValue: 2,
                },
                message: 'must be equal to constant',
            },
            error,
        ];
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = 1;
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual(errors);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.then,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const ifThenErrorMessage = 'if then error from schema entity parameters';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                entityParameters: {
                    errorMessages: {
                        then: ifThenErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: ifThenErrorMessage,
            });
        });
    });

    describe('with if else number schema', () => {
        const mainSchema: JsonSchemaNumber = {
            type: JsonSchemaType.Number,
            if: {type: JsonSchemaType.Number, const: 1},
            else: {type: JsonSchemaType.Number, const: 2},
        };
        const errorMessages = {else: 'if else error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/if',
            keyword: 'if',
            params: {
                failingKeyword: 'else',
            },
            message: 'must match "else" schema',
        };
        const errors = [
            {
                instancePath: '',
                schemaPath: '#/else/const',
                keyword: 'const',
                params: {
                    allowedValue: 2,
                },
                message: 'must be equal to constant',
            },
            error,
        ];
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = 0;
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual(errors);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.else,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const ifElseErrorMessage = 'if else error from schema entity parameters';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                entityParameters: {
                    errorMessages: {
                        else: ifElseErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: ifElseErrorMessage,
            });
        });
    });

    describe('with enum number schema', () => {
        const mainSchema: JsonSchemaNumber = {type: JsonSchemaType.Number, enum: [1]};
        const errorMessages = {enum: 'enum error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/enum',
            keyword: 'enum',
            params: {
                allowedValues: [1],
            },
            message: 'must be equal to one of the allowed values',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = 0;
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.enum,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const enumErrorMessage = 'enum error from schema entity parameters';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                entityParameters: {
                    errorMessages: {
                        enum: enumErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: enumErrorMessage,
            });
        });
    });

    describe('with not number schema', () => {
        const mainSchema: JsonSchemaNumber = {
            type: JsonSchemaType.Number,
            not: {type: JsonSchemaType.Number, const: 1},
        };
        const errorMessages = {not: 'not error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/not',
            keyword: 'not',
            params: {},
            message: 'must NOT be valid',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = 1;
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.not,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const notErrorMessage = 'not error from schema entity parameters';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                entityParameters: {
                    errorMessages: {
                        not: notErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: notErrorMessage,
            });
        });
    });

    describe('with one of number schema', () => {
        const mainSchema: JsonSchemaNumber = {
            type: JsonSchemaType.Number,
            oneOf: [{type: JsonSchemaType.Number, const: 1}],
        };
        const errorMessages = {oneOf: 'one of error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/oneOf',
            keyword: 'oneOf',
            params: {
                passingSchemas: null,
            },
            message: 'must match exactly one schema in oneOf',
        };
        const errors = [
            {
                instancePath: '',
                schemaPath: '#/oneOf/0/const',
                keyword: 'const',
                params: {
                    allowedValue: 1,
                },
                message: 'must be equal to constant',
            },
            error,
        ];
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = 0;
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual(errors);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.oneOf,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const oneOfErrorMessage = 'one of error from schema entity parameters';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                entityParameters: {
                    errorMessages: {
                        oneOf: oneOfErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: oneOfErrorMessage,
            });
        });
    });

    describe('with type object schema', () => {
        const mainSchema: JsonSchemaObject = {type: JsonSchemaType.Object};
        const errorMessages = {type: 'type error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/type',
            keyword: 'type',
            params: {
                type: 'object',
            },
            message: 'must be object',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = 'not object';
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.type,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const typeErrorMessage = 'type error from schema entity parameters';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                entityParameters: {
                    errorMessages: {
                        type: typeErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: typeErrorMessage,
            });
        });
    });

    describe('with boolean additional properties object schema', () => {
        const mainSchema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            additionalProperties: false,
        };
        const errorMessages = {
            additionalProperties: 'boolean additional properties error from error messages',
        };
        const error = {
            instancePath: '',
            schemaPath: '#/additionalProperties',
            keyword: 'additionalProperties',
            params: {
                additionalProperty: 'additional',
            },
            message: 'must NOT have additional properties',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value: ObjectValue = {additional: 'value'};
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.additionalProperties,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const additionalPropertiesErrorMessage =
                'boolean additional properties error from schema entity parameters';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                entityParameters: {
                    errorMessages: {
                        additionalProperties: additionalPropertiesErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: additionalPropertiesErrorMessage,
            });
        });
    });

    describe('with schema additional properties object schema', () => {
        const mainSchema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            additionalProperties: {type: JsonSchemaType.Number},
        };
        const errorMessages = {
            type: 'type(by schema additional properties) error from error messages',
        };
        const error = {
            instancePath: '/additional',
            schemaPath: '#/additionalProperties/type',
            keyword: 'type',
            params: {
                type: 'number',
            },
            message: 'must be number',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value: ObjectValue = {additional: 'value'};
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: ['additional'],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: ['additional'],
                error: errorMessages.type,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const additionalPropertiesTypeErrorMessage =
                'type(by schema additional properties) error from schema entity parameters';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                additionalProperties: {
                    type: JsonSchemaType.Number,
                    entityParameters: {
                        errorMessages: {
                            type: additionalPropertiesTypeErrorMessage,
                        },
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: ['additional'],
                error: additionalPropertiesTypeErrorMessage,
            });
        });
    });

    describe('with string dependencies properties object schema', () => {
        const mainSchema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {
                first: {type: JsonSchemaType.String},
                second: {type: JsonSchemaType.String},
            },
            dependencies: {
                second: ['first'],
            },
        };
        const errorMessages = {
            dependencies: 'string dependencies error from error messages',
        };
        const error = {
            instancePath: '',
            schemaPath: '#/dependencies',
            keyword: 'dependencies',
            params: {
                property: 'second',
                missingProperty: 'first',
                depsCount: 1,
                deps: 'first',
            },
            message: 'must have property first when property second is present',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value: ObjectValue = {second: ''};
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: ['first'],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: ['first'],
                error: errorMessages.dependencies,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const dependenciesErrorMessage =
                'string dependencies error from schema entity parameters';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                entityParameters: {
                    errorMessages: {
                        dependencies: dependenciesErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: ['first'],
                error: dependenciesErrorMessage,
            });
        });
    });

    describe('with schema dependencies properties object schema', () => {
        const mainSchema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {
                first: {type: JsonSchemaType.String},
                second: {type: JsonSchemaType.String},
            },
            dependencies: {
                second: {
                    type: JsonSchemaType.Object,
                    properties: {
                        first: {
                            type: JsonSchemaType.String,
                            const: 'value',
                        },
                    },
                },
            },
        };
        const errorMessages = {
            const: 'const(by schema dependencies) error from error messages',
        };
        const error = {
            instancePath: '/first',
            schemaPath: '#/dependencies/second/properties/first/const',
            keyword: 'const',
            params: {
                allowedValue: 'value',
            },
            message: 'must be equal to constant',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value: ObjectValue = {first: '', second: ''};
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: ['first'],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: ['first'],
                error: errorMessages.const,
            });
        });

        it('should call onError with message from schema entity parameters by instance path', () => {
            const constErrorMessage = 'const error from schema entity parameters';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {
                    first: {
                        type: JsonSchemaType.String,
                        entityParameters: {errorMessages: {const: constErrorMessage}},
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: ['first'],
                error: constErrorMessage,
            });
        });

        it('should call onError with message from schema entity parameters by schema path', () => {
            const dependenciesConstErrorMessage =
                'const(by schema dependencies) error from schema entity parameters';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                dependencies: {
                    second: {
                        type: JsonSchemaType.Object,
                        properties: {
                            first: {
                                type: JsonSchemaType.String,
                                const: 'value',
                                entityParameters: {
                                    errorMessages: {
                                        const: dependenciesConstErrorMessage,
                                    },
                                },
                            },
                        },
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: ['first'],
                error: dependenciesConstErrorMessage,
            });
        });
    });

    describe('with max properties object schema', () => {
        const mainSchema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            maxProperties: 0,
        };
        const errorMessages = {maxProperties: 'max properties error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/maxProperties',
            keyword: 'maxProperties',
            params: {
                limit: 0,
            },
            message: 'must NOT have more than 0 properties',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value: ObjectValue = {first: ''};
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.maxProperties,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const maxPropertiesErrorMessage = 'max properties error from schema entity parameters';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                entityParameters: {
                    errorMessages: {
                        maxProperties: maxPropertiesErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: maxPropertiesErrorMessage,
            });
        });
    });

    describe('with min properties object schema', () => {
        const mainSchema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            minProperties: 1,
        };
        const errorMessages = {minProperties: 'min properties error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/minProperties',
            keyword: 'minProperties',
            params: {
                limit: 1,
            },
            message: 'must NOT have fewer than 1 properties',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value: ObjectValue = {};
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.minProperties,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const minPropertiesErrorMessage = 'min properties error from schema entity parameters';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                entityParameters: {
                    errorMessages: {
                        minProperties: minPropertiesErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: minPropertiesErrorMessage,
            });
        });
    });

    describe('with pattern properties object schema', () => {
        const mainSchema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            patternProperties: {
                '^first': {
                    type: JsonSchemaType.String,
                    const: 'value',
                },
            },
        };
        const errorMessages = {const: 'const(by pattern properties) error from error messages'};
        const error = {
            instancePath: '/first',
            schemaPath: '#/patternProperties/%5Efirst/const',
            keyword: 'const',
            params: {
                allowedValue: 'value',
            },
            message: 'must be equal to constant',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value: ObjectValue = {first: ''};
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: ['first'],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: ['first'],
                error: errorMessages.const,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const patternPropertiesConstErrorMessage =
                'const(by pattern properties) error from schema entity parameters';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                patternProperties: {
                    '^first': {
                        type: JsonSchemaType.String,
                        const: 'value',
                        entityParameters: {
                            errorMessages: {
                                const: patternPropertiesConstErrorMessage,
                            },
                        },
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: ['first'],
                error: patternPropertiesConstErrorMessage,
            });
        });
    });

    describe('with property names object schema', () => {
        const mainSchema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            propertyNames: {
                type: JsonSchemaType.String,
                maxLength: 1,
            },
        };
        const errorMessages = {propertyNames: 'property names error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/propertyNames',
            keyword: 'propertyNames',
            params: {
                propertyName: 'first',
            },
            message: 'property name must be valid',
        };
        const errors = [
            {
                instancePath: '',
                schemaPath: '#/propertyNames/maxLength',
                keyword: 'maxLength',
                params: {
                    limit: 1,
                },
                message: 'must NOT have more than 1 characters',
                propertyName: 'first',
            },
            error,
        ];
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value: ObjectValue = {first: ''};
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual(errors);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.propertyNames,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const propertyNamesErrorMessage = 'property names error from schema entity parameters';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                entityParameters: {
                    errorMessages: {
                        propertyNames: propertyNamesErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: propertyNamesErrorMessage,
            });
        });
    });

    describe('with required object schema', () => {
        const mainSchema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            required: ['first'],
        };
        const errorMessages = {required: 'required error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/required',
            keyword: 'required',
            params: {
                missingProperty: 'first',
            },
            message: "must have required property 'first'",
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value: ObjectValue = {};
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: ['first'],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: ['first'],
                error: errorMessages.required,
            });
        });

        it('should call onError with message from schema entity parameters by schema path', () => {
            const requiredErrorMessage =
                'required(by schema path) error from schema entity parameters';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                entityParameters: {
                    errorMessages: {
                        required: requiredErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: ['first'],
                error: requiredErrorMessage,
            });
        });

        it('should call onError with message from schema entity parameters by instance path', () => {
            const requiredErrorMessage =
                'required(by instance path) error from schema entity parameters';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {
                    first: {
                        type: JsonSchemaType.String,
                        entityParameters: {
                            errorMessages: {
                                required: requiredErrorMessage,
                            },
                        },
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: ['first'],
                error: requiredErrorMessage,
            });
        });
    });

    describe('with all of object schema', () => {
        const mainSchema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            allOf: [{type: JsonSchemaType.Object, const: {first: 'value'}}],
        };
        const errorMessages = {const: 'const(by all of) error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/allOf/0/const',
            keyword: 'const',
            params: {
                allowedValue: {
                    first: 'value',
                },
            },
            message: 'must be equal to constant',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value: ObjectValue = {};
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.const,
            });
        });

        it('should call onError with message from schema entity parameters by schema path', () => {
            const allOfConstErrorMessage =
                'const(by all of, by schema path) error from schema entity parameters';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                allOf: [
                    {
                        type: JsonSchemaType.Object,
                        const: {first: 'value'},
                        entityParameters: {
                            errorMessages: {
                                const: allOfConstErrorMessage,
                            },
                        },
                    },
                ],
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: allOfConstErrorMessage,
            });
        });

        it('should call onError with message from schema entity parameters by instance path', () => {
            const allOfConstErrorMessage =
                'const(by all of, by instance path) error from schema entity parameters';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                entityParameters: {
                    errorMessages: {
                        const: allOfConstErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: allOfConstErrorMessage,
            });
        });
    });

    describe('with any of object schema', () => {
        const mainSchema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            anyOf: [{type: JsonSchemaType.Object, const: {first: 'value'}}],
        };
        const errorMessages = {anyOf: 'any of error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/anyOf',
            keyword: 'anyOf',
            params: {},
            message: 'must match a schema in anyOf',
        };
        const errors = [
            {
                instancePath: '',
                schemaPath: '#/anyOf/0/const',
                keyword: 'const',
                params: {
                    allowedValue: {
                        first: 'value',
                    },
                },
                message: 'must be equal to constant',
            },
            error,
        ];
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value: ObjectValue = {};
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual(errors);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.anyOf,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const anyOfErrorMessage = 'any of error from schema entity parameters';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                entityParameters: {
                    errorMessages: {
                        anyOf: anyOfErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: anyOfErrorMessage,
            });
        });
    });

    describe('with const object schema', () => {
        const mainSchema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            const: {first: 'value'},
        };
        const errorMessages = {const: 'const error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/const',
            keyword: 'const',
            params: {
                allowedValue: {
                    first: 'value',
                },
            },
            message: 'must be equal to constant',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value: ObjectValue = {};
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.const,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const constErrorMessage = 'const error from schema entity parameters';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                entityParameters: {
                    errorMessages: {
                        const: constErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: constErrorMessage,
            });
        });
    });

    describe('with if then object schema', () => {
        const mainSchema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            if: {type: JsonSchemaType.Object, const: {}},
            then: {type: JsonSchemaType.Object, const: {first: 'value'}},
        };
        const errorMessages = {then: 'if then error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/if',
            keyword: 'if',
            params: {
                failingKeyword: 'then',
            },
            message: 'must match "then" schema',
        };
        const errors = [
            {
                instancePath: '',
                schemaPath: '#/then/const',
                keyword: 'const',
                params: {
                    allowedValue: {
                        first: 'value',
                    },
                },
                message: 'must be equal to constant',
            },
            error,
        ];
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value: ObjectValue = {};
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual(errors);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.then,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const ifThenErrorMessage = 'if then error from schema entity parameters';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                entityParameters: {
                    errorMessages: {
                        then: ifThenErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: ifThenErrorMessage,
            });
        });
    });

    describe('with if else object schema', () => {
        const mainSchema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            if: {type: JsonSchemaType.Object, const: {first: 'value'}},
            else: {type: JsonSchemaType.Object, const: {first: 'value'}},
        };
        const errorMessages = {else: 'if else error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/if',
            keyword: 'if',
            params: {
                failingKeyword: 'else',
            },
            message: 'must match "else" schema',
        };
        const errors = [
            {
                instancePath: '',
                schemaPath: '#/else/const',
                keyword: 'const',
                params: {
                    allowedValue: {
                        first: 'value',
                    },
                },
                message: 'must be equal to constant',
            },
            error,
        ];
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value: ObjectValue = {};
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual(errors);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.else,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const ifElseErrorMessage = 'if else error from schema entity parameters';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                entityParameters: {
                    errorMessages: {
                        else: ifElseErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: ifElseErrorMessage,
            });
        });
    });

    describe('with enum object schema', () => {
        const mainSchema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            enum: [{first: 'value'}],
        };
        const errorMessages = {enum: 'enum error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/enum',
            keyword: 'enum',
            params: {
                allowedValues: [{first: 'value'}],
            },
            message: 'must be equal to one of the allowed values',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value: ObjectValue = {};
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.enum,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const enumErrorMessage = 'enum error from schema entity parameters';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                entityParameters: {
                    errorMessages: {
                        enum: enumErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: enumErrorMessage,
            });
        });
    });

    describe('with not object schema', () => {
        const mainSchema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            not: {type: JsonSchemaType.Object, const: {}},
        };
        const errorMessages = {not: 'not error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/not',
            keyword: 'not',
            params: {},
            message: 'must NOT be valid',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value: ObjectValue = {};
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.not,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const notErrorMessage = 'not error from schema entity parameters';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                entityParameters: {
                    errorMessages: {
                        not: notErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: notErrorMessage,
            });
        });
    });

    describe('with one of object schema', () => {
        const mainSchema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            oneOf: [{type: JsonSchemaType.Object, const: {first: 'value'}}],
        };
        const errorMessages = {oneOf: 'one of error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/oneOf',
            keyword: 'oneOf',
            params: {
                passingSchemas: null,
            },
            message: 'must match exactly one schema in oneOf',
        };
        const errors = [
            {
                instancePath: '',
                schemaPath: '#/oneOf/0/const',
                keyword: 'const',
                params: {
                    allowedValue: {
                        first: 'value',
                    },
                },
                message: 'must be equal to constant',
            },
            error,
        ];
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value: ObjectValue = {};
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual(errors);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.oneOf,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const oneOfErrorMessage = 'one of error from schema entity parameters';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                entityParameters: {
                    errorMessages: {
                        oneOf: oneOfErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: oneOfErrorMessage,
            });
        });
    });

    describe('with type string schema', () => {
        const mainSchema: JsonSchemaString = {type: JsonSchemaType.String};
        const errorMessages = {type: 'type error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/type',
            keyword: 'type',
            params: {
                type: 'string',
            },
            message: 'must be string',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = 0;
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.type,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const typeErrorMessage = 'type error from schema entity parameters';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                entityParameters: {
                    errorMessages: {
                        type: typeErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: typeErrorMessage,
            });
        });
    });

    describe('with max length string schema', () => {
        const mainSchema: JsonSchemaString = {type: JsonSchemaType.String, maxLength: 1};
        const errorMessages = {maxLength: 'max length error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/maxLength',
            keyword: 'maxLength',
            params: {
                limit: 1,
            },
            message: 'must NOT have more than 1 characters',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = 'value';
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.maxLength,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const maxLengthErrorMessage = 'max length error from schema entity parameters';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                entityParameters: {
                    errorMessages: {
                        maxLength: maxLengthErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: maxLengthErrorMessage,
            });
        });
    });

    describe('with min length string schema', () => {
        const mainSchema: JsonSchemaString = {type: JsonSchemaType.String, minLength: 1};
        const errorMessages = {minLength: 'min length error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/minLength',
            keyword: 'minLength',
            params: {
                limit: 1,
            },
            message: 'must NOT have fewer than 1 characters',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = '';
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.minLength,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const minLengthErrorMessage = 'min length error from schema entity parameters';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                entityParameters: {
                    errorMessages: {
                        minLength: minLengthErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: minLengthErrorMessage,
            });
        });
    });

    describe('with pattern string schema', () => {
        const mainSchema: JsonSchemaString = {
            type: JsonSchemaType.String,
            pattern: '^[0-9]',
        };
        const errorMessages = {pattern: 'pattern error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/pattern',
            keyword: 'pattern',
            params: {
                pattern: '^[0-9]',
            },
            message: 'must match pattern "^[0-9]"',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = 'value';
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.pattern,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const patternErrorMessage = 'pattern error from schema entity parameters';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                entityParameters: {
                    errorMessages: {
                        pattern: patternErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: patternErrorMessage,
            });
        });
    });

    describe('with all of string schema', () => {
        const mainSchema: JsonSchemaString = {
            type: JsonSchemaType.String,
            allOf: [{type: JsonSchemaType.String, const: 'value'}],
        };
        const errorMessages = {const: 'const(by all of) error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/allOf/0/const',
            keyword: 'const',
            params: {
                allowedValue: 'value',
            },
            message: 'must be equal to constant',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = '';
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.const,
            });
        });

        it('should call onError with message from schema entity parameters by schema path', () => {
            const allOfConstErrorMessage =
                'const(by all of, by schema path) error from schema entity parameters';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                allOf: [
                    {
                        type: JsonSchemaType.String,
                        const: 'value',
                        entityParameters: {
                            errorMessages: {
                                const: allOfConstErrorMessage,
                            },
                        },
                    },
                ],
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: allOfConstErrorMessage,
            });
        });

        it('should call onError with message from schema entity parameters by instance path', () => {
            const allOfConstErrorMessage =
                'const(by all of, by instance path) error from schema entity parameters';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                entityParameters: {
                    errorMessages: {
                        const: allOfConstErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: allOfConstErrorMessage,
            });
        });
    });

    describe('with any of string schema', () => {
        const mainSchema: JsonSchemaString = {
            type: JsonSchemaType.String,
            anyOf: [{type: JsonSchemaType.String, const: 'value'}],
        };
        const errorMessages = {anyOf: 'any of error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/anyOf',
            keyword: 'anyOf',
            params: {},
            message: 'must match a schema in anyOf',
        };
        const errors = [
            {
                instancePath: '',
                schemaPath: '#/anyOf/0/const',
                keyword: 'const',
                params: {
                    allowedValue: 'value',
                },
                message: 'must be equal to constant',
            },
            error,
        ];
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = '';
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual(errors);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.anyOf,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const anyOfErrorMessage = 'any of error from schema entity parameters';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                entityParameters: {
                    errorMessages: {
                        anyOf: anyOfErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: anyOfErrorMessage,
            });
        });
    });

    describe('with const string schema', () => {
        const mainSchema: JsonSchemaString = {type: JsonSchemaType.String, const: 'value'};
        const errorMessages = {const: 'const error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/const',
            keyword: 'const',
            params: {
                allowedValue: 'value',
            },
            message: 'must be equal to constant',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = '';
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.const,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const constErrorMessage = 'const error from schema entity parameters';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                entityParameters: {
                    errorMessages: {
                        const: constErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: constErrorMessage,
            });
        });
    });

    describe('with if then string schema', () => {
        const mainSchema: JsonSchemaString = {
            type: JsonSchemaType.String,
            if: {type: JsonSchemaType.String, const: ''},
            then: {type: JsonSchemaType.String, const: 'value'},
        };
        const errorMessages = {then: 'if then error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/if',
            keyword: 'if',
            params: {
                failingKeyword: 'then',
            },
            message: 'must match "then" schema',
        };
        const errors = [
            {
                instancePath: '',
                schemaPath: '#/then/const',
                keyword: 'const',
                params: {
                    allowedValue: 'value',
                },
                message: 'must be equal to constant',
            },
            error,
        ];
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = '';
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual(errors);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.then,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const ifThenErrorMessage = 'if then error from schema entity parameters';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                entityParameters: {
                    errorMessages: {
                        then: ifThenErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: ifThenErrorMessage,
            });
        });
    });

    describe('with if else string schema', () => {
        const mainSchema: JsonSchemaString = {
            type: JsonSchemaType.String,
            if: {type: JsonSchemaType.String, const: 'value'},
            else: {type: JsonSchemaType.String, const: 'value'},
        };
        const errorMessages = {else: 'if else error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/if',
            keyword: 'if',
            params: {
                failingKeyword: 'else',
            },
            message: 'must match "else" schema',
        };
        const errors = [
            {
                instancePath: '',
                schemaPath: '#/else/const',
                keyword: 'const',
                params: {
                    allowedValue: 'value',
                },
                message: 'must be equal to constant',
            },
            error,
        ];
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = '';
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual(errors);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.else,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const ifElseErrorMessage = 'if else error from schema entity parameters';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                entityParameters: {
                    errorMessages: {
                        else: ifElseErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: ifElseErrorMessage,
            });
        });
    });

    describe('with enum string schema', () => {
        const mainSchema: JsonSchemaString = {type: JsonSchemaType.String, enum: ['value']};
        const errorMessages = {enum: 'enum error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/enum',
            keyword: 'enum',
            params: {
                allowedValues: ['value'],
            },
            message: 'must be equal to one of the allowed values',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = '';
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.enum,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const enumErrorMessage = 'enum error from schema entity parameters';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                entityParameters: {
                    errorMessages: {
                        enum: enumErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: enumErrorMessage,
            });
        });
    });

    describe('with not string schema', () => {
        const mainSchema: JsonSchemaString = {
            type: JsonSchemaType.String,
            not: {type: JsonSchemaType.String, const: 'value'},
        };
        const errorMessages = {not: 'not error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/not',
            keyword: 'not',
            params: {},
            message: 'must NOT be valid',
        };
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = 'value';
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual([error]);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.not,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const notErrorMessage = 'not error from schema entity parameters';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                entityParameters: {
                    errorMessages: {
                        not: notErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: notErrorMessage,
            });
        });
    });

    describe('with one of string schema', () => {
        const mainSchema: JsonSchemaString = {
            type: JsonSchemaType.String,
            oneOf: [{type: JsonSchemaType.String, const: 'value'}],
        };
        const errorMessages = {oneOf: 'one of error from error messages'};
        const error = {
            instancePath: '',
            schemaPath: '#/oneOf',
            keyword: 'oneOf',
            params: {
                passingSchemas: null,
            },
            message: 'must match exactly one schema in oneOf',
        };
        const errors = [
            {
                instancePath: '',
                schemaPath: '#/oneOf/0/const',
                keyword: 'const',
                params: {
                    allowedValue: 'value',
                },
                message: 'must be equal to constant',
            },
            error,
        ];
        const headName = '';
        const onError = jest.fn();

        test('errors must match', () => {
            const value = '';
            const validate = ajv.compile(mainSchema);

            validate(value);

            expect(validate.errors).toEqual(errors);
        });

        it('should call onError with default ajv error message', () => {
            processAjvError({
                error,
                errorMessages: undefined,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: error.message,
            });
        });

        it('should call onError with message from error messages map', () => {
            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: errorMessages.oneOf,
            });
        });

        it('should call onError with message from schema entity parameters', () => {
            const oneOfErrorMessage = 'one of error from schema entity parameters';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                entityParameters: {
                    errorMessages: {
                        oneOf: oneOfErrorMessage,
                    },
                },
            };

            processAjvError({
                error,
                errorMessages,
                headName,
                mainSchema: schema,
                onError,
            });

            expect(onError).toHaveBeenCalledWith({
                path: [],
                error: oneOfErrorMessage,
            });
        });
    });
});
