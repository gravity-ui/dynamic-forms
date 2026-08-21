import {createForm} from 'final-form';

import {JsonSchemaType} from '../../../constants';
import type {JSLErrors, JsonSchemaBoolean} from '../../../types';
import {getSchemaRootNode} from '../get-schema-root-node';
import {type ParseErrorParams, getParser} from '../parse-errors';

describe('validate booleans', () => {
    describe('type', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaBoolean = {type: JsonSchemaType.Boolean};
            const value = true;
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaBoolean = {type: JsonSchemaType.Boolean};
            const value = 'a';
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `a` (string) in `#` to be of type `boolean`',
                data: {
                    value: 'a',
                    received: 'string',
                    expected: 'boolean',
                    schema,
                    pointer: '#',
                },
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaBoolean = {type: JsonSchemaType.Boolean};
            const value = 'a';
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `a` (string) in `#` to be of type `boolean`',
                data: {
                    value: 'a',
                    received: 'string',
                    expected: 'boolean',
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
            const schema: JsonSchemaBoolean = {
                type: JsonSchemaType.Boolean,
                nodeParameters: {errorMessages: {type: message}},
            };
            const value = 'a';
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `a` (string) in `#` to be of type `boolean`',
                data: {
                    value: 'a',
                    received: 'string',
                    expected: 'boolean',
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
            const schema: JsonSchemaBoolean = {
                allOf: [{type: JsonSchemaType.Boolean}],
                nodeParameters: {errorMessages: {type: message}},
            };
            const value = 'a';
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `a` (string) in `#` to be of type `boolean`',
                data: {
                    value: 'a',
                    received: 'string',
                    expected: 'boolean',
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
            const schema: JsonSchemaBoolean = {type: JsonSchemaType.Boolean};
            const value = 'a';
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `a` (string) in `#` to be of type `boolean`',
                data: {
                    value: 'a',
                    received: 'string',
                    expected: 'boolean',
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
