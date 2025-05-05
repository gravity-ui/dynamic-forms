import omit from 'lodash/omit';

import {
    createMockMutableState,
    mockServiceFieldName,
    mockTools,
} from '../../../../__tests__/helpers.test';
import {removeErrors, setErrors} from '../set-errors';
import type {ErrorsState} from '../types';

const createMockErrorsKit = (errorPrefix = '', fieldNamePrefix = '') => {
    const fieldName = `fieldName${fieldNamePrefix}`;

    const errorsState: ErrorsState = {
        priorityErrors: {
            [fieldName]: `priorityError${errorPrefix}`,
        },
        regularErrors: {
            [fieldName]: `regularError${errorPrefix}`,
        },
    };

    return {errorsState, fieldName};
};

describe('set-errors', () => {
    describe('setErrors', () => {
        it('should not modify state if service field does not exist', () => {
            const errorsKit = createMockErrorsKit();
            const mutableState = createMockMutableState();

            setErrors(
                [{serviceFieldName: mockServiceFieldName, ...errorsKit.errorsState}],
                mutableState,
                mockTools,
            );

            expect(mutableState.fields).toEqual({});
        });

        it('should not modify state if errors are not provided', () => {
            const mutableState = createMockMutableState({[mockServiceFieldName]: {data: {}}});

            setErrors([{serviceFieldName: mockServiceFieldName}], mutableState, mockTools);

            expect(mutableState.fields[mockServiceFieldName].data).toEqual({});
        });

        it('should add priority errors to the errors state', () => {
            const existingErrorsKit = createMockErrorsKit();
            const errorsKit = createMockErrorsKit('2', '2');
            const mutableState = createMockMutableState({
                [mockServiceFieldName]: {data: existingErrorsKit.errorsState},
            });

            setErrors(
                [
                    {
                        serviceFieldName: mockServiceFieldName,
                        priorityErrors: errorsKit.errorsState.priorityErrors,
                    },
                ],
                mutableState,
                mockTools,
            );

            expect(mutableState.fields[mockServiceFieldName].data.priorityErrors).toEqual({
                ...existingErrorsKit.errorsState.priorityErrors,
                ...errorsKit.errorsState.priorityErrors,
            });
            expect(mutableState.fields[mockServiceFieldName].data.regularErrors).toEqual(
                existingErrorsKit.errorsState.regularErrors,
            );
        });

        it('should add regular errors to the errors state', () => {
            const existingErrorsKit = createMockErrorsKit();
            const errorsKit = createMockErrorsKit('2', '2');
            const mutableState = createMockMutableState({
                [mockServiceFieldName]: {data: existingErrorsKit.errorsState},
            });

            setErrors(
                [
                    {
                        serviceFieldName: mockServiceFieldName,
                        regularErrors: errorsKit.errorsState.regularErrors,
                    },
                ],
                mutableState,
                mockTools,
            );

            expect(mutableState.fields[mockServiceFieldName].data.priorityErrors).toEqual(
                existingErrorsKit.errorsState.priorityErrors,
            );
            expect(mutableState.fields[mockServiceFieldName].data.regularErrors).toEqual({
                ...existingErrorsKit.errorsState.regularErrors,
                ...errorsKit.errorsState.regularErrors,
            });
        });

        it('should add both priority and regular errors to the errors state', () => {
            const existingErrorsKit = createMockErrorsKit();
            const errorsKit = createMockErrorsKit('2', '2');
            const mutableState = createMockMutableState({
                [mockServiceFieldName]: {data: existingErrorsKit.errorsState},
            });

            setErrors(
                [
                    {
                        serviceFieldName: mockServiceFieldName,
                        ...errorsKit.errorsState,
                    },
                ],
                mutableState,
                mockTools,
            );

            expect(mutableState.fields[mockServiceFieldName].data.priorityErrors).toEqual({
                ...existingErrorsKit.errorsState.priorityErrors,
                ...errorsKit.errorsState.priorityErrors,
            });
            expect(mutableState.fields[mockServiceFieldName].data.regularErrors).toEqual({
                ...existingErrorsKit.errorsState.regularErrors,
                ...errorsKit.errorsState.regularErrors,
            });
        });

        it('should override existing errors with the same field name', () => {
            const existingErrorsKit = createMockErrorsKit();
            const errorsKit = createMockErrorsKit('2');
            const mutableState = createMockMutableState({
                [mockServiceFieldName]: {data: existingErrorsKit.errorsState},
            });

            setErrors(
                [
                    {
                        serviceFieldName: mockServiceFieldName,
                        ...errorsKit.errorsState,
                    },
                ],
                mutableState,
                mockTools,
            );

            expect(mutableState.fields[mockServiceFieldName].data.priorityErrors).toEqual({
                ...errorsKit.errorsState.priorityErrors,
            });
            expect(mutableState.fields[mockServiceFieldName].data.regularErrors).toEqual({
                ...errorsKit.errorsState.regularErrors,
            });
        });
    });

    describe('removeErrors', () => {
        it('should not modify state if service field does not exist', () => {
            const mutableState = createMockMutableState();

            removeErrors(
                [
                    {
                        serviceFieldName: mockServiceFieldName,
                        removeFunctionOrNames: ['fieldName', 'fieldName2'],
                    },
                ],
                mutableState,
                mockTools,
            );

            expect(mutableState.fields).toEqual({});
        });

        it('should not modify state if removeFunctionOrNames is not provided', () => {
            const existingErrorsKit = createMockErrorsKit();
            const mutableState = createMockMutableState({
                [mockServiceFieldName]: {data: existingErrorsKit.errorsState},
            });

            removeErrors(
                [{serviceFieldName: mockServiceFieldName}] as any,
                mutableState,
                mockTools,
            );

            expect(mutableState.fields[mockServiceFieldName].data).toEqual(
                existingErrorsKit.errorsState,
            );
        });

        it('should not modify state if field names array is empty ', () => {
            const existingErrorsKit = createMockErrorsKit();
            const mutableState = createMockMutableState({
                [mockServiceFieldName]: {data: existingErrorsKit.errorsState},
            });

            removeErrors(
                [{serviceFieldName: mockServiceFieldName, removeFunctionOrNames: []}],
                mutableState,
                mockTools,
            );

            expect(mutableState.fields[mockServiceFieldName].data).toEqual(
                existingErrorsKit.errorsState,
            );
        });

        it('should remove errors by field names', () => {
            const errorsKit1 = createMockErrorsKit('1', '1');
            const errorsKit2 = createMockErrorsKit('2', '2');
            const errorsKit3 = createMockErrorsKit('3', '3');

            const mutableState = createMockMutableState({
                [mockServiceFieldName]: {
                    data: {
                        priorityErrors: {
                            ...errorsKit1.errorsState.priorityErrors,
                            ...errorsKit2.errorsState.priorityErrors,
                            ...errorsKit3.errorsState.priorityErrors,
                        },
                        regularErrors: {
                            ...errorsKit1.errorsState.regularErrors,
                            ...errorsKit2.errorsState.regularErrors,
                            ...errorsKit3.errorsState.regularErrors,
                        },
                    },
                },
            });

            removeErrors(
                [
                    {
                        serviceFieldName: mockServiceFieldName,
                        removeFunctionOrNames: [errorsKit1.fieldName, errorsKit2.fieldName],
                    },
                ],
                mutableState,
                mockTools,
            );

            expect(mutableState.fields[mockServiceFieldName].data.priorityErrors).toEqual({
                ...errorsKit3.errorsState.priorityErrors,
            });
            expect(mutableState.fields[mockServiceFieldName].data.regularErrors).toEqual({
                ...errorsKit3.errorsState.regularErrors,
            });
        });

        it('should remove errors using a custom function', () => {
            const errorsKit1 = createMockErrorsKit('1', '1');
            const errorsKit2 = createMockErrorsKit('2', '2');
            const errorsKit3 = createMockErrorsKit('3', '3');

            const mutableState = createMockMutableState({
                [mockServiceFieldName]: {
                    data: {
                        priorityErrors: {
                            ...errorsKit1.errorsState.priorityErrors,
                            ...errorsKit2.errorsState.priorityErrors,
                            ...errorsKit3.errorsState.priorityErrors,
                        },
                        regularErrors: {
                            ...errorsKit1.errorsState.regularErrors,
                            ...errorsKit2.errorsState.regularErrors,
                            ...errorsKit3.errorsState.regularErrors,
                        },
                    },
                },
            });

            const customRemoveFunction = (state: ErrorsState): ErrorsState => {
                return {
                    priorityErrors: omit(state.priorityErrors, [errorsKit1.fieldName]),
                    regularErrors: omit(state.regularErrors, [errorsKit2.fieldName]),
                };
            };

            removeErrors(
                [
                    {
                        serviceFieldName: mockServiceFieldName,
                        removeFunctionOrNames: customRemoveFunction,
                    },
                ],
                mutableState,
                mockTools,
            );

            expect(mutableState.fields[mockServiceFieldName].data.priorityErrors).toEqual({
                ...errorsKit2.errorsState.priorityErrors,
                ...errorsKit3.errorsState.priorityErrors,
            });
            expect(mutableState.fields[mockServiceFieldName].data.regularErrors).toEqual({
                ...errorsKit1.errorsState.regularErrors,
                ...errorsKit3.errorsState.regularErrors,
            });
        });

        it('should handle non-existent field names', () => {
            const nonExistentFieldName = 'nonExistentFieldName';
            const existingErrorsKit = createMockErrorsKit();
            const mutableState = createMockMutableState({
                [mockServiceFieldName]: {data: existingErrorsKit.errorsState},
            });

            removeErrors(
                [
                    {
                        serviceFieldName: mockServiceFieldName,
                        removeFunctionOrNames: [nonExistentFieldName],
                    },
                ],
                mutableState,
                mockTools,
            );

            expect(mutableState.fields[mockServiceFieldName].data).toEqual(
                existingErrorsKit.errorsState,
            );
        });
    });
});
