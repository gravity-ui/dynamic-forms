import omit from 'lodash/omit';

import type {ErrorsState, RemoveErrorsFunction, SetErrorsFunction} from './types';

export const setErrors: SetErrorsFunction = (
    [{serviceFieldName, priorityErrors, regularErrors}],
    mutableState,
) => {
    const errorsState = mutableState.fields[serviceFieldName]?.data as ErrorsState | undefined;

    if (errorsState && (priorityErrors || regularErrors)) {
        errorsState.priorityErrors = {
            ...errorsState.priorityErrors,
            ...(priorityErrors || {}),
        };
        errorsState.regularErrors = {
            ...errorsState.regularErrors,
            ...(regularErrors || {}),
        };
    }
};

export const removeErrors: RemoveErrorsFunction = (
    [{removeFunctionOrNames, serviceFieldName}],
    mutableState,
) => {
    const errorsState = mutableState.fields[serviceFieldName]?.data as ErrorsState | undefined;

    if (errorsState && removeFunctionOrNames) {
        const {priorityErrors, regularErrors} = Array.isArray(removeFunctionOrNames)
            ? {
                  priorityErrors: omit(errorsState.priorityErrors, removeFunctionOrNames),
                  regularErrors: omit(errorsState.regularErrors, removeFunctionOrNames),
              }
            : removeFunctionOrNames(errorsState);

        errorsState.priorityErrors = priorityErrors;
        errorsState.regularErrors = regularErrors;
    }
};
