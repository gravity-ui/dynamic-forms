import {createForm} from 'final-form';

import {JsonSchemaType, SchemaRendererEventType} from '../../../constants';
import type {JsonSchemaNumber, JsonSchemaString} from '../../../types';
import {getServiceFieldName} from '../../../utils';
import {SCHEMA_RENDERER_SERVICE_FIELD} from '../../constants';
import type {SchemaRendererState} from '../../types';
import {getValidate} from '../get-validate';

describe('getValidate', () => {
    test('returns false if there is no renderer state', () => {
        const form = createForm<any>({onSubmit: () => {}, initialValues: {form: 1}});
        const validate = getValidate(form, 'form');

        expect(validate()).toBe(false);
    });

    test('returns an error when the value fails jsl validation', () => {
        const schema: JsonSchemaString = {type: JsonSchemaType.String};
        const form = createForm<any>({onSubmit: () => {}, initialValues: {form: 1}});
        const state = {
            cache: {},
            config: {},
            dispatchEvent: jest.fn(),
            errors: {},
            errorMessages: {},
            priorityErrors: {},
            regularErrors: {},
            runValidate: jest.fn(),
            schema,
            waiters: {},
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        const validate = getValidate(form, 'form');

        expect(validate()).toBe('error');
        expect(state.errors).toEqual({form: 'Expected `1` (number) in `#` to be of type `string`'});
        expect(state.dispatchEvent).toHaveBeenCalledWith([
            {type: SchemaRendererEventType.Error, names: ['form']},
        ]);
        expect(state.waiters).toEqual({});
    });

    test('returns an error from a nodeParameters validator', () => {
        const message = 'nodeParameters error message';
        const schema: JsonSchemaString = {
            type: JsonSchemaType.String,
            nodeParameters: {validator: () => message},
        };
        const form = createForm<any>({onSubmit: () => {}, initialValues: {form: '1'}});
        const state = {
            cache: {},
            config: {},
            dispatchEvent: jest.fn(),
            errors: {},
            errorMessages: {},
            priorityErrors: {},
            regularErrors: {},
            runValidate: jest.fn(),
            schema,
            waiters: {},
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        const validate = getValidate(form, 'form');

        expect(validate()).toBe('error');
        expect(state.errors).toEqual({form: message});
        expect(state.dispatchEvent).toHaveBeenCalledWith([
            {type: SchemaRendererEventType.Error, names: ['form']},
        ]);
    });

    test('returns an error from regularErrors', () => {
        const message = 'regular error message';
        const schema: JsonSchemaString = {type: JsonSchemaType.String};
        const form = createForm<any>({onSubmit: () => {}, initialValues: {form: '1'}});
        const state = {
            cache: {},
            config: {},
            dispatchEvent: jest.fn(),
            errors: {},
            errorMessages: {},
            priorityErrors: {},
            regularErrors: {form: message},
            runValidate: jest.fn(),
            schema,
            waiters: {},
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        const validate = getValidate(form, 'form');

        expect(validate()).toBe('error');
        expect(state.errors).toEqual({form: message});
        expect(state.dispatchEvent).toHaveBeenCalledWith([
            {type: SchemaRendererEventType.Error, names: ['form']},
        ]);
    });

    test('returns an error from priorityErrors', () => {
        const message = 'priority error message';
        const schema: JsonSchemaString = {type: JsonSchemaType.String};
        const form = createForm<any>({onSubmit: () => {}, initialValues: {form: '1'}});
        const state = {
            cache: {},
            config: {},
            dispatchEvent: jest.fn(),
            errors: {},
            errorMessages: {},
            priorityErrors: {form: message},
            regularErrors: {},
            runValidate: jest.fn(),
            schema,
            waiters: {},
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        const validate = getValidate(form, 'form');

        expect(validate()).toBe('error');
        expect(state.errors).toEqual({form: message});
        expect(state.dispatchEvent).toHaveBeenCalledWith([
            {type: SchemaRendererEventType.Error, names: ['form']},
        ]);
    });

    test('stores a waiter and returns a promise for an async nodeParameters validator', async () => {
        const message = 'async nodeParameters error message';
        const validator = () => Promise.resolve(message);
        const schema: JsonSchemaString = {
            type: JsonSchemaType.String,
            nodeParameters: {validator},
        };
        const value = '1';
        const form = createForm<any>({onSubmit: () => {}, initialValues: {form: value}});
        const state = {
            cache: {},
            config: {},
            dispatchEvent: jest.fn(),
            errors: {},
            errorMessages: {},
            priorityErrors: {},
            regularErrors: {},
            runValidate: jest.fn(),
            schema,
            waiters: {},
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        const validate = getValidate(form, 'form');
        const result = validate();

        expect(result).toBeInstanceOf(Promise);
        expect(state.errors).toEqual({});
        expect(state.waiters.form).toEqual({
            promise: expect.any(Promise),
            schema,
            validator,
            value,
        });
        expect(state.dispatchEvent).not.toHaveBeenCalled();

        await expect(result).resolves.toBe(false);

        expect(state.cache.form).toEqual([{schema, validator, value, result: message}]);
        expect(state.runValidate).toHaveBeenCalled();

        expect(validate()).toBe('error');
        expect(state.errors).toEqual({form: message});
    });

    test('jsl errors override regularErrors', () => {
        const schema: JsonSchemaString = {type: JsonSchemaType.String};
        const form = createForm<any>({onSubmit: () => {}, initialValues: {form: 1}});
        const state = {
            cache: {},
            config: {},
            dispatchEvent: jest.fn(),
            errors: {},
            errorMessages: {},
            priorityErrors: {},
            regularErrors: {form: 'regular error message'},
            runValidate: jest.fn(),
            schema,
            waiters: {},
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        const validate = getValidate(form, 'form');

        expect(validate()).toBe('error');
        expect(state.errors).toEqual({
            form: 'Expected `1` (number) in `#` to be of type `string`',
        });
    });

    test('nodeParameters errors override jsl errors', () => {
        const message = 'nodeParameters error message';
        const schema: JsonSchemaString = {
            type: JsonSchemaType.String,
            nodeParameters: {validator: () => message},
        };
        const form = createForm<any>({onSubmit: () => {}, initialValues: {form: 1}});
        const state = {
            cache: {},
            config: {},
            dispatchEvent: jest.fn(),
            errors: {},
            errorMessages: {},
            priorityErrors: {},
            regularErrors: {},
            runValidate: jest.fn(),
            schema,
            waiters: {},
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        const validate = getValidate(form, 'form');

        expect(validate()).toBe('error');
        expect(state.errors).toEqual({form: message});
    });

    test('priorityErrors override nodeParameters errors', () => {
        const message = 'priority error message';
        const schema: JsonSchemaString = {
            type: JsonSchemaType.String,
            nodeParameters: {validator: () => 'nodeParameters error message'},
        };
        const form = createForm<any>({onSubmit: () => {}, initialValues: {form: '1'}});
        const state = {
            cache: {},
            config: {},
            dispatchEvent: jest.fn(),
            errors: {},
            errorMessages: {},
            priorityErrors: {form: message},
            regularErrors: {},
            runValidate: jest.fn(),
            schema,
            waiters: {},
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        const validate = getValidate(form, 'form');

        expect(validate()).toBe('error');
        expect(state.errors).toEqual({form: message});
    });

    test('recomputes the schema node when the schema changes', () => {
        const schema: JsonSchemaString = {type: JsonSchemaType.String};
        const nextSchema: JsonSchemaNumber = {type: JsonSchemaType.Number};
        const form = createForm<any>({onSubmit: () => {}, initialValues: {form: '1'}});
        const state = {
            cache: {},
            config: {},
            dispatchEvent: jest.fn(),
            errors: {},
            errorMessages: {},
            priorityErrors: {},
            regularErrors: {},
            runValidate: jest.fn(),
            schema,
            waiters: {},
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        const validate = getValidate(form, 'form');

        expect(validate()).toBe(false);
        expect(state.errors).toEqual({});

        state.schema = nextSchema;

        expect(validate()).toBe('error');
        expect(state.errors).toEqual({form: 'Expected `1` (string) in `#` to be of type `number`'});
    });

    test('does not dispatch an event when errors did not change', () => {
        const schema: JsonSchemaString = {type: JsonSchemaType.String};
        const form = createForm<any>({onSubmit: () => {}, initialValues: {form: 1}});
        const state = {
            cache: {},
            config: {},
            dispatchEvent: jest.fn(),
            errors: {},
            errorMessages: {},
            priorityErrors: {},
            regularErrors: {},
            runValidate: jest.fn(),
            schema,
            waiters: {},
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        const validate = getValidate(form, 'form');

        expect(validate()).toBe('error');
        expect(state.dispatchEvent).toHaveBeenCalledTimes(1);

        expect(validate()).toBe('error');
        expect(state.dispatchEvent).toHaveBeenCalledTimes(1);
    });

    test('flattens object-like errors onto child field names', () => {
        const schema: JsonSchemaString = {type: JsonSchemaType.String};
        const form = createForm<any>({onSubmit: () => {}, initialValues: {form: '1'}});
        const state = {
            cache: {},
            config: {},
            dispatchEvent: jest.fn(),
            errors: {},
            errorMessages: {},
            priorityErrors: {},
            regularErrors: {form: {a: 'nested error message'}},
            runValidate: jest.fn(),
            schema,
            waiters: {},
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        const validate = getValidate(form, 'form');

        expect(validate()).toBe('error');
        expect(state.errors).toEqual({'form.a': 'nested error message'});
        expect(state.dispatchEvent).toHaveBeenCalledWith([
            {type: SchemaRendererEventType.Error, names: ['form.a']},
        ]);
    });
});
