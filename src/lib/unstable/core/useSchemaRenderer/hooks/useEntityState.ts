import React from 'react';

import {useField} from 'react-final-form';

import {ENTITY_SERVICE_FIELD} from '../constants';
import type {EntityState} from '../types';

export const useEntityState = (name: string) => {
    const field = useField(ENTITY_SERVICE_FIELD, {subscription: {data: true}});

    const {arrayAndObjectErrors, config, mode} = (field.meta.data || {}) as EntityState;
    const error = arrayAndObjectErrors?.[name];

    const state = React.useMemo(
        () => ({
            config,
            error,
            mode,
        }),
        [config, error, mode],
    );

    return state;
};
