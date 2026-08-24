import {createForm} from 'final-form';

import {JsonSchemaType} from '../../../constants';
import type {JSLErrors, JsonSchemaNumber} from '../../../types';
import {getSchemaRootNode} from '../get-schema-root-node';
import {type ParseErrorParams, getParser} from '../parse-errors';

describe('validate common', () => {
    describe('allOf', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                allOf: [{minimum: 5}, {maximum: 10}],
            };
            const value = 5;
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                allOf: [{minimum: 5}, {maximum: 10}],
            };
            const value = 4;
            const error: JSLErrors.Minimum = {
                type: 'error',
                code: 'minimum-error',
                message: 'Value in `#` is `4`, but should be `5` at minimum',
                data: {
                    minimum: 5,
                    length: 4,
                    pointer: '#',
                    schema: schema.allOf![0],
                    value,
                },
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        // error has no specific code for parser tests
    });

    describe('anyOf', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                anyOf: [{minimum: 10}, {maximum: 1}],
            };
            const value = 0;
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                anyOf: [{minimum: 10}, {maximum: 1}],
            };
            const value = 5;
            const error: JSLErrors.AnyOf = {
                type: 'error',
                code: 'any-of-error',
                message: `Value \`${value}\` at \`#\` does not match any schema of \`${JSON.stringify(
                    schema.anyOf,
                )}\``,
                data: {
                    pointer: '#',
                    schema,
                    value,
                    anyOf: schema.anyOf!,
                },
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                anyOf: [{minimum: 10}, {maximum: 1}],
            };
            const value = 5;
            const error: JSLErrors.AnyOf = {
                type: 'error',
                code: 'any-of-error',
                message: `Value \`${value}\` at \`#\` does not match any schema of \`${JSON.stringify(
                    schema.anyOf,
                )}\``,
                data: {
                    pointer: '#',
                    schema,
                    value,
                    anyOf: schema.anyOf!,
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', error.message);
        });

        test('get-parser: error schema-level error message', () => {
            const message = 'anyOf error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                anyOf: [{minimum: 10}, {maximum: 1}],
                nodeParameters: {errorMessages: {anyOf: message}},
            };
            const value = 5;
            const error: JSLErrors.AnyOf = {
                type: 'error',
                code: 'any-of-error',
                message: `Value \`${value}\` at \`#\` does not match any schema of \`${JSON.stringify(
                    schema.anyOf,
                )}\``,
                data: {
                    pointer: '#',
                    schema,
                    value,
                    anyOf: schema.anyOf!,
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {anyOf: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'anyOf error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                allOf: [{anyOf: [{minimum: 10}, {maximum: 1}]}],
                nodeParameters: {errorMessages: {anyOf: message}},
            };
            const value = 5;
            const error: JSLErrors.AnyOf = {
                type: 'error',
                code: 'any-of-error',
                message: `Value \`${value}\` at \`#\` does not match any schema of \`${JSON.stringify(
                    schema.allOf![0].anyOf,
                )}\``,
                data: {
                    pointer: '#',
                    schema: schema.allOf![0],
                    value,
                    anyOf: schema.allOf![0].anyOf!,
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('', () => {}, {}, {data: {schemaPath: '#'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {anyOf: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message', () => {
            const message = 'anyOf error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                anyOf: [{minimum: 10}, {maximum: 1}],
            };
            const value = 5;
            const error: JSLErrors.AnyOf = {
                type: 'error',
                code: 'any-of-error',
                message: `Value \`${value}\` at \`#\` does not match any schema of \`${JSON.stringify(
                    schema.anyOf,
                )}\``,
                data: {
                    pointer: '#',
                    schema,
                    value,
                    anyOf: schema.anyOf!,
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {anyOf: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });
    });

    describe('const', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                const: 10,
            };
            const value = 10;
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                const: 10,
            };
            const value = 5;
            const error: JSLErrors.Const = {
                type: 'error',
                code: 'const-error',
                message: 'Expected value at `#` to be `10`, but value given is `5`',
                data: {pointer: '#', schema, value, expected: 10},
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                const: 10,
            };
            const value = 5;
            const error: JSLErrors.Const = {
                type: 'error',
                code: 'const-error',
                message: 'Expected value at `#` to be `10`, but value given is `5`',
                data: {pointer: '#', schema, value, expected: 10},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', error.message);
        });

        test('get-parser: error schema-level error message', () => {
            const message = 'const error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                const: 10,
                nodeParameters: {errorMessages: {const: message}},
            };
            const value = 5;
            const error: JSLErrors.Const = {
                type: 'error',
                code: 'const-error',
                message: 'Expected value at `#` to be `10`, but value given is `5`',
                data: {pointer: '#', schema, value, expected: 10},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {const: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'const error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                allOf: [{const: 10}],
                nodeParameters: {errorMessages: {const: message}},
            };
            const value = 5;
            const error: JSLErrors.Const = {
                type: 'error',
                code: 'const-error',
                message: 'Expected value at `#` to be `10`, but value given is `5`',
                data: {pointer: '#', schema: schema.allOf![0], value, expected: 10},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('', () => {}, {}, {data: {schemaPath: '#'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {const: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message', () => {
            const message = 'const error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                const: 10,
            };
            const value = 5;
            const error: JSLErrors.Const = {
                type: 'error',
                code: 'const-error',
                message: 'Expected value at `#` to be `10`, but value given is `5`',
                data: {pointer: '#', schema, value, expected: 10},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {const: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });
    });

    describe('else', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                if: {const: 5},
                else: {enum: [10]},
            };
            const value = 10;
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                if: {const: 5},
                else: {enum: [10]},
            };
            const value = 20;
            const error: JSLErrors.Enum = {
                type: 'error',
                code: 'enum-error',
                message: `Expected given value \`${value}\` in \`#\` to be one of \`${JSON.stringify(
                    schema.else!.enum,
                )}\``,
                data: {pointer: '#', schema: schema.else!, value, values: schema.else!.enum!},
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        // error has no specific code for parser tests
    });

    describe('enum', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                enum: [1, 2, 3],
            };
            const value = 1;
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                enum: [1, 2, 3],
            };
            const value = 4;
            const error: JSLErrors.Enum = {
                type: 'error',
                code: 'enum-error',
                message: `Expected given value \`${value}\` in \`#\` to be one of \`${JSON.stringify(
                    schema.enum,
                )}\``,
                data: {pointer: '#', schema, value, values: schema.enum!},
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                enum: [1, 2, 3],
            };
            const value = 4;
            const error: JSLErrors.Enum = {
                type: 'error',
                code: 'enum-error',
                message: `Expected given value \`${value}\` in \`#\` to be one of \`${JSON.stringify(
                    schema.enum,
                )}\``,
                data: {pointer: '#', schema, value, values: schema.enum!},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', error.message);
        });

        test('get-parser: error schema-level error message', () => {
            const message = 'enum error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                enum: [1, 2, 3],
                nodeParameters: {errorMessages: {enum: message}},
            };
            const value = 4;
            const error: JSLErrors.Enum = {
                type: 'error',
                code: 'enum-error',
                message: `Expected given value \`${value}\` in \`#\` to be one of \`${JSON.stringify(
                    schema.enum,
                )}\``,
                data: {pointer: '#', schema, value, values: schema.enum!},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {enum: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'enum error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                allOf: [{enum: [1, 2, 3]}],
                nodeParameters: {errorMessages: {enum: message}},
            };
            const value = 4;
            const error: JSLErrors.Enum = {
                type: 'error',
                code: 'enum-error',
                message: `Expected given value \`${value}\` in \`#\` to be one of \`${JSON.stringify(
                    schema.allOf![0].enum,
                )}\``,
                data: {
                    pointer: '#',
                    schema: schema.allOf![0],
                    value,
                    values: schema.allOf![0].enum!,
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('', () => {}, {}, {data: {schemaPath: '#'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {enum: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message', () => {
            const message = 'enum error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                enum: [1, 2, 3],
            };
            const value = 4;
            const error: JSLErrors.Enum = {
                type: 'error',
                code: 'enum-error',
                message: `Expected given value \`${value}\` in \`#\` to be one of \`${JSON.stringify(
                    schema.enum,
                )}\``,
                data: {pointer: '#', schema, value, values: schema.enum!},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {enum: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });
    });

    describe('not', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                not: {minimum: 5},
            };
            const value = 1;
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                not: {minimum: 5},
            };
            const value = 10;
            const error: JSLErrors.Not = {
                type: 'error',
                code: 'not-error',
                message: `Value \`${value}\` at pointer should not match schema \`${JSON.stringify(
                    schema.not,
                )}\``,
                data: {value, not: schema.not!, pointer: '#', schema},
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                not: {minimum: 5},
            };
            const value = 10;
            const error: JSLErrors.Not = {
                type: 'error',
                code: 'not-error',
                message: `Value \`${value}\` at pointer should not match schema \`${JSON.stringify(
                    schema.not,
                )}\``,
                data: {value, not: schema.not!, pointer: '#', schema},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', error.message);
        });

        test('get-parser: not keyword schema-level error message', () => {
            const message = 'not error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                not: {
                    minimum: 5,
                    nodeParameters: {errorMessages: {not: message}},
                },
                nodeParameters: {errorMessages: {not: 'another error message'}},
            };
            const value = 10;
            const error: JSLErrors.Not = {
                type: 'error',
                code: 'not-error',
                message: `Value \`${value}\` at pointer should not match schema \`${JSON.stringify(
                    schema.not,
                )}\``,
                data: {value, not: schema.not!, pointer: '#', schema},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {not: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: error schema-level error message', () => {
            const message = 'not error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                not: {minimum: 5},
                nodeParameters: {errorMessages: {not: message}},
            };
            const value = 10;
            const error: JSLErrors.Not = {
                type: 'error',
                code: 'not-error',
                message: `Value \`${value}\` at pointer should not match schema \`${JSON.stringify(
                    schema.not,
                )}\``,
                data: {value, not: schema.not!, pointer: '#', schema},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {not: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'not error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                allOf: [{not: {minimum: 5}}],
                nodeParameters: {errorMessages: {not: message}},
            };
            const value = 10;
            const error: JSLErrors.Not = {
                type: 'error',
                code: 'not-error',
                message: `Value \`${value}\` at pointer should not match schema \`${JSON.stringify(
                    schema.allOf![0].not,
                )}\``,
                data: {value, not: schema.allOf![0].not!, pointer: '#', schema: schema.allOf![0]},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('', () => {}, {}, {data: {schemaPath: '#'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {not: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message', () => {
            const message = 'not error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                not: {minimum: 5},
            };
            const value = 10;
            const error: JSLErrors.Not = {
                type: 'error',
                code: 'not-error',
                message: `Value \`${value}\` at pointer should not match schema \`${JSON.stringify(
                    schema.not,
                )}\``,
                data: {value, not: schema.not!, pointer: '#', schema},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {not: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });
    });

    describe('oneOf', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                oneOf: [{maximum: 1}, {minimum: 10}],
            };
            const value = 0;
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                oneOf: [{maximum: 1}, {minimum: 10}],
            };
            const value = 5;
            const error: JSLErrors.OneOf = {
                type: 'error',
                code: 'one-of-error',
                message: 'Value `5` in `#` does not match any given oneof schema',
                data: {
                    value: '5',
                    pointer: '#',
                    schema,
                    oneOf: schema.oneOf!,
                    errors: [
                        {
                            type: 'error',
                            code: 'maximum-error',
                            message: 'Value in `#` is `5`, but should be `1` at maximum',
                            data: {
                                maximum: 1,
                                length: 5,
                                value,
                                pointer: '#',
                                schema: schema.oneOf![0],
                            },
                        },
                        {
                            type: 'error',
                            code: 'minimum-error',
                            message: 'Value in `#` is `5`, but should be `10` at minimum',
                            data: {
                                minimum: 10,
                                length: 5,
                                pointer: '#',
                                schema: schema.oneOf![1],
                                value,
                            },
                        },
                    ],
                },
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                oneOf: [{maximum: 1}, {minimum: 10}],
            };
            const value = 5;
            const error: JSLErrors.OneOf = {
                type: 'error',
                code: 'one-of-error',
                message: 'Value `5` in `#` does not match any given oneof schema',
                data: {
                    value: JSON.stringify(value),
                    pointer: '#',
                    schema,
                    oneOf: schema.oneOf!,
                    errors: [
                        {
                            type: 'error',
                            code: 'maximum-error',
                            message: 'Value in `#` is `5`, but should be `1` at maximum',
                            data: {
                                maximum: 1,
                                length: 5,
                                value,
                                pointer: '#',
                                schema: schema.oneOf![0],
                            },
                        },
                        {
                            type: 'error',
                            code: 'minimum-error',
                            message: 'Value in `#` is `5`, but should be `10` at minimum',
                            data: {
                                minimum: 10,
                                length: 5,
                                pointer: '#',
                                schema: schema.oneOf![1],
                                value,
                            },
                        },
                    ],
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', error.data.errors[0].message);
        });

        test('get-parser: error schema-level error message', () => {
            const message = 'oneOf error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                oneOf: [{maximum: 1}, {minimum: 10}],
                nodeParameters: {errorMessages: {oneOf: message}},
            };
            const value = 5;
            const error: JSLErrors.OneOf = {
                type: 'error',
                code: 'one-of-error',
                message: 'Value `5` in `#` does not match any given oneof schema',
                data: {
                    value: JSON.stringify(value),
                    pointer: '#',
                    schema,
                    oneOf: schema.oneOf!,
                    errors: [
                        {
                            type: 'error',
                            code: 'maximum-error',
                            message: 'Value in `#` is `5`, but should be `1` at maximum',
                            data: {
                                maximum: 1,
                                length: 5,
                                value,
                                pointer: '#',
                                schema: schema.oneOf![0],
                            },
                        },
                        {
                            type: 'error',
                            code: 'minimum-error',
                            message: 'Value in `#` is `5`, but should be `10` at minimum',
                            data: {
                                minimum: 10,
                                length: 5,
                                pointer: '#',
                                schema: schema.oneOf![1],
                                value,
                            },
                        },
                    ],
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {oneOf: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'oneOf error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                allOf: [{oneOf: [{maximum: 1}, {minimum: 10}]}],
                nodeParameters: {errorMessages: {oneOf: message}},
            };
            const value = 5;
            const error: JSLErrors.OneOf = {
                type: 'error',
                code: 'one-of-error',
                message: 'Value `5` in `#` does not match any given oneof schema',
                data: {
                    value: JSON.stringify(value),
                    pointer: '#',
                    schema: schema.allOf![0],
                    oneOf: schema.allOf![0].oneOf!,
                    errors: [
                        {
                            type: 'error',
                            code: 'maximum-error',
                            message: 'Value in `#` is `5`, but should be `1` at maximum',
                            data: {
                                maximum: 1,
                                length: 5,
                                value,
                                pointer: '#',
                                schema: schema.allOf![0].oneOf![0],
                            },
                        },
                        {
                            type: 'error',
                            code: 'minimum-error',
                            message: 'Value in `#` is `5`, but should be `10` at minimum',
                            data: {
                                minimum: 10,
                                length: 5,
                                pointer: '#',
                                schema: schema.allOf![0].oneOf![1],
                                value,
                            },
                        },
                    ],
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('', () => {}, {}, {data: {schemaPath: '#'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {oneOf: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });
    });

    describe('then', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                if: {const: 5},
                then: {enum: [10]},
            };
            const value = 10;
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                if: {const: 5},
                then: {enum: [10]},
            };
            const value = 5;
            const error: JSLErrors.Enum = {
                type: 'error',
                code: 'enum-error',
                message: `Expected given value \`${value}\` in \`#\` to be one of \`${JSON.stringify(
                    schema.then!.enum,
                )}\``,
                data: {pointer: '#', schema: schema.then!, value, values: schema.then!.enum!},
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        // error has no specific code for parser tests
    });
});
