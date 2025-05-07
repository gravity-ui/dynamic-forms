import type {InternalFieldState, InternalFormState, MutableState, Tools} from 'final-form';
import omit from 'lodash/omit';

import {removeErrors, setErrors} from '../set-errors';
import type {ErrorsState} from '../types';

describe('set-errors', () => {
    describe('setErrors', () => {
        const fieldName = 'fieldName';
        const serviceFieldName = 'serviceFieldName';
        const priorityErrors: Exclude<ErrorsState['priorityErrors'], undefined> = {
            [fieldName]: 'priorityError',
        };
        const regularErrors: Exclude<ErrorsState['regularErrors'], undefined> = {
            [fieldName]: 'regularErrors',
        };
        const tools = {} as Tools<{}, {}>;

        let serviceField: InternalFieldState<any>;
        let mutableState: MutableState<{}, {}>;

        beforeEach(() => {
            serviceField = {data: {}} as InternalFieldState<any>;
            mutableState = {
                fields: {},
                formState: {} as InternalFormState,
                fieldSubscribers: {},
            };
        });

        it('should not modify state if service field does not exist', () => {
            setErrors([{serviceFieldName, priorityErrors, regularErrors}], mutableState, tools);

            expect(mutableState.fields).toEqual({});
        });

        it('should not modify state if errors are not provided', () => {
            mutableState.fields = {[serviceFieldName]: serviceField};

            setErrors(
                [{serviceFieldName, priorityErrors: undefined, regularErrors: undefined}],
                mutableState,
                tools,
            );

            expect(mutableState.fields[serviceFieldName].data).toEqual({});
        });

        it('should add priority errors to the errors state', () => {
            const anotherFieldName = 'anotherFieldName';
            const existingErrorsState = {
                priorityErrors: {[anotherFieldName]: 'anotherPriorityError'},
                regularErrors: {[anotherFieldName]: 'anotherRegularError'},
            };

            serviceField.data = existingErrorsState;
            mutableState.fields = {
                [serviceFieldName]: serviceField,
            };

            setErrors([{serviceFieldName, priorityErrors}], mutableState, tools);

            expect(mutableState.fields[serviceFieldName].data.priorityErrors).toEqual({
                ...existingErrorsState.priorityErrors,
                ...priorityErrors,
            });
            expect(mutableState.fields[serviceFieldName].data.regularErrors).toEqual(
                existingErrorsState.regularErrors,
            );
        });

        it('should add regular errors to the errors state', () => {
            const anotherFieldName = 'anotherFieldName';
            const existingErrorsState = {
                priorityErrors: {[anotherFieldName]: 'anotherPriorityError'},
                regularErrors: {[anotherFieldName]: 'anotherRegularError'},
            };

            serviceField.data = existingErrorsState;
            mutableState.fields = {
                [serviceFieldName]: serviceField,
            };

            setErrors([{serviceFieldName, regularErrors}], mutableState, tools);

            expect(mutableState.fields[serviceFieldName].data.priorityErrors).toEqual(
                existingErrorsState.priorityErrors,
            );
            expect(mutableState.fields[serviceFieldName].data.regularErrors).toEqual({
                ...existingErrorsState.regularErrors,
                ...regularErrors,
            });
        });

        it('should add both priority and regular errors to the errors state', () => {
            const anotherFieldName = 'anotherFieldName';
            const existingErrorsState = {
                priorityErrors: {[anotherFieldName]: 'anotherPriorityError'},
                regularErrors: {[anotherFieldName]: 'anotherRegularError'},
            };

            serviceField.data = existingErrorsState;
            mutableState.fields = {
                [serviceFieldName]: serviceField,
            };

            setErrors([{serviceFieldName, priorityErrors, regularErrors}], mutableState, tools);

            expect(mutableState.fields[serviceFieldName].data.priorityErrors).toEqual({
                ...existingErrorsState.priorityErrors,
                ...priorityErrors,
            });
            expect(mutableState.fields[serviceFieldName].data.regularErrors).toEqual({
                ...existingErrorsState.regularErrors,
                ...regularErrors,
            });
        });

        it('should override existing errors with the same field name', () => {
            const existingErrorsState = {
                priorityErrors: {[fieldName]: 'anotherPriorityError'},
                regularErrors: {[fieldName]: 'anotherRegularError'},
            };

            serviceField.data = existingErrorsState;
            mutableState.fields = {
                [serviceFieldName]: serviceField,
            };

            setErrors([{serviceFieldName, priorityErrors, regularErrors}], mutableState, tools);

            expect(mutableState.fields[serviceFieldName].data.priorityErrors).toEqual(
                priorityErrors,
            );
            expect(mutableState.fields[serviceFieldName].data.regularErrors).toEqual(regularErrors);
        });
    });

    describe('removeErrors', () => {
        const fieldName = 'fieldName';
        const serviceFieldName = 'serviceFieldName';
        const tools = {} as Tools<{}, {}>;

        let serviceField: InternalFieldState<any>;
        let mutableState: MutableState<{}, {}>;
        let errorsState: ErrorsState;

        beforeEach(() => {
            serviceField = {data: {}} as InternalFieldState<any>;
            mutableState = {
                fields: {},
                formState: {} as InternalFormState,
                fieldSubscribers: {},
            };
            errorsState = {
                priorityErrors: {[fieldName]: 'priorityError'},
                regularErrors: {[fieldName]: 'regularError'},
            };
        });

        it('should not modify state if service field does not exist', () => {
            const anotherFieldName = 'anotherFieldName';

            removeErrors(
                [{serviceFieldName, removeFunctionOrNames: [fieldName, anotherFieldName]}],
                mutableState,
                tools,
            );

            expect(mutableState.fields).toEqual({});
        });

        it('should not modify state if removeFunctionOrNames is not provided', () => {
            serviceField.data = errorsState;
            mutableState.fields = {
                [serviceFieldName]: serviceField,
            };

            removeErrors(
                [{serviceFieldName, removeFunctionOrNames: undefined as any}],
                mutableState,
                tools,
            );

            expect(mutableState.fields[serviceFieldName].data).toEqual(errorsState);
        });

        it('should not modify state if field names array is empty', () => {
            serviceField.data = errorsState;
            mutableState.fields = {
                [serviceFieldName]: serviceField,
            };

            removeErrors([{serviceFieldName, removeFunctionOrNames: []}], mutableState, tools);

            expect(mutableState.fields[serviceFieldName].data).toEqual(errorsState);
        });

        it('should remove errors by field names', () => {
            const anotherFieldName1 = 'anotherFieldName1';
            const anotherPriorityErrors1 = {[anotherFieldName1]: 'anotherPriorityError1'};
            const anotherRegularErrors1 = {[anotherFieldName1]: 'anotherRegularError1'};
            const anotherFieldName2 = 'anotherFieldName2';
            const anotherPriorityErrors2 = {[anotherFieldName2]: 'anotherPriorityError2'};
            const anotherRegularErrors2 = {[anotherFieldName2]: 'anotherRegularError2'};
            const anotherFieldName3 = 'anotherFieldName3';
            const anotherPriorityErrors3 = {[anotherFieldName3]: 'anotherPriorityError3'};
            const anotherRegularErrors3 = {[anotherFieldName3]: 'anotherRegularError3'};

            serviceField.data = {
                priorityErrors: {
                    ...anotherPriorityErrors1,
                    ...anotherPriorityErrors2,
                    ...anotherPriorityErrors3,
                },
                regularErrors: {
                    ...anotherRegularErrors1,
                    ...anotherRegularErrors2,
                    ...anotherRegularErrors3,
                },
            };
            mutableState.fields = {
                [serviceFieldName]: serviceField,
            };

            removeErrors(
                [{serviceFieldName, removeFunctionOrNames: [anotherFieldName1, anotherFieldName2]}],
                mutableState,
                tools,
            );

            expect(mutableState.fields[serviceFieldName].data.priorityErrors).toEqual(
                anotherPriorityErrors3,
            );
            expect(mutableState.fields[serviceFieldName].data.regularErrors).toEqual(
                anotherRegularErrors3,
            );
        });

        it('should remove errors using a custom function', () => {
            const anotherFieldName1 = 'anotherFieldName1';
            const anotherPriorityErrors1 = {[anotherFieldName1]: 'anotherPriorityError1'};
            const anotherRegularErrors1 = {[anotherFieldName1]: 'anotherRegularError1'};
            const anotherFieldName2 = 'anotherFieldName2';
            const anotherPriorityErrors2 = {[anotherFieldName2]: 'anotherPriorityError2'};
            const anotherRegularErrors2 = {[anotherFieldName2]: 'anotherRegularError2'};
            const anotherFieldName3 = 'anotherFieldName3';
            const anotherPriorityErrors3 = {[anotherFieldName3]: 'anotherPriorityError3'};
            const anotherRegularErrors3 = {[anotherFieldName3]: 'anotherRegularError3'};

            serviceField.data = {
                priorityErrors: {
                    ...anotherPriorityErrors1,
                    ...anotherPriorityErrors2,
                    ...anotherPriorityErrors3,
                },
                regularErrors: {
                    ...anotherRegularErrors1,
                    ...anotherRegularErrors2,
                    ...anotherRegularErrors3,
                },
            };
            mutableState.fields = {
                [serviceFieldName]: serviceField,
            };

            const customRemoveFunction = (state: ErrorsState): ErrorsState => {
                return {
                    priorityErrors: omit(state.priorityErrors, [anotherFieldName1]),
                    regularErrors: omit(state.regularErrors, [anotherFieldName2]),
                };
            };

            removeErrors(
                [{serviceFieldName, removeFunctionOrNames: customRemoveFunction}],
                mutableState,
                tools,
            );

            expect(mutableState.fields[serviceFieldName].data.priorityErrors).toEqual({
                ...anotherPriorityErrors2,
                ...anotherPriorityErrors3,
            });
            expect(mutableState.fields[serviceFieldName].data.regularErrors).toEqual({
                ...anotherRegularErrors1,
                ...anotherRegularErrors3,
            });
        });

        it('should handle non-existent field names', () => {
            const anotherFieldName = 'anotherFieldName';

            serviceField.data = errorsState;
            mutableState.fields = {
                [serviceFieldName]: serviceField,
            };

            removeErrors(
                [{serviceFieldName, removeFunctionOrNames: [anotherFieldName]}],
                mutableState,
                tools,
            );

            expect(mutableState.fields[serviceFieldName].data).toEqual(errorsState);
        });
    });
});
