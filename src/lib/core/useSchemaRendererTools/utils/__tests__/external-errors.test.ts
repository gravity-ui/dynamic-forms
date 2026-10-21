import {createForm} from 'final-form';

import {SCHEMA_RENDERER_SERVICE_FIELD} from '../../../useSchemaRenderer/constants';
import type {SchemaRendererState} from '../../../useSchemaRenderer/types';
import {getServiceFieldName} from '../../../utils';
import {addExternalErrors, removeExternalErrors} from '../external-errors';

describe('addExternalErrors', () => {
    test('does nothing if neither priorityErrors nor regularErrors are passed', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const state = {
            priorityErrors: {},
            regularErrors: {},
            runValidate: jest.fn(),
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        addExternalErrors({form, headName: 'form'});

        expect(state.priorityErrors).toEqual({});
        expect(state.regularErrors).toEqual({});
        expect(state.runValidate).not.toHaveBeenCalled();
    });

    test('merges priorityErrors and calls runValidate', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const state = {
            priorityErrors: {keep: 'keep priority'},
            regularErrors: {keep: 'keep regular'},
            runValidate: jest.fn(),
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        addExternalErrors({
            form,
            headName: 'form',
            priorityErrors: {form: 'priority error'},
        });

        expect(state.priorityErrors).toEqual({
            keep: 'keep priority',
            form: 'priority error',
        });
        expect(state.regularErrors).toEqual({keep: 'keep regular'});
        expect(state.runValidate).toHaveBeenCalledTimes(1);
    });

    test('merges regularErrors and calls runValidate', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const state = {
            priorityErrors: {keep: 'keep priority'},
            regularErrors: {keep: 'keep regular'},
            runValidate: jest.fn(),
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        addExternalErrors({
            form,
            headName: 'form',
            regularErrors: {form: 'regular error'},
        });

        expect(state.priorityErrors).toEqual({keep: 'keep priority'});
        expect(state.regularErrors).toEqual({
            keep: 'keep regular',
            form: 'regular error',
        });
        expect(state.runValidate).toHaveBeenCalledTimes(1);
    });

    test('merges both maps and overwrites existing keys', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const state = {
            priorityErrors: {form: 'old priority'},
            regularErrors: {form: 'old regular'},
            runValidate: jest.fn(),
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        addExternalErrors({
            form,
            headName: 'form',
            priorityErrors: {form: 'new priority'},
            regularErrors: {form: 'new regular'},
        });

        expect(state.priorityErrors).toEqual({form: 'new priority'});
        expect(state.regularErrors).toEqual({form: 'new regular'});
        expect(state.runValidate).toHaveBeenCalledTimes(1);
    });
});

describe('removeExternalErrors', () => {
    test('removes names from both maps and calls runValidate', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const state = {
            priorityErrors: {form: 'priority', keep: 'keep priority'},
            regularErrors: {form: 'regular', keep: 'keep regular'},
            runValidate: jest.fn(),
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        removeExternalErrors({
            form,
            headName: 'form',
            removeFunctionOrNames: ['form'],
        });

        expect(state.priorityErrors).toEqual({keep: 'keep priority'});
        expect(state.regularErrors).toEqual({keep: 'keep regular'});
        expect(state.runValidate).toHaveBeenCalledTimes(1);
    });

    test('uses a function to replace both maps and calls runValidate', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const state = {
            priorityErrors: {a: 'priority a', b: 'priority b'},
            regularErrors: {a: 'regular a', b: 'regular b'},
            runValidate: jest.fn(),
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        removeExternalErrors({
            form,
            headName: 'form',
            removeFunctionOrNames: (priorityErrors, regularErrors) => ({
                priorityErrors: {a: priorityErrors.a},
                regularErrors: {b: regularErrors.b},
            }),
        });

        expect(state.priorityErrors).toEqual({a: 'priority a'});
        expect(state.regularErrors).toEqual({b: 'regular b'});
        expect(state.runValidate).toHaveBeenCalledTimes(1);
    });

    test('passes copies of error maps to the function', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const originalPriority = {form: 'priority'};
        const originalRegular = {form: 'regular'};
        const state = {
            priorityErrors: originalPriority,
            regularErrors: originalRegular,
            runValidate: jest.fn(),
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        removeExternalErrors({
            form,
            headName: 'form',
            removeFunctionOrNames: (priorityErrors, regularErrors) => {
                delete priorityErrors.form;
                delete regularErrors.form;

                return {
                    priorityErrors: {other: 'other priority'},
                    regularErrors: {other: 'other regular'},
                };
            },
        });

        expect(originalPriority).toEqual({form: 'priority'});
        expect(originalRegular).toEqual({form: 'regular'});
        expect(state.priorityErrors).toEqual({other: 'other priority'});
        expect(state.regularErrors).toEqual({other: 'other regular'});
        expect(state.runValidate).toHaveBeenCalledTimes(1);
    });
});
