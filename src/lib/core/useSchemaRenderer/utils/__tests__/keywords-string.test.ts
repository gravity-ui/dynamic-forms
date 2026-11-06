import {createForm} from 'final-form';

import {JsonSchemaType} from '../../../constants';
import type {JSLErrors, JsonSchemaString} from '../../../types';
import {getSchemaRootNode} from '../get-schema-root-node';
import {type ParseErrorParams, getParser} from '../parse-errors';

describe('validate strings', () => {
    describe('maxLength', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                maxLength: 5,
            };
            const value = 'hello';
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                maxLength: 5,
            };
            const value = 'abcdef';
            const error: JSLErrors.MaxLength = {
                type: 'error',
                code: 'max-length-error',
                message: 'Value `#` should have a maximum length of `5`, but got `6`.',
                data: {maxLength: 5, length: 6, pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                maxLength: 5,
            };
            const value = 'abcdef';
            const error: JSLErrors.MaxLength = {
                type: 'error',
                code: 'max-length-error',
                message: 'Value `#` should have a maximum length of `5`, but got `6`.',
                data: {maxLength: 5, length: 6, pointer: '#', schema, value},
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
            const message = 'maxLength error message';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                maxLength: 5,
                nodeParameters: {errorMessages: {maxLength: message}},
            };
            const value = 'abcdef';
            const error: JSLErrors.MaxLength = {
                type: 'error',
                code: 'max-length-error',
                message: 'Value `#` should have a maximum length of `5`, but got `6`.',
                data: {maxLength: 5, length: 6, pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {maxLength: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'maxLength error message';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                allOf: [{maxLength: 5}],
                nodeParameters: {errorMessages: {maxLength: message}},
            };
            const value = 'abcdef';
            const error: JSLErrors.MaxLength = {
                type: 'error',
                code: 'max-length-error',
                message: 'Value `#` should have a maximum length of `5`, but got `6`.',
                data: {maxLength: 5, length: 6, pointer: '#', schema: schema.allOf![0], value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('', () => {}, {}, {data: {schemaPath: '#'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {maxLength: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message', () => {
            const message = 'maxLength error message';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                maxLength: 5,
            };
            const value = 'abcdef';
            const error: JSLErrors.MaxLength = {
                type: 'error',
                code: 'max-length-error',
                message: 'Value `#` should have a maximum length of `5`, but got `6`.',
                data: {maxLength: 5, length: 6, pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {maxLength: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });
    });

    describe('minLength', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                minLength: 5,
            };
            const value = 'hello';
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                minLength: 5,
            };
            const value = 'ab';
            const error: JSLErrors.MinLength = {
                type: 'error',
                code: 'min-length-error',
                message: 'Value `#` should have a minimum length of `5`, but got `2`.',
                data: {minLength: 5, length: 2, pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                minLength: 5,
            };
            const value = 'ab';
            const error: JSLErrors.MinLength = {
                type: 'error',
                code: 'min-length-error',
                message: 'Value `#` should have a minimum length of `5`, but got `2`.',
                data: {minLength: 5, length: 2, pointer: '#', schema, value},
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
            const message = 'minLength error message';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                minLength: 5,
                nodeParameters: {errorMessages: {minLength: message}},
            };
            const value = 'ab';
            const error: JSLErrors.MinLength = {
                type: 'error',
                code: 'min-length-error',
                message: 'Value `#` should have a minimum length of `5`, but got `2`.',
                data: {minLength: 5, length: 2, pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {minLength: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'minLength error message';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                allOf: [{minLength: 5}],
                nodeParameters: {errorMessages: {minLength: message}},
            };
            const value = 'ab';
            const error: JSLErrors.MinLength = {
                type: 'error',
                code: 'min-length-error',
                message: 'Value `#` should have a minimum length of `5`, but got `2`.',
                data: {minLength: 5, length: 2, pointer: '#', schema: schema.allOf![0], value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('', () => {}, {}, {data: {schemaPath: '#'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {minLength: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message', () => {
            const message = 'minLength error message';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                minLength: 5,
            };
            const value = 'ab';
            const error: JSLErrors.MinLength = {
                type: 'error',
                code: 'min-length-error',
                message: 'Value `#` should have a minimum length of `5`, but got `2`.',
                data: {minLength: 5, length: 2, pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {minLength: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });
    });

    describe('pattern', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                pattern: '^[a-z]+$',
            };
            const value = 'abc';
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                pattern: '^[a-z]+$',
            };
            const value = '123';
            const error: JSLErrors.Pattern = {
                type: 'error',
                code: 'pattern-error',
                message: 'Value in `#` should match `^[a-z]+$`, but received `123`',
                data: {
                    pattern: '^[a-z]+$',
                    description: '^[a-z]+$',
                    received: '123',
                    schema,
                    value,
                    pointer: '#',
                },
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                pattern: '^[a-z]+$',
            };
            const value = '123';
            const error: JSLErrors.Pattern = {
                type: 'error',
                code: 'pattern-error',
                message: 'Value in `#` should match `^[a-z]+$`, but received `123`',
                data: {
                    pattern: '^[a-z]+$',
                    description: '^[a-z]+$',
                    received: '123',
                    schema,
                    value,
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
            const message = 'pattern error message';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                pattern: '^[a-z]+$',
                nodeParameters: {errorMessages: {pattern: message}},
            };
            const value = '123';
            const error: JSLErrors.Pattern = {
                type: 'error',
                code: 'pattern-error',
                message: 'Value in `#` should match `^[a-z]+$`, but received `123`',
                data: {
                    pattern: '^[a-z]+$',
                    description: '^[a-z]+$',
                    received: '123',
                    schema,
                    value,
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
                state: {schema, errorMessages: {pattern: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'pattern error message';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                allOf: [{pattern: '^[a-z]+$'}],
                nodeParameters: {errorMessages: {pattern: message}},
            };
            const value = '123';
            const error: JSLErrors.Pattern = {
                type: 'error',
                code: 'pattern-error',
                message: 'Value in `#` should match `^[a-z]+$`, but received `123`',
                data: {
                    pattern: '^[a-z]+$',
                    description: '^[a-z]+$',
                    received: '123',
                    schema: schema.allOf![0],
                    value,
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
                state: {schema, errorMessages: {pattern: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message', () => {
            const message = 'pattern error message';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                pattern: '^[a-z]+$',
            };
            const value = '123';
            const error: JSLErrors.Pattern = {
                type: 'error',
                code: 'pattern-error',
                message: 'Value in `#` should match `^[a-z]+$`, but received `123`',
                data: {
                    pattern: '^[a-z]+$',
                    description: '^[a-z]+$',
                    received: '123',
                    schema,
                    value,
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
                state: {schema, errorMessages: {pattern: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });
    });

    describe('stringNumber/exclusiveMaximum', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {exclusiveMaximum: '10'},
            };
            const value = '9';
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {exclusiveMaximum: '10'},
            };
            const value = '10';
            const error: JSLErrors.ExclusiveMaximum = {
                type: 'error',
                code: 'exclusive-maximum-error',
                message: 'Value in `#` is `10`, but should be at most `10`',
                data: {maximum: '10', length: value, pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {exclusiveMaximum: '10'},
            };
            const value = '10';
            const error: JSLErrors.ExclusiveMaximum = {
                type: 'error',
                code: 'exclusive-maximum-error',
                message: 'Value in `#` is `10`, but should be at most `10`',
                data: {maximum: '10', length: value, pointer: '#', schema, value},
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
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {exclusiveMaximum: '10'},
                nodeParameters: {errorMessages: {exclusiveMaximum: message}},
            };
            const value = '10';
            const error: JSLErrors.ExclusiveMaximum = {
                type: 'error',
                code: 'exclusive-maximum-error',
                message: 'Value in `#` is `10`, but should be at most `10`',
                data: {maximum: '10', length: value, pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {exclusiveMaximum: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'exclusiveMaximum error message';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                allOf: [{stringNumber: {exclusiveMaximum: '10'}}],
                nodeParameters: {errorMessages: {exclusiveMaximum: message}},
            };
            const value = '10';
            const error: JSLErrors.ExclusiveMaximum = {
                type: 'error',
                code: 'exclusive-maximum-error',
                message: 'Value in `#` is `10`, but should be at most `10`',
                data: {
                    maximum: '10',
                    length: value,
                    pointer: '#',
                    schema: schema.allOf![0],
                    value,
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
                state: {schema, errorMessages: {exclusiveMaximum: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message', () => {
            const message = 'exclusiveMaximum error message';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {exclusiveMaximum: '10'},
            };
            const value = '10';
            const error: JSLErrors.ExclusiveMaximum = {
                type: 'error',
                code: 'exclusive-maximum-error',
                message: 'Value in `#` is `10`, but should be at most `10`',
                data: {maximum: '10', length: value, pointer: '#', schema, value},
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

    describe('stringNumber/exclusiveMinimum', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {exclusiveMinimum: '8'},
            };
            const value = '9';
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {exclusiveMinimum: '8'},
            };
            const value = '8';
            const error: JSLErrors.ExclusiveMinimum = {
                type: 'error',
                code: 'exclusive-minimum-error',
                message: 'Value in `#` is `8`, but should be at minimum `8`',
                data: {minimum: '8', length: value, pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {exclusiveMinimum: '8'},
            };
            const value = '8';
            const error: JSLErrors.ExclusiveMinimum = {
                type: 'error',
                code: 'exclusive-minimum-error',
                message: 'Value in `#` is `8`, but should be at minimum `8`',
                data: {minimum: '8', length: value, pointer: '#', schema, value},
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
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {exclusiveMinimum: '8'},
                nodeParameters: {errorMessages: {exclusiveMinimum: message}},
            };
            const value = '8';
            const error: JSLErrors.ExclusiveMinimum = {
                type: 'error',
                code: 'exclusive-minimum-error',
                message: 'Value in `#` is `8`, but should be at minimum `8`',
                data: {minimum: '8', length: value, pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {exclusiveMinimum: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'exclusiveMinimum error message';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                allOf: [{stringNumber: {exclusiveMinimum: '8'}}],
                nodeParameters: {errorMessages: {exclusiveMinimum: message}},
            };
            const value = '8';
            const error: JSLErrors.ExclusiveMinimum = {
                type: 'error',
                code: 'exclusive-minimum-error',
                message: 'Value in `#` is `8`, but should be at minimum `8`',
                data: {
                    minimum: '8',
                    length: value,
                    pointer: '#',
                    schema: schema.allOf![0],
                    value,
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
                state: {schema, errorMessages: {exclusiveMinimum: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message', () => {
            const message = 'exclusiveMinimum error message';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {exclusiveMinimum: '8'},
            };
            const value = '8';
            const error: JSLErrors.ExclusiveMinimum = {
                type: 'error',
                code: 'exclusive-minimum-error',
                message: 'Value in `#` is `8`, but should be at minimum `8`',
                data: {minimum: '8', length: value, pointer: '#', schema, value},
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

    describe('stringNumber/maximum', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {maximum: '10'},
            };
            const value = '9';
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {maximum: '10'},
            };
            const value = '11';
            const error: JSLErrors.Maximum = {
                type: 'error',
                code: 'maximum-error',
                message: 'Value in `#` is `11`, but should be `10` at maximum',
                data: {maximum: '10', length: value, value, pointer: '#', schema},
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {maximum: '10'},
            };
            const value = '11';
            const error: JSLErrors.Maximum = {
                type: 'error',
                code: 'maximum-error',
                message: 'Value in `#` is `11`, but should be `10` at maximum',
                data: {maximum: '10', length: value, value, pointer: '#', schema},
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
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {maximum: '10'},
                nodeParameters: {errorMessages: {maximum: message}},
            };
            const value = '11';
            const error: JSLErrors.Maximum = {
                type: 'error',
                code: 'maximum-error',
                message: 'Value in `#` is `11`, but should be `10` at maximum',
                data: {maximum: '10', length: value, value, pointer: '#', schema},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {maximum: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'maximum error message';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                allOf: [{stringNumber: {maximum: '10'}}],
                nodeParameters: {errorMessages: {maximum: message}},
            };
            const value = '11';
            const error: JSLErrors.Maximum = {
                type: 'error',
                code: 'maximum-error',
                message: 'Value in `#` is `11`, but should be `10` at maximum',
                data: {
                    maximum: '10',
                    length: value,
                    value,
                    pointer: '#',
                    schema: schema.allOf![0],
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
                state: {schema, errorMessages: {maximum: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message', () => {
            const message = 'maximum error message';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {maximum: '10'},
            };
            const value = '11';
            const error: JSLErrors.Maximum = {
                type: 'error',
                code: 'maximum-error',
                message: 'Value in `#` is `11`, but should be `10` at maximum',
                data: {maximum: '10', length: value, value, pointer: '#', schema},
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

    describe('stringNumber/minimum', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {minimum: '8'},
            };
            const value = '8';
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {minimum: '8'},
            };
            const value = '7';
            const error: JSLErrors.Minimum = {
                type: 'error',
                code: 'minimum-error',
                message: 'Value in `#` is `7`, but should be `8` at minimum',
                data: {minimum: '8', length: value, pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {minimum: '8'},
            };
            const value = '7';
            const error: JSLErrors.Minimum = {
                type: 'error',
                code: 'minimum-error',
                message: 'Value in `#` is `7`, but should be `8` at minimum',
                data: {minimum: '8', length: value, pointer: '#', schema, value},
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
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {minimum: '8'},
                nodeParameters: {errorMessages: {minimum: message}},
            };
            const value = '7';
            const error: JSLErrors.Minimum = {
                type: 'error',
                code: 'minimum-error',
                message: 'Value in `#` is `7`, but should be `8` at minimum',
                data: {minimum: '8', length: value, pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {minimum: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'minimum error message';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                allOf: [{stringNumber: {minimum: '8'}}],
                nodeParameters: {errorMessages: {minimum: message}},
            };
            const value = '7';
            const error: JSLErrors.Minimum = {
                type: 'error',
                code: 'minimum-error',
                message: 'Value in `#` is `7`, but should be `8` at minimum',
                data: {
                    minimum: '8',
                    length: value,
                    pointer: '#',
                    schema: schema.allOf![0],
                    value,
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
                state: {schema, errorMessages: {minimum: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message', () => {
            const message = 'minimum error message';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {minimum: '8'},
            };
            const value = '7';
            const error: JSLErrors.Minimum = {
                type: 'error',
                code: 'minimum-error',
                message: 'Value in `#` is `7`, but should be `8` at minimum',
                data: {minimum: '8', length: value, pointer: '#', schema, value},
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

    describe('stringNumber/multipleOf', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {multipleOf: '2'},
            };
            const value = '8';
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {multipleOf: '2'},
            };
            const value = '7';
            const error: JSLErrors.MultipleOf = {
                type: 'error',
                code: 'multiple-of-error',
                message: 'Expected `7` in `#` to be multiple of `2`',
                data: {multipleOf: '2', value, pointer: '#', schema},
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {multipleOf: '2'},
            };
            const value = '7';
            const error: JSLErrors.MultipleOf = {
                type: 'error',
                code: 'multiple-of-error',
                message: 'Expected `7` in `#` to be multiple of `2`',
                data: {multipleOf: '2', value, pointer: '#', schema},
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
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {multipleOf: '2'},
                nodeParameters: {errorMessages: {multipleOf: message}},
            };
            const value = '7';
            const error: JSLErrors.MultipleOf = {
                type: 'error',
                code: 'multiple-of-error',
                message: 'Expected `7` in `#` to be multiple of `2`',
                data: {multipleOf: '2', value, pointer: '#', schema},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {multipleOf: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'multipleOf error message';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                allOf: [{stringNumber: {multipleOf: '2'}}],
                nodeParameters: {errorMessages: {multipleOf: message}},
            };
            const value = '7';
            const error: JSLErrors.MultipleOf = {
                type: 'error',
                code: 'multiple-of-error',
                message: 'Expected `7` in `#` to be multiple of `2`',
                data: {multipleOf: '2', value, pointer: '#', schema: schema.allOf![0]},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('', () => {}, {}, {data: {schemaPath: '#'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {multipleOf: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message', () => {
            const message = 'multipleOf error message';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {multipleOf: '2'},
            };
            const value = '7';
            const error: JSLErrors.MultipleOf = {
                type: 'error',
                code: 'multiple-of-error',
                message: 'Expected `7` in `#` to be multiple of `2`',
                data: {multipleOf: '2', value, pointer: '#', schema},
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

    describe('stringNumber/type', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {type: JsonSchemaType.Number},
            };
            const value = '8.1';
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {type: JsonSchemaType.Number},
            };
            const value = 'a';
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `a` (string) in `#` to be of type `number`',
                data: {
                    value,
                    received: 'string',
                    expected: JsonSchemaType.Number,
                    schema,
                    pointer: '#',
                },
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('jsl: an invalid integer value produces an error', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {type: JsonSchemaType.Integer},
            };
            const value = '8.1';
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `8.1` (string) in `#` to be of type `integer`',
                data: {
                    value,
                    received: 'string',
                    expected: JsonSchemaType.Integer,
                    schema,
                    pointer: '#',
                },
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {type: JsonSchemaType.Number},
            };
            const value = 'a';
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `a` (string) in `#` to be of type `number`',
                data: {
                    value,
                    received: 'string',
                    expected: JsonSchemaType.Number,
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
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {type: JsonSchemaType.Number},
                nodeParameters: {errorMessages: {type: message}},
            };
            const value = 'a';
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `a` (string) in `#` to be of type `number`',
                data: {
                    value,
                    received: 'string',
                    expected: JsonSchemaType.Number,
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
                state: {schema, errorMessages: {type: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'type error message';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                allOf: [{stringNumber: {type: JsonSchemaType.Number}}],
                nodeParameters: {errorMessages: {type: message}},
            };
            const value = 'a';
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `a` (string) in `#` to be of type `number`',
                data: {
                    value,
                    received: 'string',
                    expected: JsonSchemaType.Number,
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
                state: {schema, errorMessages: {type: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message', () => {
            const message = 'type error message';
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                stringNumber: {type: JsonSchemaType.Number},
            };
            const value = 'a';
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `a` (string) in `#` to be of type `number`',
                data: {
                    value,
                    received: 'string',
                    expected: JsonSchemaType.Number,
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

    describe('type', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaString = {type: JsonSchemaType.String};
            const value = 'a';
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaString = {type: JsonSchemaType.String};
            const value = 1;
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `1` (number) in `#` to be of type `string`',
                data: {
                    value: 1,
                    received: 'number',
                    expected: 'string',
                    schema,
                    pointer: '#',
                },
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaString = {type: JsonSchemaType.String};
            const value = 1;
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `1` (number) in `#` to be of type `string`',
                data: {
                    value: 1,
                    received: 'number',
                    expected: 'string',
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
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                nodeParameters: {errorMessages: {type: message}},
            };
            const value = 1;
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `1` (number) in `#` to be of type `string`',
                data: {
                    value: 1,
                    received: 'number',
                    expected: 'string',
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
                state: {schema, errorMessages: {type: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'type error message';
            const schema: JsonSchemaString = {
                allOf: [{type: JsonSchemaType.String}],
                nodeParameters: {errorMessages: {type: message}},
            };
            const value = 1;
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `1` (number) in `#` to be of type `string`',
                data: {
                    value: 1,
                    received: 'number',
                    expected: 'string',
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
                state: {schema, errorMessages: {type: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message', () => {
            const message = 'type error message';
            const schema: JsonSchemaString = {type: JsonSchemaType.String};
            const value = 1;
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `1` (number) in `#` to be of type `string`',
                data: {
                    value: 1,
                    received: 'number',
                    expected: 'string',
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
