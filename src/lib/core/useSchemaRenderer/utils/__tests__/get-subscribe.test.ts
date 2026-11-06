import {createForm} from 'final-form';

import {SchemaRendererEventType} from '../../../constants';
import {getServiceFieldName} from '../../../utils';
import {SCHEMA_RENDERER_SERVICE_FIELD} from '../../constants';
import type {SchemaRendererState} from '../../types';
import {getSubscribe} from '../get-subscribe';

describe('subscribe', () => {
    test('returns an id without registering if there is no renderer state', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const {subscribe} = getSubscribe(form, 'form');

        const id = subscribe({
            callback: jest.fn(),
            subscription: {[SchemaRendererEventType.Patch]: true},
        });

        expect(typeof id).toBe('string');
        expect(id.length).toBeGreaterThan(0);
    });

    test('registers a subscriber in byId', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const subscriber = {
            callback: jest.fn(),
            subscription: {[SchemaRendererEventType.Patch]: true},
        };
        const state = {
            subscribers: {
                byId: {},
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

        const {subscribe} = getSubscribe(form, 'form');
        const id = subscribe(subscriber);

        expect(state.subscribers.byId[id]).toBe(subscriber);
        expect(state.subscribers.byName.size).toBe(0);
        expect(state.subscribers.byPath.size).toBe(0);
    });

    test('indexes a subscriber by schemaPaths and name', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const state = {
            subscribers: {
                byId: {},
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

        const {subscribe} = getSubscribe(form, 'form');
        const id = subscribe({
            callback: jest.fn(),
            name: 'form.a',
            schemaPaths: ['#/properties/a', '#/properties/b'],
            subscription: {[SchemaRendererEventType.Patch]: true},
        });

        expect(state.subscribers.byName.get('form.a')).toEqual(new Set([id]));
        expect(state.subscribers.byPath.get('#/properties/a')).toEqual(new Set([id]));
        expect(state.subscribers.byPath.get('#/properties/b')).toEqual(new Set([id]));
    });

    test('adds a subscriber to an existing path and name index', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const state = {
            subscribers: {
                byId: {},
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

        const {subscribe} = getSubscribe(form, 'form');
        const firstId = subscribe({
            callback: jest.fn(),
            name: 'form.a',
            schemaPaths: ['#/properties/a'],
            subscription: {[SchemaRendererEventType.Patch]: true},
        });
        const secondId = subscribe({
            callback: jest.fn(),
            name: 'form.a',
            schemaPaths: ['#/properties/a'],
            subscription: {[SchemaRendererEventType.Error]: true},
        });

        expect(state.subscribers.byName.get('form.a')).toEqual(new Set([firstId, secondId]));
        expect(state.subscribers.byPath.get('#/properties/a')).toEqual(
            new Set([firstId, secondId]),
        );
    });
});

describe('unsubscribe', () => {
    test('does nothing if the subscriber id is unknown', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const state = {
            subscribers: {
                byId: {},
                byName: new Map([['form.a', new Set(['other'])]]),
                byPath: new Map([['#/properties/a', new Set(['other'])]]),
            },
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        const {unsubscribe} = getSubscribe(form, 'form');

        unsubscribe('missing');

        expect(state.subscribers.byId).toEqual({});
        expect(state.subscribers.byName.get('form.a')).toEqual(new Set(['other']));
        expect(state.subscribers.byPath.get('#/properties/a')).toEqual(new Set(['other']));
    });

    test('removes a subscriber from byId, byPath, and byName', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const state = {
            subscribers: {
                byId: {},
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

        const {subscribe, unsubscribe} = getSubscribe(form, 'form');
        const id = subscribe({
            callback: jest.fn(),
            name: 'form.a',
            schemaPaths: ['#/properties/a', '#/properties/b'],
            subscription: {[SchemaRendererEventType.Patch]: true},
        });

        unsubscribe(id);

        expect(state.subscribers.byId[id]).toBeUndefined();
        expect(state.subscribers.byName.has('form.a')).toBe(false);
        expect(state.subscribers.byPath.has('#/properties/a')).toBe(false);
        expect(state.subscribers.byPath.has('#/properties/b')).toBe(false);
    });

    test('keeps a shared path and name index when another subscriber remains', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const state = {
            subscribers: {
                byId: {},
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

        const {subscribe, unsubscribe} = getSubscribe(form, 'form');
        const firstId = subscribe({
            callback: jest.fn(),
            name: 'form.a',
            schemaPaths: ['#/properties/a'],
            subscription: {[SchemaRendererEventType.Patch]: true},
        });
        const secondId = subscribe({
            callback: jest.fn(),
            name: 'form.a',
            schemaPaths: ['#/properties/a'],
            subscription: {[SchemaRendererEventType.Error]: true},
        });

        unsubscribe(firstId);

        expect(state.subscribers.byId[firstId]).toBeUndefined();
        expect(state.subscribers.byId[secondId]).toBeDefined();
        expect(state.subscribers.byName.get('form.a')).toEqual(new Set([secondId]));
        expect(state.subscribers.byPath.get('#/properties/a')).toEqual(new Set([secondId]));
    });
});
