import {createForm} from 'final-form';

import {JsonSchemaType} from '../../../constants';
import type {JSLErrors, JsonSchema, JsonSchemaArray} from '../../../types';
import {getSchemaRootNode} from '../get-schema-root-node';
import {type ParseErrorParams, getParser} from '../parse-errors';

describe('validate arrays', () => {
    describe('additionalItems (boolean)', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                items: [{type: JsonSchemaType.String}, {type: JsonSchemaType.Number}],
                additionalItems: false,
            };
            const value = ['a', 1];
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an extra item produces an error', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                items: [{type: JsonSchemaType.String}, {type: JsonSchemaType.Number}],
                additionalItems: false,
            };
            const value = ['a', 1, 'x'];
            const error: JSLErrors.AdditionalItems = {
                type: 'error',
                code: 'additional-items-error',
                message: 'Array at `#/2` may not have an additional item `2`',
                data: {key: 2, pointer: '#/2', value, schema},
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                items: [{type: JsonSchemaType.String}, {type: JsonSchemaType.Number}],
                additionalItems: false,
            };
            const value = ['a', 1, 'x'];
            const error: JSLErrors.AdditionalItems = {
                type: 'error',
                code: 'additional-items-error',
                message: 'Array at `#/2` may not have an additional item `2`',
                data: {key: 2, pointer: '#/2', value, schema},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('[2]', () => {}, {}, {});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('[2]', error.message);
        });

        test('get-parser: error schema-level error message', () => {
            const message = 'additional items error message';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                items: [
                    {
                        type: JsonSchemaType.String,
                        nodeParameters: {errorMessages: {additionalItems: 'another error message'}},
                    },
                    {type: JsonSchemaType.Number},
                ],
                additionalItems: false,
                nodeParameters: {errorMessages: {additionalItems: message}},
            };
            const value = ['a', 1, 'x'];
            const error: JSLErrors.AdditionalItems = {
                type: 'error',
                code: 'additional-items-error',
                message: 'Array at `#/2` may not have an additional item `2`',
                data: {key: 2, pointer: '#/2', value, schema},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('[2]', () => {}, {}, {data: {schemaPath: '#/items/0'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {additionalItems: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('[2]', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'additional items error message';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                items: [{nodeParameters: {errorMessages: {additionalItems: message}}}, {}],
                allOf: [
                    {
                        items: [{type: JsonSchemaType.String}, {type: JsonSchemaType.Number}],
                        additionalItems: false,
                    },
                ],
            };
            const value = ['a', 1, 'x'];
            const error: JSLErrors.AdditionalItems = {
                type: 'error',
                code: 'additional-items-error',
                message: 'Array at `#/2` may not have an additional item `2`',
                data: {key: 2, pointer: '#/2', value, schema: schema.allOf![0]},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm<any>({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('[2]', () => {}, {}, {data: {schemaPath: '#/items/0'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {additionalItems: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('[2]', message);
        });

        test('get-parser: parent instance schema-level error message', () => {
            const message = 'additional items error message';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                allOf: [
                    {
                        items: [{type: JsonSchemaType.String}, {type: JsonSchemaType.Number}],
                        additionalItems: false,
                    },
                ],
                nodeParameters: {errorMessages: {additionalItems: message}},
            };
            const value = ['a', 1, 'x'];
            const error: JSLErrors.AdditionalItems = {
                type: 'error',
                code: 'additional-items-error',
                message: 'Array at `#/2` may not have an additional item `2`',
                data: {key: 2, pointer: '#/2', value, schema: schema.allOf![0]},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm<any>({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('', () => {}, {}, {data: {schemaPath: '#'}});
            form.registerField<any>('[2]', () => {}, {}, {data: {schemaPath: '#/items/3'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {additionalItems: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('[2]', message);
        });

        test('get-parser: global error message', () => {
            const message = 'additional items error message';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                allOf: [
                    {
                        items: [{type: JsonSchemaType.String}, {type: JsonSchemaType.Number}],
                        additionalItems: false,
                    },
                ],
            };
            const value = ['a', 1, 'x'];
            const error: JSLErrors.AdditionalItems = {
                type: 'error',
                code: 'additional-items-error',
                message: 'Array at `#/2` may not have an additional item `2`',
                data: {key: 2, pointer: '#/2', value, schema: schema.allOf![0]},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm<any>({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('[2]', () => {}, {}, {data: {schemaPath: '#/items/3'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {additionalItems: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('[2]', message);
        });

        test('get-parser: parent default error message (pointer field not registered)', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                items: [{type: JsonSchemaType.String}, {type: JsonSchemaType.Number}],
                additionalItems: false,
            };

            const value = ['a', 1, 'x'];
            const error: JSLErrors.AdditionalItems = {
                type: 'error',
                code: 'additional-items-error',
                message: 'Array at `#/2` may not have an additional item `2`',
                data: {key: 2, pointer: '#/2', value, schema},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', error.message);
        });

        test('get-parser: parent error schema-level error message (pointer field not registered)', () => {
            const message = 'additional items error message';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                items: [{type: JsonSchemaType.String}, {type: JsonSchemaType.Number}],
                additionalItems: false,
                nodeParameters: {errorMessages: {additionalItems: message}},
            };
            const value = ['a', 1, 'x'];
            const error: JSLErrors.AdditionalItems = {
                type: 'error',
                code: 'additional-items-error',
                message: 'Array at `#/2` may not have an additional item `2`',
                data: {key: 2, pointer: '#/2', value, schema},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: parent instance schema-level error message (pointer field not registered)', () => {
            const message = 'additional items error message';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                allOf: [
                    {
                        items: [{type: JsonSchemaType.String}, {type: JsonSchemaType.Number}],
                        additionalItems: false,
                    },
                ],
                nodeParameters: {errorMessages: {additionalItems: message}},
            };
            const value = ['a', 1, 'x'];
            const error: JSLErrors.AdditionalItems = {
                type: 'error',
                code: 'additional-items-error',
                message: 'Array at `#/2` may not have an additional item `2`',
                data: {key: 2, pointer: '#/2', value, schema: schema.allOf![0]},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm<any>({onSubmit: () => {}, initialValues: value});

            form.registerField('', () => {}, {}, {data: {schemaPath: '#'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: parent global error message (pointer field not registered)', () => {
            const message = 'additional items error message';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                items: [{type: JsonSchemaType.String}, {type: JsonSchemaType.Number}],
                additionalItems: false,
            };
            const value = ['a', 1, 'x'];
            const error: JSLErrors.AdditionalItems = {
                type: 'error',
                code: 'additional-items-error',
                message: 'Array at `#/2` may not have an additional item `2`',
                data: {key: 2, pointer: '#/2', value, schema},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {errorMessages: {additionalItems: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });
    });

    describe('additionalItems (schema)', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                items: [{type: JsonSchemaType.String}, {type: JsonSchemaType.Number}],
                additionalItems: {type: JsonSchemaType.Number},
            };
            const value = ['a', 1, 2];
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                items: [{type: JsonSchemaType.String}, {type: JsonSchemaType.Number}],
                additionalItems: {type: JsonSchemaType.Number},
            };
            const value = ['a', 1, 'x'];
            const error = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `x` (string) in `#/2` to be of type `number`',
                data: {
                    value: 'x',
                    received: 'string',
                    expected: 'number',
                    schema: schema.additionalItems,
                    pointer: '#/2',
                },
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        // error has no specific code for parser tests
    });

    describe('contains (boolean)', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                items: {type: JsonSchemaType.Number},
                contains: true,
            };
            const value = [1];
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                items: {type: JsonSchemaType.Number},
                contains: true,
            };
            const value: unknown[] = [];
            const error: JSLErrors.ContainsAny = {
                type: 'error',
                code: 'contains-any-error',
                message: 'The array at `#` must contain at least one item',
                data: {pointer: '#', value: value, schema},
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                items: {type: JsonSchemaType.Number},
                contains: true,
            };
            const value: unknown[] = [];
            const error: JSLErrors.ContainsAny = {
                type: 'error',
                code: 'contains-any-error',
                message: 'The array at `#` must contain at least one item',
                data: {pointer: '#', value: value, schema},
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
            const message = 'contains error message';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                items: {type: JsonSchemaType.Number},
                contains: true,
                nodeParameters: {errorMessages: {contains: message}},
            };
            const value: unknown[] = [];
            const error: JSLErrors.ContainsAny = {
                type: 'error',
                code: 'contains-any-error',
                message: 'The array at `#` must contain at least one item',
                data: {pointer: '#', value: value, schema},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {contains: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'contains error message';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                items: {type: JsonSchemaType.Number},
                allOf: [{contains: true}],
                nodeParameters: {errorMessages: {contains: message}},
            };
            const value: unknown[] = [];
            const error: JSLErrors.ContainsAny = {
                type: 'error',
                code: 'contains-any-error',
                message: 'The array at `#` must contain at least one item',
                data: {pointer: '#', value: value, schema: schema.allOf![0]},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('', () => {}, {}, {data: {schemaPath: '#'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {contains: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message', () => {
            const message = 'contains error message';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                items: {type: JsonSchemaType.Number},
                contains: true,
            };
            const value: unknown[] = [];
            const error: JSLErrors.ContainsAny = {
                type: 'error',
                code: 'contains-any-error',
                message: 'The array at `#` must contain at least one item',
                data: {pointer: '#', value: value, schema},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {contains: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });
    });

    describe('contains (schema)', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                contains: {type: JsonSchemaType.Number},
            };
            const value = [1];
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                contains: {type: JsonSchemaType.Number},
            };
            const value: unknown[] = [];
            const error: JSLErrors.ContainsMin = {
                type: 'error',
                code: 'contains-min-error',
                message:
                    'The array at `#` contains 1 too few items matching `{"type":"array","contains":{"type":"number"}}`',
                data: {pointer: '#', schema, delta: 1, value},
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                contains: {type: JsonSchemaType.Number},
            };
            const value: unknown[] = [];
            const error: JSLErrors.ContainsMin = {
                type: 'error',
                code: 'contains-min-error',
                message: `The array at \`#\` contains 1 too few items matching \`${JSON.stringify(
                    schema,
                )}\``,
                data: {pointer: '#', schema, delta: 1, value},
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

        test('get-parser: contains keyword schema-level error message', () => {
            const message = 'contains error message';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                contains: {
                    type: JsonSchemaType.Number,
                    nodeParameters: {errorMessages: {contains: message}},
                },
                nodeParameters: {errorMessages: {contains: 'another error message'}},
            };
            const value: unknown[] = [];
            const error: JSLErrors.ContainsMin = {
                type: 'error',
                code: 'contains-min-error',
                message: `The array at \`#\` contains 1 too few items matching \`${JSON.stringify(
                    schema,
                )}\``,
                data: {pointer: '#', schema, delta: 1, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {contains: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: error schema-level error message', () => {
            const message = 'contains error message';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                contains: {type: JsonSchemaType.Number},
                nodeParameters: {errorMessages: {contains: message}},
            };
            const value: unknown[] = [];
            const error: JSLErrors.ContainsMin = {
                type: 'error',
                code: 'contains-min-error',
                message: `The array at \`#\` contains 1 too few items matching \`${JSON.stringify(
                    schema,
                )}\``,
                data: {pointer: '#', schema, delta: 1, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {contains: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'contains error message';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                allOf: [{contains: {type: JsonSchemaType.Number}}],
                nodeParameters: {errorMessages: {contains: message}},
            };
            const value: unknown[] = [];
            const error: JSLErrors.ContainsMin = {
                type: 'error',
                code: 'contains-min-error',
                message: `The array at \`#\` contains 1 too few items matching \`${JSON.stringify(
                    schema.allOf![0],
                )}\``,
                data: {pointer: '#', schema: schema.allOf![0], delta: 1, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('', () => {}, {}, {data: {schemaPath: '#'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {contains: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message', () => {
            const message = 'contains error message';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                contains: {type: JsonSchemaType.Number},
            };
            const value: unknown[] = [];
            const error: JSLErrors.ContainsMin = {
                type: 'error',
                code: 'contains-min-error',
                message: `The array at \`#\` contains 1 too few items matching \`${JSON.stringify(
                    schema,
                )}\``,
                data: {pointer: '#', schema, delta: 1, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {contains: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });
    });

    describe('items (single schema)', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                items: {type: JsonSchemaType.String},
            };
            const value = ['a'];
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                items: {type: JsonSchemaType.String},
            };
            const value = [1];
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `1` (number) in `#/0` to be of type `string`',
                data: {
                    value: 1,
                    received: 'number',
                    expected: 'string',
                    schema: schema.items as JsonSchema,
                    pointer: '#/0',
                },
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        // error has no specific code for parser tests
    });

    describe('items (tuple)', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                items: [{type: JsonSchemaType.String}, {type: JsonSchemaType.Number}],
            };
            const value = ['a', 1];
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                items: [{type: JsonSchemaType.String}, {type: JsonSchemaType.Number}],
            };
            const value = ['a', 'b'];
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `b` (string) in `#/1` to be of type `number`',
                data: {
                    value: 'b',
                    received: 'string',
                    expected: 'number',
                    schema: (schema.items as JsonSchema[])[1],
                    pointer: '#/1',
                },
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        // error has no specific code for parser tests
    });

    describe('maxItems', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                maxItems: 1,
            };
            const value = [1];
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                maxItems: 1,
            };
            const value = [1, 2];
            const error: JSLErrors.MaxItems = {
                type: 'error',
                code: 'max-items-error',
                message: 'Too many items in `#`, should be `1` at most, but got `2`',
                data: {
                    maximum: 1,
                    length: 2,
                    schema,
                    value,
                    pointer: '#',
                },
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                maxItems: 1,
            };
            const value = [1, 2];
            const error: JSLErrors.MaxItems = {
                type: 'error',
                code: 'max-items-error',
                message: 'Too many items in `#`, should be `1` at most, but got `2`',
                data: {
                    maximum: 1,
                    length: 2,
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
            const message = 'maxItems error message';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                maxItems: 1,
                nodeParameters: {errorMessages: {maxItems: message}},
            };
            const value = [1, 2];
            const error: JSLErrors.MaxItems = {
                type: 'error',
                code: 'max-items-error',
                message: 'Too many items in `#`, should be `1` at most, but got `2`',
                data: {
                    maximum: 1,
                    length: 2,
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
                state: {schema, errorMessages: {maxItems: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'maxItems error message';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                allOf: [{maxItems: 1}],
                nodeParameters: {errorMessages: {maxItems: message}},
            };
            const value = [1, 2];
            const error: JSLErrors.MaxItems = {
                type: 'error',
                code: 'max-items-error',
                message: 'Too many items in `#`, should be `1` at most, but got `2`',
                data: {
                    maximum: 1,
                    length: 2,
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
                state: {schema, errorMessages: {maxItems: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message', () => {
            const message = 'maxItems error message';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                maxItems: 1,
            };
            const value = [1, 2];
            const error: JSLErrors.MaxItems = {
                type: 'error',
                code: 'max-items-error',
                message: 'Too many items in `#`, should be `1` at most, but got `2`',
                data: {
                    maximum: 1,
                    length: 2,
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
                state: {schema, errorMessages: {maxItems: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });
    });

    describe('minItems', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                minItems: 2,
            };
            const value = [1, 2];
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                minItems: 2,
            };
            const value = [1];
            const error: JSLErrors.MinItems = {
                type: 'error',
                code: 'min-items-error',
                message: 'Too few items in `#`, should be at least `2`, but got `1`',
                data: {
                    minItems: 2,
                    length: 1,
                    pointer: '#',
                    schema,
                    value,
                },
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                minItems: 2,
            };
            const value = [1];
            const error: JSLErrors.MinItems = {
                type: 'error',
                code: 'min-items-error',
                message: 'Too few items in `#`, should be at least `2`, but got `1`',
                data: {
                    minItems: 2,
                    length: 1,
                    pointer: '#',
                    schema,
                    value,
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
            const message = 'minItems error message';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                minItems: 2,
                nodeParameters: {errorMessages: {minItems: message}},
            };
            const value = [1];
            const error: JSLErrors.MinItems = {
                type: 'error',
                code: 'min-items-error',
                message: 'Too few items in `#`, should be at least `2`, but got `1`',
                data: {
                    minItems: 2,
                    length: 1,
                    pointer: '#',
                    schema,
                    value,
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {minItems: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'minItems error message';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                allOf: [{minItems: 2}],
                nodeParameters: {errorMessages: {minItems: message}},
            };
            const value = [1];
            const error: JSLErrors.MinItems = {
                type: 'error',
                code: 'min-items-error',
                message: 'Too few items in `#`, should be at least `2`, but got `1`',
                data: {
                    minItems: 2,
                    length: 1,
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
                state: {schema, errorMessages: {minItems: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message', () => {
            const message = 'minItems error message';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                minItems: 2,
            };
            const value = [1];
            const error: JSLErrors.MinItems = {
                type: 'error',
                code: 'min-items-error',
                message: 'Too few items in `#`, should be at least `2`, but got `1`',
                data: {
                    minItems: 2,
                    length: 1,
                    pointer: '#',
                    schema,
                    value,
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {minItems: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });
    });

    describe('type', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
            };
            const value = [1];
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
            };
            const value = 'a';
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `a` (string) in `#` to be of type `array`',
                data: {
                    value: 'a',
                    received: 'string',
                    expected: 'array',
                    schema,
                    pointer: '#',
                },
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
            };
            const value = 'a';
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `a` (string) in `#` to be of type `array`',
                data: {
                    value: 'a',
                    received: 'string',
                    expected: 'array',
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
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                nodeParameters: {errorMessages: {type: message}},
            };
            const value = 'a';
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `a` (string) in `#` to be of type `array`',
                data: {
                    value: 'a',
                    received: 'string',
                    expected: 'array',
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
            const schema: JsonSchemaArray = {
                allOf: [{type: JsonSchemaType.Array}],
                nodeParameters: {errorMessages: {type: message}},
            };
            const value = 'a';
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `a` (string) in `#` to be of type `array`',
                data: {
                    value: 'a',
                    received: 'string',
                    expected: 'array',
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
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
            };
            const value = 'a';
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `a` (string) in `#` to be of type `array`',
                data: {
                    value: 'a',
                    received: 'string',
                    expected: 'array',
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

    describe('uniqueItems', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                uniqueItems: true,
            };
            const value = [1, 2];
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                uniqueItems: true,
            };
            const value = [1, 1];
            const error: JSLErrors.UniqueItems = {
                type: 'error',
                code: 'unique-items-error',
                message: 'Items in array must be unique. Value `1` in `#/1` is a duplicate of #/0.',
                data: {
                    pointer: '#/1',
                    duplicatePointer: '#/0',
                    arrayPointer: '#',
                    value: '1',
                    schema,
                },
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                uniqueItems: true,
            };
            const value = [1, 1];
            const error: JSLErrors.UniqueItems = {
                type: 'error',
                code: 'unique-items-error',
                message: 'Items in array must be unique. Value `1` in `#/1` is a duplicate of #/0.',
                data: {
                    pointer: '#/1',
                    duplicatePointer: '#/0',
                    arrayPointer: '#',
                    value: '1',
                    schema,
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
            const message = 'uniqueItems error message';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                uniqueItems: true,
                nodeParameters: {errorMessages: {uniqueItems: message}},
            };
            const value = [1, 1];
            const error: JSLErrors.UniqueItems = {
                type: 'error',
                code: 'unique-items-error',
                message: 'Items in array must be unique. Value `1` in `#/1` is a duplicate of #/0.',
                data: {
                    pointer: '#/1',
                    duplicatePointer: '#/0',
                    arrayPointer: '#',
                    value: '1',
                    schema,
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {uniqueItems: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'uniqueItems error message';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                allOf: [{uniqueItems: true}],
                nodeParameters: {errorMessages: {uniqueItems: message}},
            };
            const value = [1, 1];
            const error: JSLErrors.UniqueItems = {
                type: 'error',
                code: 'unique-items-error',
                message: 'Items in array must be unique. Value `1` in `#/1` is a duplicate of #/0.',
                data: {
                    pointer: '#/1',
                    duplicatePointer: '#/0',
                    arrayPointer: '#',
                    value: '1',
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
                state: {schema, errorMessages: {uniqueItems: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message', () => {
            const message = 'uniqueItems error message';
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                uniqueItems: true,
            };
            const value = [1, 1];
            const error: JSLErrors.UniqueItems = {
                type: 'error',
                code: 'unique-items-error',
                message: 'Items in array must be unique. Value `1` in `#/1` is a duplicate of #/0.',
                data: {
                    pointer: '#/1',
                    duplicatePointer: '#/0',
                    arrayPointer: '#',
                    value: '1',
                    schema,
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {uniqueItems: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });
    });
});
