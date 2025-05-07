import type {InternalFieldState, InternalFormState, MutableState, Tools} from 'final-form';

import {JsonSchemaType} from '../../../constants';
import {setValidationCache, setValidationWaiters} from '../async-validation';
import type {ValidationCache, ValidationWaiter} from '../types';

describe('async-validation', () => {
    describe('setValidationWaiters', () => {
        const fieldName = 'fieldName';
        const serviceFieldName = 'serviceFieldName';
        const tools = {} as Tools<{}, {}>;

        let serviceField: InternalFieldState<any>;
        let field: InternalFieldState<any>;
        let mutableState: MutableState<{}, {}>;
        let waiter: ValidationWaiter;

        beforeEach(() => {
            serviceField = {data: {}} as InternalFieldState<any>;
            field = {} as InternalFieldState<any>;
            mutableState = {
                fields: {},
                formState: {} as InternalFormState,
                fieldSubscribers: {},
            };
            waiter = {
                schema: {type: JsonSchemaType.String},
                validator: jest.fn(),
                value: 'value',
            };
        });

        it('should not modify state if service field does not exist', () => {
            setValidationWaiters(
                [{serviceFieldName, waiters: {[fieldName]: waiter}}],
                mutableState,
                tools,
            );

            expect(mutableState.fields).toEqual({});
        });

        it('should not modify state if waiters are not provided', () => {
            mutableState.fields = {[serviceFieldName]: serviceField};

            setValidationWaiters(
                [{serviceFieldName, waiters: undefined as any}],
                mutableState,
                tools,
            );

            expect(mutableState.fields[serviceFieldName].data).toEqual({});
        });

        it('should add waiter to the validation state', () => {
            mutableState.fields = {
                [serviceFieldName]: serviceField,
                [fieldName]: field,
            };

            setValidationWaiters(
                [{serviceFieldName, waiters: {[fieldName]: waiter}}],
                mutableState,
                tools,
            );

            expect(mutableState.fields[serviceFieldName].data.waiters).toEqual({
                [fieldName]: waiter,
            });
            expect(mutableState.fields[fieldName].validating).toBe(true);
        });

        it('should add waiters to the validation state', () => {
            const anotherFieldName = 'anotherFieldName';
            const anotherField = {} as InternalFieldState<any>;
            const anotherWaiter = {
                schema: {type: JsonSchemaType.String},
                validator: jest.fn(),
                value: 'anotherValue',
            };

            mutableState.fields = {
                [serviceFieldName]: serviceField,
                [fieldName]: {...field, validating: false},
                [anotherFieldName]: {...anotherField, validating: false},
            };

            setValidationWaiters(
                [
                    {
                        serviceFieldName,
                        waiters: {
                            [fieldName]: waiter,
                            [anotherFieldName]: anotherWaiter,
                        },
                    },
                ],
                mutableState,
                tools,
            );

            expect(mutableState.fields[serviceFieldName].data.waiters).toEqual({
                [fieldName]: waiter,
                [anotherFieldName]: anotherWaiter,
            });
            expect(mutableState.fields[fieldName].validating).toBe(true);
            expect(mutableState.fields[anotherFieldName].validating).toBe(true);
        });

        it('should merge waiters with existing waiters', () => {
            const anotherFieldName = 'anotherFieldName';
            const anotherWaiter = {
                schema: {type: JsonSchemaType.String},
                validator: jest.fn(),
                value: 'anotherValue',
            };

            serviceField.data = {
                waiters: {
                    [anotherFieldName]: anotherWaiter,
                },
            };
            mutableState.fields = {
                [serviceFieldName]: serviceField,
                [fieldName]: field,
            };

            setValidationWaiters(
                [{serviceFieldName, waiters: {[fieldName]: waiter}}],
                mutableState,
                tools,
            );

            expect(mutableState.fields[serviceFieldName].data.waiters).toEqual({
                [anotherFieldName]: anotherWaiter,
                [fieldName]: waiter,
            });
            expect(mutableState.fields[fieldName].validating).toBe(true);
        });
    });

    describe('setValidationCache', () => {
        const fieldName = 'fieldName';
        const serviceFieldName = 'serviceFieldName';
        const tools = {} as Tools<{}, {}>;

        let serviceField: InternalFieldState<any>;
        let field: InternalFieldState<any>;
        let mutableState: MutableState<{}, {}>;
        let waiter: ValidationWaiter;
        let cache: ValidationCache;

        beforeEach(() => {
            serviceField = {
                data: {},
            } as InternalFieldState<any>;
            field = {} as InternalFieldState<any>;
            mutableState = {
                fields: {},
                formState: {} as InternalFormState,
                fieldSubscribers: {},
            };
            waiter = {
                schema: {type: JsonSchemaType.String},
                validator: jest.fn(),
                value: 'value',
            };
            cache = {
                ...waiter,
                result: 'result',
            };
        });

        it('should not modify state if field does not exist', () => {
            setValidationCache(
                [{serviceFieldName, cache: {[fieldName]: cache}}],
                mutableState,
                tools,
            );

            expect(mutableState.fields).toEqual({});
        });

        it('should not modify state if cache is not provided', () => {
            mutableState.fields = {[serviceFieldName]: serviceField};

            setValidationCache([{serviceFieldName, cache: undefined as any}], mutableState, tools);

            expect(mutableState.fields[serviceFieldName].data).toEqual({});
        });

        it('should add cache to the validation state', () => {
            mutableState.fields = {
                [serviceFieldName]: serviceField,
                [fieldName]: field,
            };

            setValidationCache(
                [{serviceFieldName, cache: {[fieldName]: cache}}],
                mutableState,
                tools,
            );

            expect(mutableState.fields[serviceFieldName].data.cache).toEqual({
                [fieldName]: [cache],
            });
        });

        it('should append to existing cache', () => {
            const existingCache: ValidationCache = {
                schema: {type: JsonSchemaType.String},
                validator: jest.fn(),
                value: 'existingValue',
                result: 'existingResult',
            };

            serviceField.data = {
                cache: {
                    [fieldName]: [existingCache],
                },
            };
            mutableState.fields = {
                [serviceFieldName]: serviceField,
                [fieldName]: field,
            };

            setValidationCache(
                [{serviceFieldName, cache: {[fieldName]: cache}}],
                mutableState,
                tools,
            );

            expect(mutableState.fields[serviceFieldName].data.cache).toEqual({
                [fieldName]: [existingCache, cache],
            });
        });

        it('should clear waiter and set validating to false when waiter matches cache', () => {
            serviceField.data = {
                waiters: {
                    [fieldName]: waiter,
                },
            };
            mutableState.fields = {
                [serviceFieldName]: serviceField,
                [fieldName]: {...field, validating: true},
            };

            setValidationCache(
                [{serviceFieldName, cache: {[fieldName]: cache}}],
                mutableState,
                tools,
            );

            expect(mutableState.fields[serviceFieldName].data.waiters).toEqual({});
            expect(mutableState.fields[fieldName].validating).toBe(false);
        });

        it('should not clear waiter when waiter does not match cache', () => {
            const anotherCache: ValidationCache = {
                schema: {type: JsonSchemaType.String},
                validator: jest.fn(),
                value: 'anotherValue',
                result: 'anotherResult',
            };

            serviceField.data = {
                waiters: {
                    [fieldName]: waiter,
                },
            };
            mutableState.fields = {
                [serviceFieldName]: serviceField,
                [fieldName]: {...field, validating: true},
            };

            setValidationCache(
                [{serviceFieldName, cache: {[fieldName]: anotherCache}}],
                mutableState,
                tools,
            );

            expect(mutableState.fields[serviceFieldName].data.waiters).toEqual({
                [fieldName]: waiter,
            });
            expect(mutableState.fields[fieldName].validating).toBe(true);
        });

        it('should handle multiple cache entries', () => {
            const anotherFieldName = 'anotherFieldName';
            const anotherField = {} as InternalFieldState<any>;
            const anotherWaiter = {
                schema: {type: JsonSchemaType.String},
                validator: jest.fn(),
                value: 'anotherValue',
            };
            const anotherCache = {
                ...anotherWaiter,
                result: 'anotherResult',
            };

            serviceField.data = {
                waiters: {
                    [fieldName]: waiter,
                    [anotherFieldName]: anotherWaiter,
                },
            };
            mutableState.fields = {
                [serviceFieldName]: serviceField,
                [fieldName]: {...field, validating: true},
                [anotherFieldName]: {...anotherField, validating: true},
            };

            setValidationCache(
                [
                    {
                        serviceFieldName,
                        cache: {
                            [fieldName]: cache,
                            [anotherFieldName]: anotherCache,
                        },
                    },
                ],
                mutableState,
                tools,
            );

            expect(mutableState.fields[serviceFieldName].data.waiters).toEqual({});
            expect(mutableState.fields[fieldName].validating).toBe(false);
            expect(mutableState.fields[anotherFieldName].validating).toBe(false);
            expect(mutableState.fields[serviceFieldName].data.cache).toEqual({
                [fieldName]: [cache],
                [anotherFieldName]: [anotherCache],
            });
        });
    });
});
