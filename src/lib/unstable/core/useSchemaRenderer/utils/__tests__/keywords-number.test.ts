import {createForm} from 'final-form';

import {JsonSchemaType} from '../../../constants';
import type {JSLErrors, JsonSchemaNumber} from '../../../types';
import {getSchemaRootNode} from '../get-schema-root-node';
import {type ParseErrorParams, getParser} from '../parse-errors';

describe('validate numbers', () => {
    describe('exclusiveMaximum', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                exclusiveMaximum: 5,
            };
            const value = 4;
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                exclusiveMaximum: 5,
            };
            const value = 5;
            const error: JSLErrors.ExclusiveMaximum = {
                type: 'error',
                code: 'exclusive-maximum-error',
                message: 'Value in `#` is `5`, but should be at most `5`',
                data: {maximum: 5, length: 5, pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                exclusiveMaximum: 5,
            };
            const value = 5;
            const error: JSLErrors.ExclusiveMaximum = {
                type: 'error',
                code: 'exclusive-maximum-error',
                message: 'Value in `#` is `5`, but should be at most `5`',
                data: {maximum: 5, length: 5, pointer: '#', schema, value},
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
            const message = 'exclusiveMaximum error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                exclusiveMaximum: 5,
                nodeParameters: {errorMessages: {exclusiveMaximum: message}},
            };
            const value = 5;
            const error: JSLErrors.ExclusiveMaximum = {
                type: 'error',
                code: 'exclusive-maximum-error',
                message: 'Value in `#` is `5`, but should be at most `5`',
                data: {maximum: 5, length: 5, pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {
                    schema,
                    errorMessages: {exclusiveMaximum: 'global error message'},
                },
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'exclusiveMaximum error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                allOf: [{exclusiveMaximum: 5}],
                nodeParameters: {errorMessages: {exclusiveMaximum: message}},
            };
            const value = 5;
            const error: JSLErrors.ExclusiveMaximum = {
                type: 'error',
                code: 'exclusive-maximum-error',
                message: 'Value in `#` is `5`, but should be at most `5`',
                data: {maximum: 5, length: 5, pointer: '#', schema: schema.allOf![0], value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('', () => {}, {}, {data: {schemaPath: '#'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {
                    schema,
                    errorMessages: {exclusiveMaximum: 'global error message'},
                },
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message', () => {
            const message = 'exclusiveMaximum error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                exclusiveMaximum: 5,
            };
            const value = 5;
            const error: JSLErrors.ExclusiveMaximum = {
                type: 'error',
                code: 'exclusive-maximum-error',
                message: 'Value in `#` is `5`, but should be at most `5`',
                data: {maximum: 5, length: 5, pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {exclusiveMaximum: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });
    });

    describe('exclusiveMinimum', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                exclusiveMinimum: 5,
            };
            const value = 6;
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                exclusiveMinimum: 5,
            };
            const value = 5;
            const error: JSLErrors.ExclusiveMinimum = {
                type: 'error',
                code: 'exclusive-minimum-error',
                message: 'Value in `#` is `5`, but should be at minimum `5`',
                data: {minimum: 5, length: 5, pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                exclusiveMinimum: 5,
            };
            const value = 5;
            const error: JSLErrors.ExclusiveMinimum = {
                type: 'error',
                code: 'exclusive-minimum-error',
                message: 'Value in `#` is `5`, but should be at minimum `5`',
                data: {minimum: 5, length: 5, pointer: '#', schema, value},
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
            const message = 'exclusiveMinimum error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                exclusiveMinimum: 5,
                nodeParameters: {errorMessages: {exclusiveMinimum: message}},
            };
            const value = 5;
            const error: JSLErrors.ExclusiveMinimum = {
                type: 'error',
                code: 'exclusive-minimum-error',
                message: 'Value in `#` is `5`, but should be at minimum `5`',
                data: {minimum: 5, length: 5, pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {
                    schema,
                    errorMessages: {exclusiveMinimum: 'global error message'},
                },
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'exclusiveMinimum error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                allOf: [{exclusiveMinimum: 5}],
                nodeParameters: {errorMessages: {exclusiveMinimum: message}},
            };
            const value = 5;
            const error: JSLErrors.ExclusiveMinimum = {
                type: 'error',
                code: 'exclusive-minimum-error',
                message: 'Value in `#` is `5`, but should be at minimum `5`',
                data: {minimum: 5, length: 5, pointer: '#', schema: schema.allOf![0], value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('', () => {}, {}, {data: {schemaPath: '#'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {
                    schema,
                    errorMessages: {exclusiveMinimum: 'global error message'},
                },
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message', () => {
            const message = 'exclusiveMinimum error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                exclusiveMinimum: 5,
            };
            const value = 5;
            const error: JSLErrors.ExclusiveMinimum = {
                type: 'error',
                code: 'exclusive-minimum-error',
                message: 'Value in `#` is `5`, but should be at minimum `5`',
                data: {minimum: 5, length: 5, pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {exclusiveMinimum: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });
    });

    describe('maximum', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                maximum: 5,
            };
            const value = 4;
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                maximum: 5,
            };
            const value = 6;
            const error: JSLErrors.Maximum = {
                type: 'error',
                code: 'maximum-error',
                message: 'Value in `#` is `6`, but should be `5` at maximum',
                data: {maximum: 5, length: 6, value, pointer: '#', schema},
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                maximum: 5,
            };
            const value = 6;
            const error: JSLErrors.Maximum = {
                type: 'error',
                code: 'maximum-error',
                message: 'Value in `#` is `6`, but should be `5` at maximum',
                data: {maximum: 5, length: 6, value, pointer: '#', schema},
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
            const message = 'maximum error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                maximum: 5,
                nodeParameters: {errorMessages: {maximum: message}},
            };
            const value = 6;
            const error: JSLErrors.Maximum = {
                type: 'error',
                code: 'maximum-error',
                message: 'Value in `#` is `6`, but should be `5` at maximum',
                data: {maximum: 5, length: 6, value, pointer: '#', schema},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {
                    schema,
                    errorMessages: {maximum: 'global error message'},
                },
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'maximum error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                allOf: [{maximum: 5}],
                nodeParameters: {errorMessages: {maximum: message}},
            };
            const value = 6;
            const error: JSLErrors.Maximum = {
                type: 'error',
                code: 'maximum-error',
                message: 'Value in `#` is `6`, but should be `5` at maximum',
                data: {maximum: 5, length: 6, value, pointer: '#', schema: schema.allOf![0]},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('', () => {}, {}, {data: {schemaPath: '#'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {
                    schema,
                    errorMessages: {maximum: 'global error message'},
                },
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message', () => {
            const message = 'maximum error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                maximum: 5,
            };
            const value = 6;
            const error: JSLErrors.Maximum = {
                type: 'error',
                code: 'maximum-error',
                message: 'Value in `#` is `6`, but should be `5` at maximum',
                data: {maximum: 5, length: 6, value, pointer: '#', schema},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {maximum: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });
    });

    describe('minimum', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                minimum: 5,
            };
            const value = 6;
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                minimum: 5,
            };
            const value = 4;
            const error: JSLErrors.Minimum = {
                type: 'error',
                code: 'minimum-error',
                message: 'Value in `#` is `4`, but should be `5` at minimum',
                data: {minimum: 5, length: 4, pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                minimum: 5,
            };
            const value = 4;
            const error: JSLErrors.Minimum = {
                type: 'error',
                code: 'minimum-error',
                message: 'Value in `#` is `4`, but should be `5` at minimum',
                data: {minimum: 5, length: 4, pointer: '#', schema, value},
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
            const message = 'minimum error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                minimum: 5,
                nodeParameters: {errorMessages: {minimum: message}},
            };
            const value = 4;
            const error: JSLErrors.Minimum = {
                type: 'error',
                code: 'minimum-error',
                message: 'Value in `#` is `4`, but should be `5` at minimum',
                data: {minimum: 5, length: 4, pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {
                    schema,
                    errorMessages: {minimum: 'global error message'},
                },
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'minimum error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                allOf: [{minimum: 5}],
                nodeParameters: {errorMessages: {minimum: message}},
            };
            const value = 4;
            const error: JSLErrors.Minimum = {
                type: 'error',
                code: 'minimum-error',
                message: 'Value in `#` is `4`, but should be `5` at minimum',
                data: {minimum: 5, length: 4, pointer: '#', schema: schema.allOf![0], value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('', () => {}, {}, {data: {schemaPath: '#'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {
                    schema,
                    errorMessages: {minimum: 'global error message'},
                },
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message', () => {
            const message = 'minimum error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                minimum: 5,
            };
            const value = 4;
            const error: JSLErrors.Minimum = {
                type: 'error',
                code: 'minimum-error',
                message: 'Value in `#` is `4`, but should be `5` at minimum',
                data: {minimum: 5, length: 4, pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {minimum: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });
    });

    describe('multipleOf', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                multipleOf: 3,
            };
            const value = 6;
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                multipleOf: 3,
            };
            const value = 4;
            const error: JSLErrors.MultipleOf = {
                type: 'error',
                code: 'multiple-of-error',
                message: 'Expected `4` in `#` to be multiple of `3`',
                data: {multipleOf: 3, value, pointer: '#', schema},
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                multipleOf: 3,
            };
            const value = 4;
            const error: JSLErrors.MultipleOf = {
                type: 'error',
                code: 'multiple-of-error',
                message: 'Expected `4` in `#` to be multiple of `3`',
                data: {multipleOf: 3, value, pointer: '#', schema},
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
            const message = 'multipleOf error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                multipleOf: 3,
                nodeParameters: {errorMessages: {multipleOf: message}},
            };
            const value = 4;
            const error: JSLErrors.MultipleOf = {
                type: 'error',
                code: 'multiple-of-error',
                message: 'Expected `4` in `#` to be multiple of `3`',
                data: {multipleOf: 3, value, pointer: '#', schema},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {
                    schema,
                    errorMessages: {multipleOf: 'global error message'},
                },
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'multipleOf error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                allOf: [{multipleOf: 3}],
                nodeParameters: {errorMessages: {multipleOf: message}},
            };
            const value = 4;
            const error: JSLErrors.MultipleOf = {
                type: 'error',
                code: 'multiple-of-error',
                message: 'Expected `4` in `#` to be multiple of `3`',
                data: {multipleOf: 3, value, pointer: '#', schema: schema.allOf![0]},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('', () => {}, {}, {data: {schemaPath: '#'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {
                    schema,
                    errorMessages: {multipleOf: 'global error message'},
                },
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message', () => {
            const message = 'multipleOf error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                multipleOf: 3,
            };
            const value = 4;
            const error: JSLErrors.MultipleOf = {
                type: 'error',
                code: 'multiple-of-error',
                message: 'Expected `4` in `#` to be multiple of `3`',
                data: {multipleOf: 3, value, pointer: '#', schema},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {multipleOf: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });
    });

    describe('type', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
            };
            const value = 888;
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
            };
            const value = 'a';
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `a` (string) in `#` to be of type `number`',
                data: {
                    value: 'a',
                    received: 'string',
                    expected: 'number',
                    schema,
                    pointer: '#',
                },
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
            };
            const value = 'a';
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `a` (string) in `#` to be of type `number`',
                data: {
                    value: 'a',
                    received: 'string',
                    expected: 'number',
                    schema,
                    pointer: '#',
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
            const message = 'type error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                nodeParameters: {errorMessages: {type: message}},
            };
            const value = 'a';
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `a` (string) in `#` to be of type `number`',
                data: {
                    value: 'a',
                    received: 'string',
                    expected: 'number',
                    schema,
                    pointer: '#',
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {
                    schema,
                    errorMessages: {type: 'global error message'},
                },
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'type error message';
            const schema: JsonSchemaNumber = {
                allOf: [{type: JsonSchemaType.Number}],
                nodeParameters: {errorMessages: {type: message}},
            };
            const value = 'a';
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `a` (string) in `#` to be of type `number`',
                data: {
                    value: 'a',
                    received: 'string',
                    expected: 'number',
                    schema: schema.allOf![0],
                    pointer: '#',
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
                state: {
                    schema,
                    errorMessages: {type: 'global error message'},
                },
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message', () => {
            const message = 'type error message';
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
            };
            const value = 'a';
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `a` (string) in `#` to be of type `number`',
                data: {
                    value: 'a',
                    received: 'string',
                    expected: 'number',
                    schema,
                    pointer: '#',
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {type: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });
    });
});
