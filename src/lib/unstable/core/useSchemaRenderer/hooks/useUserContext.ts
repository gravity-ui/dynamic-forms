import React from 'react';

import {useField, useForm} from 'react-final-form';

import {USER_CONTEXT_SERVICE_FIELD} from '../constants';
import type {UserContextState} from '../mutators';
import {guessHeadName} from '../utils';

export const useUserContext = <Context extends Record<string, unknown> = Record<string, unknown>>(
    name: string,
): UserContextState<Partial<Context>> => {
    const form = useForm();

    const headName = React.useMemo(
        () => guessHeadName(form.getRegisteredFields(), name),
        [form, name],
    );

    const field = useField(`${USER_CONTEXT_SERVICE_FIELD}.${headName}`, {
        subscription: {data: true},
    });

    const userContext = (field.meta.data || {}) as UserContextState<Partial<Context>>;

    return userContext;
};
