import omit from 'lodash/omit';

import {USER_CONTEXT_SERVICE_FIELD} from '../../constants';
import {guessHeadName} from '../../utils';

import type {SetUserContextFunction, UserContextState} from './types';

export const setUserContext: SetUserContextFunction = ([{name, userContext}], mutableState) => {
    const registeredFields = Object.keys(mutableState.fields);
    const headName = guessHeadName(registeredFields, name);

    if (headName) {
        const field = mutableState.fields[`${USER_CONTEXT_SERVICE_FIELD}.${headName}`];

        if (field) {
            const currentUserContext = field.data as UserContextState;

            field.data = {
                ...(typeof userContext === 'function'
                    ? userContext(omit(currentUserContext, 'headName'))
                    : {...currentUserContext, ...userContext}),
                headName,
            };
        }
    }
};
