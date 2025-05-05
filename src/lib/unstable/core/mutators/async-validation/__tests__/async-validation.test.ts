import type {InternalFormState, MutableState} from 'final-form';

import {mockServiceFieldName, mockTools} from '../../../../__tests__/helpers.test';
import {JsonSchemaType} from '../../../constants';
import {setValidationCache, setValidationWaiters} from '../async-validation';
import type {ValidationCache, ValidationWaiter} from '../types';

const createMockWaiterAndCache = (prefix = '') => {
    const fieldName = `fieldName${prefix}`;
    const waiter: ValidationWaiter = {
        schema: {type: JsonSchemaType.String},
        validator: jest.fn(),
        value: `value${prefix}`,
    };
    const cache: ValidationCache = {...waiter, result: `result${prefix}`};

    return {cache, fieldName, waiter};
};

const createMockMutableState = (fields: Record<string, any> = {}): MutableState<{}, {}> => {
    const mockFormState = {} as InternalFormState;

    return {
        fields,
        formState: mockFormState,
        fieldSubscribers: {},
    };
};

describe('async-validation', () => {
    describe('setValidationWaiters', () => {
        it('should not modify state if service field does not exist', () => {
            const {fieldName, waiter} = createMockWaiterAndCache();
            const mutableState = createMockMutableState();

            setValidationWaiters(
                [{serviceFieldName: mockServiceFieldName, waiters: {[fieldName]: waiter}}],
                mutableState,
                mockTools,
            );

            expect(mutableState.fields).toEqual({});
        });

        it('should not modify state if waiters are not provided', () => {
            const mutableState = createMockMutableState({
                [mockServiceFieldName]: {data: {}},
            });

            setValidationWaiters(
                [{serviceFieldName: mockServiceFieldName, waiters: undefined as any}],
                mutableState,
                mockTools,
            );

            expect(mutableState.fields[mockServiceFieldName].data).toEqual({});
        });

        it('should add waiter to the validation state', () => {
            const {fieldName, waiter} = createMockWaiterAndCache();
            const mutableState = createMockMutableState({
                [mockServiceFieldName]: {data: {}},
                [fieldName]: {},
            });

            setValidationWaiters(
                [{serviceFieldName: mockServiceFieldName, waiters: {[fieldName]: waiter}}],
                mutableState,
                mockTools,
            );

            expect(mutableState.fields[mockServiceFieldName].data.waiters).toEqual({
                [fieldName]: waiter,
            });
            expect(mutableState.fields[fieldName].validating).toBe(true);
        });

        it('should add waiters to the validation state', () => {
            const waiterAndCacheKit = createMockWaiterAndCache();
            const waiterAndCacheKit2 = createMockWaiterAndCache('2');

            const mutableState = createMockMutableState({
                [mockServiceFieldName]: {data: {}},
                [waiterAndCacheKit.fieldName]: {validating: false},
                [waiterAndCacheKit2.fieldName]: {validating: false},
            });

            setValidationWaiters(
                [
                    {
                        serviceFieldName: mockServiceFieldName,
                        waiters: {
                            [waiterAndCacheKit.fieldName]: waiterAndCacheKit.waiter,
                            [waiterAndCacheKit2.fieldName]: waiterAndCacheKit2.waiter,
                        },
                    },
                ],
                mutableState,
                mockTools,
            );

            expect(mutableState.fields[mockServiceFieldName].data.waiters).toEqual({
                [waiterAndCacheKit.fieldName]: waiterAndCacheKit.waiter,
                [waiterAndCacheKit2.fieldName]: waiterAndCacheKit2.waiter,
            });
            expect(mutableState.fields[waiterAndCacheKit.fieldName].validating).toBe(true);
            expect(mutableState.fields[waiterAndCacheKit2.fieldName].validating).toBe(true);
        });

        it('should merge waiters with existing waiters', () => {
            const waiterAndCacheKit = createMockWaiterAndCache();
            const existingWaiterAndCacheKit = createMockWaiterAndCache('existing');
            const mutableState = createMockMutableState({
                [mockServiceFieldName]: {
                    data: {
                        waiters: {
                            [existingWaiterAndCacheKit.fieldName]: existingWaiterAndCacheKit.waiter,
                        },
                    },
                },
                [waiterAndCacheKit.fieldName]: {},
            });

            setValidationWaiters(
                [
                    {
                        serviceFieldName: mockServiceFieldName,
                        waiters: {[waiterAndCacheKit.fieldName]: waiterAndCacheKit.waiter},
                    },
                ],
                mutableState,
                mockTools,
            );

            expect(mutableState.fields[mockServiceFieldName].data.waiters).toEqual({
                [existingWaiterAndCacheKit.fieldName]: existingWaiterAndCacheKit.waiter,
                [waiterAndCacheKit.fieldName]: waiterAndCacheKit.waiter,
            });
            expect(mutableState.fields[waiterAndCacheKit.fieldName].validating).toBe(true);
        });
    });

    describe('setValidationCache', () => {
        it('should not modify state if field does not exist', () => {
            const {cache, fieldName} = createMockWaiterAndCache();
            const mutableState = createMockMutableState();

            setValidationCache(
                [{serviceFieldName: mockServiceFieldName, cache: {[fieldName]: cache}}],
                mutableState,
                mockTools,
            );

            expect(mutableState.fields).toEqual({});
        });

        it('should not modify state if cache is not provided', () => {
            const mutableState = createMockMutableState({
                [mockServiceFieldName]: {data: {}},
            });

            setValidationCache(
                [{serviceFieldName: mockServiceFieldName, cache: undefined as any}],
                mutableState,
                mockTools,
            );

            expect(mutableState.fields[mockServiceFieldName].data).toEqual({});
        });

        it('should add cache to the validation state', () => {
            const {cache, fieldName} = createMockWaiterAndCache();
            const mutableState = createMockMutableState({
                [mockServiceFieldName]: {data: {}},
                [fieldName]: {},
            });

            setValidationCache(
                [{serviceFieldName: mockServiceFieldName, cache: {[fieldName]: cache}}],
                mutableState,
                mockTools,
            );

            expect(mutableState.fields[mockServiceFieldName].data.cache).toEqual({
                [fieldName]: [cache],
            });
        });

        it('should append to existing cache', () => {
            const fieldName = 'fieldName';
            const existingWaiterAndCacheKit = createMockWaiterAndCache('existing');
            const waiterAndCacheKit = createMockWaiterAndCache();
            const mutableState = createMockMutableState({
                [mockServiceFieldName]: {
                    data: {
                        cache: {
                            [fieldName]: [existingWaiterAndCacheKit.cache],
                        },
                    },
                },
                [fieldName]: {},
            });

            setValidationCache(
                [
                    {
                        serviceFieldName: mockServiceFieldName,
                        cache: {[fieldName]: waiterAndCacheKit.cache},
                    },
                ],
                mutableState,
                mockTools,
            );

            expect(mutableState.fields[mockServiceFieldName].data.cache).toEqual({
                [fieldName]: [existingWaiterAndCacheKit.cache, waiterAndCacheKit.cache],
            });
        });

        it('should clear waiter and set validating to false when waiter matches cache', () => {
            const fieldName = 'fieldName';
            const {cache, waiter} = createMockWaiterAndCache();
            const mutableState = createMockMutableState({
                [mockServiceFieldName]: {data: {waiters: {[fieldName]: waiter}}},
                [fieldName]: {validating: true},
            });

            setValidationCache(
                [{serviceFieldName: mockServiceFieldName, cache: {[fieldName]: cache}}],
                mutableState,
                mockTools,
            );

            expect(mutableState.fields[mockServiceFieldName].data.waiters).toEqual({});
            expect(mutableState.fields[fieldName].validating).toBe(false);
        });

        it('should not clear waiter when waiter does not match cache', () => {
            const fieldName = 'fieldName';
            const {waiter} = createMockWaiterAndCache('1');
            const {cache} = createMockWaiterAndCache('2');

            const mutableState = createMockMutableState({
                [mockServiceFieldName]: {data: {waiters: {[fieldName]: waiter}}},
                [fieldName]: {validating: true},
            });

            setValidationCache(
                [{serviceFieldName: mockServiceFieldName, cache: {[fieldName]: cache}}],
                mutableState,
                mockTools,
            );

            expect(mutableState.fields[mockServiceFieldName].data.waiters).toEqual({
                [fieldName]: waiter,
            });
            expect(mutableState.fields[fieldName].validating).toBe(true);
        });

        it('should handle multiple cache entries', () => {
            const fieldName = 'fieldName';
            const waiterAndCacheKit = createMockWaiterAndCache(fieldName);

            const fieldName2 = 'fieldName2';
            const waiterAndCacheKit2 = createMockWaiterAndCache(fieldName2);

            const mutableState = createMockMutableState({
                [mockServiceFieldName]: {
                    data: {
                        waiters: {
                            [fieldName]: waiterAndCacheKit.waiter,
                            [fieldName2]: waiterAndCacheKit2.waiter,
                        },
                    },
                },
                [fieldName]: {validating: true},
                [fieldName2]: {validating: true},
            });

            setValidationCache(
                [
                    {
                        serviceFieldName: mockServiceFieldName,
                        cache: {
                            [fieldName]: waiterAndCacheKit.cache,
                            [fieldName2]: waiterAndCacheKit2.cache,
                        },
                    },
                ],
                mutableState,
                mockTools,
            );

            expect(mutableState.fields[mockServiceFieldName].data.waiters).toEqual({});
            expect(mutableState.fields[fieldName].validating).toBe(false);
            expect(mutableState.fields[fieldName2].validating).toBe(false);
            expect(mutableState.fields[mockServiceFieldName].data.cache).toEqual({
                [fieldName]: [waiterAndCacheKit.cache],
                [fieldName2]: [waiterAndCacheKit2.cache],
            });
        });
    });
});
