import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';

import type {
    SetValidationCacheFunction,
    SetValidationWaitersFunction,
    ValidationState,
} from '../../types';

export const setValidationWaiters: SetValidationWaitersFunction = (
    [{name, waiters}],
    mutableState,
) => {
    const validationState = mutableState.fields[name]?.data as ValidationState | undefined;

    if (validationState && waiters) {
        Object.keys(waiters).forEach((waiterName) => {
            validationState.waiters = {
                ...validationState.waiters,
                [waiterName]: waiters[waiterName],
            };

            const waiterField = mutableState.fields[waiterName];

            if (waiterField) {
                waiterField.validating = true;
            }
        });
    }
};

export const setValidationCache: SetValidationCacheFunction = ([{cache, name}], mutableState) => {
    const validationState = mutableState.fields[name]?.data as ValidationState | undefined;

    if (validationState && cache) {
        Object.keys(cache).forEach((cacheName) => {
            validationState.cache = {
                ...validationState.cache,
                [cacheName]: [...(validationState.cache?.[cacheName] || []), cache[cacheName]],
            };

            const cacheField = mutableState.fields[cacheName];
            const waiter = validationState.waiters?.[cacheName];

            if (cacheField && waiter && isEqual(waiter, omit(cache[cacheName], 'result'))) {
                validationState.waiters = omit(validationState.waiters, cacheName);
                cacheField.validating = false;
            }
        });
    }
};
