import omit from 'lodash/omit';

import {ENTITY_SERVICE_FIELD} from '../../constants';
import {guessHeadName} from '../../utils';

import type {RemoveExternalErrorsFunction, SetExternalErrorsFunction} from './types';

export const setExternalErrors: SetExternalErrorsFunction = (
    [{priorityErrors, regularErrors}],
    mutableState,
) => {
    const registeredFields = Object.keys(mutableState.fields);

    Object.entries(priorityErrors || {}).forEach(([key, value]) => {
        const headName = guessHeadName(registeredFields, key);

        if (headName) {
            const field = mutableState.fields[headName];

            if (field) {
                field.data = {
                    ...field.data,
                    priorityErrors: {
                        ...field.data.priorityErrors,
                        [key]: value,
                    },
                };
            }
        }
    });

    Object.entries(regularErrors || {}).forEach(([key, value]) => {
        const headName = guessHeadName(registeredFields, key);

        if (headName) {
            const field = mutableState.fields[headName];

            if (field) {
                field.data = {
                    ...field.data,
                    regularErrors: {
                        ...field.data.regularErrors,
                        [key]: value,
                    },
                };
            }
        }
    });
};

export const removeExternalErrors: RemoveExternalErrorsFunction = (
    [{removeFunctionOrNames}],
    mutableState,
) => {
    const registeredFields = Object.keys(mutableState.fields);

    if (Array.isArray(removeFunctionOrNames)) {
        removeFunctionOrNames.forEach((name) => {
            const headName = guessHeadName(registeredFields, name);

            if (headName) {
                const field = mutableState.fields[headName];

                if (field) {
                    field.data = {
                        ...field.data,
                        priorityErrors: omit({...field.data.priorityErrors}, name),
                        regularErrors: omit({...field.data.regularErrors}, name),
                    };
                }
            }
        });
    } else {
        registeredFields.forEach((fieldName) => {
            if (fieldName.startsWith(ENTITY_SERVICE_FIELD)) {
                const headName = fieldName.slice(`${ENTITY_SERVICE_FIELD}.`.length);
                const field = mutableState.fields[headName];

                if (field) {
                    const {priorityErrors, regularErrors} = removeFunctionOrNames(headName, {
                        priorityErrors: field.data.priorityErrors,
                        regularErrors: field.data.regularErrors,
                    });

                    field.data = {
                        ...field.data,
                        priorityErrors,
                        regularErrors,
                    };
                }
            }
        });
    }
};
