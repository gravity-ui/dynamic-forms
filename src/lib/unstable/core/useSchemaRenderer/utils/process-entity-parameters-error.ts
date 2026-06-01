import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';

import type {AsyncValidateError, ObjectValue} from '../../types';
import type {AsyncValidationState} from '../mutators';
import type {EntityParametersError, ValidateErrorItem} from '../types';

import {parseInstancePath} from './common';

interface ProcessEntityParametersErrorParams {
    allValues: ObjectValue;
    error: EntityParametersError;
    onAsyncError: (waiter: {
        instancePath: string;
        params: EntityParametersError['params'];
        promise: AsyncValidateError;
    }) => void;
    onError: (error: ValidateErrorItem) => void;
    validationState: AsyncValidationState | undefined;
}

export const processEntityParametersError = ({
    allValues,
    error,
    onAsyncError,
    onError,
    validationState,
}: ProcessEntityParametersErrorParams) => {
    const waiter = validationState?.waiters?.[error.instancePath];
    const cache = validationState?.cache?.[error.instancePath];
    const cacheItem = cache?.find((item) => isEqual(error.params, omit(item, 'result')));

    if (cacheItem?.result) {
        onError({
            error: cacheItem.result,
            path: parseInstancePath(error.instancePath),
        });
    } else if (!waiter || !isEqual(error.params, waiter)) {
        const errorOrPromise = error.params.validator(error.params.value, allValues as ObjectValue);

        if (errorOrPromise instanceof Promise) {
            onAsyncError({
                instancePath: error.instancePath,
                params: error.params,
                promise: errorOrPromise,
            });
        } else {
            onError({
                error: errorOrPromise,
                path: parseInstancePath(error.instancePath),
            });
        }
    }
};
