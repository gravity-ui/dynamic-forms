import {createForm} from 'final-form';

import {SchemaRendererEventType} from '../../../constants';
import {getServiceFieldName} from '../../../utils';
import {SCHEMA_RENDERER_SERVICE_FIELD} from '../../constants';
import type {SchemaRendererState} from '../../types';
import {getDispatch} from '../get-dispatch';

describe('getDispatch', () => {
    test('does nothing if events are empty', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const callback = jest.fn();
        const state = {
            subscribers: {
                byId: {
                    'sub-1': {
                        callback,
                        subscription: {[SchemaRendererEventType.Patch]: true},
                    },
                },
                byName: new Map(),
                byPath: new Map(),
            },
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        getDispatch(form, 'form')([]);

        expect(callback).not.toHaveBeenCalled();
    });

    test('notifies subscribers with a matching type when the event has all: true', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const matching = jest.fn();
        const otherType = jest.fn();
        const state = {
            subscribers: {
                byId: {
                    'sub-1': {
                        callback: matching,
                        subscription: {[SchemaRendererEventType.Patch]: true},
                    },
                    'sub-2': {
                        callback: otherType,
                        subscription: {[SchemaRendererEventType.Error]: true},
                    },
                },
                byName: new Map(),
                byPath: new Map(),
            },
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        const events = [{type: SchemaRendererEventType.Patch, all: true}];

        getDispatch(form, 'form')(events);

        expect(matching).toHaveBeenCalledTimes(1);
        expect(matching).toHaveBeenCalledWith(events);
        expect(otherType).not.toHaveBeenCalled();
    });

    test('notifies subscribers registered on a path prefix', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const nested = jest.fn();
        const sibling = jest.fn();
        const state = {
            subscribers: {
                byId: {
                    'sub-nested': {
                        callback: nested,
                        schemaPaths: ['#/properties/a'],
                        subscription: {[SchemaRendererEventType.Patch]: true},
                    },
                    'sub-sibling': {
                        callback: sibling,
                        schemaPaths: ['#/properties/b'],
                        subscription: {[SchemaRendererEventType.Patch]: true},
                    },
                },
                byName: new Map(),
                byPath: new Map([
                    ['#/properties/a', new Set(['sub-nested'])],
                    ['#/properties/b', new Set(['sub-sibling'])],
                ]),
            },
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        const events = [
            {
                type: SchemaRendererEventType.Patch,
                paths: [['#', 'properties', 'a', 'minLength']],
            },
        ];

        getDispatch(form, 'form')(events);

        expect(nested).toHaveBeenCalledTimes(1);
        expect(nested).toHaveBeenCalledWith(events);
        expect(sibling).not.toHaveBeenCalled();
    });

    test('notifies subscribers registered by field name', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const matching = jest.fn();
        const other = jest.fn();
        const state = {
            subscribers: {
                byId: {
                    'sub-a': {
                        callback: matching,
                        name: 'form.a',
                        subscription: {[SchemaRendererEventType.Error]: true},
                    },
                    'sub-b': {
                        callback: other,
                        name: 'form.b',
                        subscription: {[SchemaRendererEventType.Error]: true},
                    },
                },
                byName: new Map([
                    ['form.a', new Set(['sub-a'])],
                    ['form.b', new Set(['sub-b'])],
                ]),
                byPath: new Map(),
            },
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        const events = [{type: SchemaRendererEventType.Error, names: ['form.a']}];

        getDispatch(form, 'form')(events);

        expect(matching).toHaveBeenCalledTimes(1);
        expect(matching).toHaveBeenCalledWith(events);
        expect(other).not.toHaveBeenCalled();
    });

    test('notifies a subscriber only once if it matches by path and by name', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const callback = jest.fn();
        const state = {
            subscribers: {
                byId: {
                    'sub-1': {
                        callback,
                        name: 'form.a',
                        schemaPaths: ['#/properties/a'],
                        subscription: {[SchemaRendererEventType.Patch]: true},
                    },
                },
                byName: new Map([['form.a', new Set(['sub-1'])]]),
                byPath: new Map([['#/properties/a', new Set(['sub-1'])]]),
            },
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        const events = [
            {
                type: SchemaRendererEventType.Patch,
                names: ['form.a'],
                paths: [['#', 'properties', 'a']],
            },
        ];

        getDispatch(form, 'form')(events);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(events);
    });

    test('notifies a subscriber only once if several events match', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const callback = jest.fn();
        const state = {
            subscribers: {
                byId: {
                    'sub-1': {
                        callback,
                        name: 'form.a',
                        subscription: {
                            [SchemaRendererEventType.Error]: true,
                            [SchemaRendererEventType.Patch]: true,
                        },
                    },
                },
                byName: new Map([['form.a', new Set(['sub-1'])]]),
                byPath: new Map(),
            },
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        const events = [
            {type: SchemaRendererEventType.Patch, names: ['form.a']},
            {type: SchemaRendererEventType.Error, names: ['form.a']},
        ];

        getDispatch(form, 'form')(events);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(events);
    });
});
