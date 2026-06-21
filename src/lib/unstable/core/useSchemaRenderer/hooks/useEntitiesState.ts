import React from 'react';

import {useField, useForm} from 'react-final-form';

import {ENTITY_SERVICE_FIELD} from '../constants';
import type {EntitiesState} from '../types';
import {guessHeadName} from '../utils';

export const useEntitiesState = (name: string) => {
    const form = useForm();

    const headName = React.useMemo(
        () => guessHeadName(form.getRegisteredFields(), name),
        [form, name],
    );

    const field = useField(`${ENTITY_SERVICE_FIELD}.${headName}`, {subscription: {data: true}});

    const {config, errorsRef, mode, schema: rootSchema} = (field.meta.data || {}) as EntitiesState;
    const error = errorsRef?.current?.[name];

    const state = React.useMemo(
        () => ({
            config,
            error,
            headName,
            mode,
            rootSchema,
        }),
        [config, error, headName, mode, rootSchema],
    );

    return state;
};
