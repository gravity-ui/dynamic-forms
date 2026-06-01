import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';

import type {SetAsyncValidationCacheFunction, SetAsyncValidationWaitersFunction} from './types';

export const setAsyncValidationWaiters: SetAsyncValidationWaitersFunction = (
    [{headName, waiters}],
    mutableState,
) => {
    const field = mutableState.fields[headName];

    if (field && waiters) {
        Object.keys(waiters).forEach((waiterName) => {
            field.data = {
                ...field.data,
                waiters: {
                    ...field.data.waiters,
                    [waiterName]: waiters[waiterName],
                },
            };

            const waiterField = mutableState.fields[waiterName];

            if (waiterField) {
                waiterField.validating = true;
            }
        });
    }
};

export const setAsyncValidationCache: SetAsyncValidationCacheFunction = (
    [{headName, cache}],
    mutableState,
) => {
    const field = mutableState.fields[headName];

    if (field && cache) {
        Object.keys(cache).forEach((cacheName) => {
            field.data = {
                ...field.data,
                cache: {
                    ...field.data.cache,
                    [cacheName]: [...(field.data.cache?.[cacheName] || []), cache[cacheName]],
                },
            };

            const cacheField = mutableState.fields[cacheName];
            const waiter = field.data.waiters?.[cacheName];

            if (cacheField && waiter && isEqual(waiter, omit(cache[cacheName], 'result'))) {
                field.data.waiters = omit(field.data.waiters, cacheName);
                cacheField.validating = false;
            }
        });
    }
};
