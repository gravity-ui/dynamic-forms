import {createForm} from 'final-form';

import {SchemaRendererEventType} from '../../../constants';
import {SCHEMA_RENDERER_SERVICE_FIELD} from '../../../useSchemaRenderer/constants';
import type {SchemaRendererState} from '../../../useSchemaRenderer/types';
import {getServiceFieldName} from '../../../utils';
import {updateUserContext} from '../user-context';

describe('updateUserContext', () => {
    test('merges userContext and dispatches a UserContext event', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const originalContext = {keep: 'keep', foo: 'old'};
        const state = {
            dispatchEvent: jest.fn(),
            userContext: originalContext,
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        updateUserContext({
            form,
            headName: 'form',
            userContext: {foo: 'new', bar: 'bar'},
        });

        expect(originalContext).toEqual({keep: 'keep', foo: 'old'});
        expect(state.userContext).toEqual({keep: 'keep', foo: 'new', bar: 'bar'});
        expect(state.dispatchEvent).toHaveBeenCalledTimes(1);
        expect(state.dispatchEvent).toHaveBeenCalledWith([
            {type: SchemaRendererEventType.UserContext, all: true},
        ]);
    });

    test('replaces userContext when replace is true', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const nextContext = {foo: 'new'};
        const state = {
            dispatchEvent: jest.fn(),
            userContext: {keep: 'keep', foo: 'old'},
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        updateUserContext({
            form,
            headName: 'form',
            userContext: nextContext,
            replace: true,
        });

        expect(state.userContext).toBe(nextContext);
        expect(state.userContext).toEqual({foo: 'new'});
        expect(state.dispatchEvent).toHaveBeenCalledTimes(1);
        expect(state.dispatchEvent).toHaveBeenCalledWith([
            {type: SchemaRendererEventType.UserContext, all: true},
        ]);
    });
});
