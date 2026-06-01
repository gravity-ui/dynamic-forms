import omit from 'lodash/omit';

import type {RemoveExternalErrorsFunction, SetExternalErrorsFunction} from './types';

export const setExternalErrors: SetExternalErrorsFunction = (
    [{headName, priorityErrors, regularErrors}],
    mutableState,
) => {
    const field = mutableState.fields[headName];

    if (field && (priorityErrors || regularErrors)) {
        field.data = {
            ...field.data,
            priorityErrors: {
                ...field.data.priorityErrors,
                ...(priorityErrors || {}),
            },
            regularErrors: {
                ...field.data.regularErrors,
                ...(regularErrors || {}),
            },
        };
    }
};

export const removeExternalErrors: RemoveExternalErrorsFunction = (
    [{headName, removeFunctionOrNames}],
    mutableState,
) => {
    const field = mutableState.fields[headName];

    if (field && removeFunctionOrNames) {
        const {priorityErrors, regularErrors} = Array.isArray(removeFunctionOrNames)
            ? {
                  priorityErrors: omit({...field.data.priorityErrors}, removeFunctionOrNames),
                  regularErrors: omit({...field.data.regularErrors}, removeFunctionOrNames),
              }
            : removeFunctionOrNames({
                  priorityErrors: field.data.priorityErrors,
                  regularErrors: field.data.regularErrors,
              });

        field.data = {
            ...field.data,
            priorityErrors,
            regularErrors,
        };
    }
};
