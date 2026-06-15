import React from 'react';

import {useField} from 'react-final-form';

import {ENTITY_SERVICE_FIELD} from '../constants';
import type {EntityState} from '../types';

export const useEntityState = (name: string) => {
    const field = useField(ENTITY_SERVICE_FIELD, {subscription: {data: true}});

    const {config, errorsRef, mode, schema: rootSchema} = (field.meta.data || {}) as EntityState;
    const error = errorsRef?.current?.[name];

    const state = React.useMemo(
        () => ({
            config,
            error,
            mode,
            rootSchema,
        }),
        [config, error, mode, rootSchema],
    );

    return state;
};
