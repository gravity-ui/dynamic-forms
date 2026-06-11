import {type FieldValidator} from 'final-form';
import get from 'lodash/get';
import isBoolean from 'lodash/isBoolean';
import isObjectLike from 'lodash/isObjectLike';
import isString from 'lodash/isString';

import type {
    ErrorMessages,
    FieldValue,
    JsonSchema,
    ObjectValue,
    SchemaRendererConfig,
    SyncValidateError,
} from '../../types';
import type {SetAsyncValidationCacheMutator, SetAsyncValidationWaitersMutator} from '../mutators';
import type {SchemaRendererState} from '../types';

import {formatFinalFormPath, getValuePaths} from './common';
import {type GetAjvValidateReturn, getAjvValidate} from './get-ajv-validate';
import {processAjvValidateErrors} from './process-ajv-validate-errors';
import {processErrorsState} from './process-errors-state';

export type GetValidateParams = {
    config: SchemaRendererConfig;
    errorMessages: ErrorMessages;
    name: string;
    setAsyncValidationCache?: SetAsyncValidationCacheMutator;
    setAsyncValidationWaiters?: SetAsyncValidationWaitersMutator;
    setErrors: (errors: Record<string, SyncValidateError>) => void;
};

type GetValidateReturn = FieldValidator<FieldValue>;

export const getValidate = ({
    config,
    errorMessages,
    name,
    setAsyncValidationCache,
    setAsyncValidationWaiters,
    setErrors,
}: GetValidateParams): GetValidateReturn => {
    let schema: JsonSchema;
    let ajvValidate: GetAjvValidateReturn;

    return (value, allValues, meta): SyncValidateError => {
        const data = meta?.data as SchemaRendererState | undefined;

        if (!data?.schema) {
            return false;
        }

        if (schema !== data.schema) {
            schema = data.schema;
            ajvValidate = getAjvValidate({config, schema});
        }

        ajvValidate(value);

        const {ajvErrorItems, entityParametersErrorItems, waiters} = processAjvValidateErrors({
            ajvValidateErrors: ajvValidate.errors || [],
            allValues: allValues as ObjectValue,
            errorMessages,
            name,
            schema,
            setAsyncValidationCache,
            validationState: data,
        });
        const {externalPriorityErrorItems, externalRegularErrorItems} = processErrorsState({
            errorsState: data,
            name,
        });

        if (Object.keys(waiters).length) {
            setAsyncValidationWaiters?.({headName: name, waiters});
        }

        const result: {errors: Record<string, SyncValidateError>} = {errors: {}};

        [
            ...externalRegularErrorItems,
            ...ajvErrorItems,
            ...entityParametersErrorItems,
            ...externalPriorityErrorItems,
        ].forEach((item) => {
            if (!item.error) {
                return;
            }

            if (isObjectLike(item.error)) {
                getValuePaths(item.error).forEach((childPath) => {
                    result.errors[formatFinalFormPath([name, ...item.path, ...childPath])] = get(
                        item.error,
                        childPath,
                    );
                });

                return;
            }

            if (isBoolean(item.error) || isString(item.error)) {
                result.errors[formatFinalFormPath([name, ...item.path])] = item.error;

                return;
            }
        });

        setErrors(result.errors);

        return Object.keys(result.errors).length ? 'error' : false;
    };
};
