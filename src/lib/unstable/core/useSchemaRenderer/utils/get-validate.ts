import type {ErrorObject} from 'ajv';
import type {FieldValidator, FormApi} from 'final-form';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import isObjectLike from 'lodash/isObjectLike';
import omit from 'lodash/omit';

import {SchemaRendererEventType} from '../../constants';
import type {FieldValue, JsonSchema, NodesConfig, ValidationError} from '../../types';
import {
    arrPathToFinalFormName,
    finalFormNameToArrPath,
    getServiceFieldName,
    getValuePaths,
    instancePathToArrPath,
} from '../../utils';
import {SCHEMA_RENDERER_SERVICE_FIELD} from '../constants';
import type {NodeParametersErrorObject, SchemaRendererState, ValidationWaiter} from '../types';

import {type GetAjvValidateReturn, getAjvValidate} from './get-ajv-validate';
import {processAjvError} from './process-ajv-error';

export const getValidate = (form: FormApi, headName: string): FieldValidator<FieldValue> => {
    let ajvValidate: GetAjvValidateReturn;
    let config: NodesConfig | undefined;
    let schema: JsonSchema;

    return (): ValidationError | Promise<ValidationError> => {
        const allValues = form.getState().values;
        const value = headName ? get(allValues, headName) : allValues;
        const srName = getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, headName);
        const srField = form.getFieldState(srName);
        const srState: SchemaRendererState | undefined = srField?.data?.state;

        if (!srState?.schema) {
            return false;
        }

        if (schema !== srState.schema || config !== srState.config) {
            config = srState.config;
            schema = srState.schema;
            ajvValidate = getAjvValidate({config, schema});
        }

        ajvValidate(value);

        const waiters: Record<string, ValidationWaiter> = {};
        const ajvErrors: Record<string, ValidationError> = {};
        const npErrors: Record<string, ValidationError> = {};

        ajvValidate.errors?.forEach((e) => {
            const nameFromRoot = arrPathToFinalFormName([
                ...finalFormNameToArrPath(headName),
                ...instancePathToArrPath(e.instancePath),
            ]);

            if (e.keyword === 'nodeParameters') {
                const error = e as NodeParametersErrorObject;
                const cache = srState.cache[nameFromRoot];
                const cacheItem = cache?.find((c) => isEqual(error.params, omit(c, 'result')));
                const waiter = srState.waiters[nameFromRoot];

                if (cacheItem) {
                    npErrors[nameFromRoot] = cacheItem.result;

                    return;
                }

                if (!waiter || !isEqual(error.params, omit(waiter, 'promise'))) {
                    const errorOrPromise = error.params.validator(error.params.value, allValues);

                    if (errorOrPromise instanceof Promise) {
                        waiters[nameFromRoot] = {
                            ...error.params,
                            promise: errorOrPromise,
                        };

                        errorOrPromise.then((result) => {
                            srState.cache[nameFromRoot] = [
                                ...(srState.cache[nameFromRoot] || []),
                                {...error.params, result},
                            ];

                            srState.runValidate();
                        });
                    } else {
                        npErrors[nameFromRoot] = errorOrPromise;
                    }

                    return;
                }
            } else {
                const error = e as ErrorObject;

                processAjvError({
                    error,
                    errorMessages: srState?.errorMessages,
                    form,
                    nameFromRoot,
                    schema,
                    onError: (err: ValidationError) => {
                        ajvErrors[nameFromRoot] = err;
                    },
                });
            }
        });

        const allErrors: Record<string, ValidationError> = {};

        Object.entries({
            ...srState?.regularErrors,
            ...ajvErrors,
            ...npErrors,
            ...srState?.priorityErrors,
        }).forEach(([n, e]) => {
            if (isObjectLike(e)) {
                getValuePaths(e).forEach((childArrPath) => {
                    const childName = arrPathToFinalFormName([
                        ...finalFormNameToArrPath(n),
                        ...childArrPath,
                    ]);

                    allErrors[childName] = get(e, childArrPath);
                });
            } else {
                allErrors[n] = e;
            }
        });

        const newErrors: Record<string, ValidationError> = {};

        Object.keys({...srState.errors, ...allErrors}).forEach((key) => {
            if (srState.errors[key] !== allErrors[key]) {
                newErrors[key] = allErrors[key];
            }
        });

        srState.errors = allErrors;
        srState.waiters = {...srState.waiters, ...waiters};

        if (Object.values(newErrors).length) {
            srState.dispatchEvent([
                {type: SchemaRendererEventType.Error, names: Object.keys(newErrors)},
            ]);
        }

        if (Object.values(waiters).length) {
            return Promise.race(Object.values(waiters).map((w) => w.promise)).then(() =>
                Object.values(allErrors).some(Boolean) ? 'error' : false,
            );
        }

        return Object.values(allErrors).some(Boolean) ? 'error' : false;
    };
};
