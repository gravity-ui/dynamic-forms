import {type FieldValidator} from 'final-form';
import get from 'lodash/get';
import isBoolean from 'lodash/isBoolean';
import isEqual from 'lodash/isEqual';
import isObjectLike from 'lodash/isObjectLike';
import isString from 'lodash/isString';
import set from 'lodash/set';

import {JsonSchemaType} from '../../constants';
import type {
    ErrorMessages,
    FieldValue,
    JsonSchema,
    ObjectValue,
    SchemaRendererConfig,
    SyncValidateError,
} from '../../types';
import type {
    SetArrayObjectErrorsMutator,
    SetAsyncValidationCacheMutator,
    SetAsyncValidationWaitersMutator,
} from '../mutators';
import type {SchemaRendererState} from '../types';

import {
    formatFinalFormPath,
    getSchemaByFinalFormPath,
    getValuePaths,
    parseFinalFormName,
} from './common';
import {type GetAjvValidateReturn, getAjvValidate} from './get-ajv-validate';
import {processAjvValidateErrors} from './process-ajv-validate-errors';
import {processErrorsState} from './process-errors-state';

type GetValidateParams = {
    config: SchemaRendererConfig;
    errorMessages: ErrorMessages;
    name: string;
    setArrayObjectErrors?: SetArrayObjectErrorsMutator;
    setAsyncValidationCache?: SetAsyncValidationCacheMutator;
    setAsyncValidationWaiters?: SetAsyncValidationWaitersMutator;
};

type GetValidateReturn = FieldValidator<FieldValue>;

export const getValidate = ({
    config,
    errorMessages,
    name,
    setArrayObjectErrors,
    setAsyncValidationCache,
    setAsyncValidationWaiters,
}: GetValidateParams): GetValidateReturn => {
    let schema: JsonSchema;
    let ajvValidate: GetAjvValidateReturn;

    return (value, allValues, meta) => {
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

        const result: {
            error: SyncValidateError;
            arrayAndObjectErrors: Record<string, SyncValidateError>;
        } = {error: false, arrayAndObjectErrors: {}};

        [
            ...externalRegularErrorItems,
            ...ajvErrorItems,
            ...entityParametersErrorItems,
            ...externalPriorityErrorItems,
        ].forEach((item) => {
            if (!item.error) {
                return;
            }

            const setError = (path: string[], error: SyncValidateError) => {
                const itemSchema = getSchemaByFinalFormPath(path, '', schema);

                if (
                    itemSchema?.type === JsonSchemaType.Array ||
                    itemSchema?.type === JsonSchemaType.Object
                ) {
                    result.arrayAndObjectErrors[
                        formatFinalFormPath([...parseFinalFormName(name), ...path])
                    ] = error;
                } else {
                    set(result, ['error', ...path], error);
                }
            };

            if (isObjectLike(item.error)) {
                getValuePaths(item.error).forEach((childPath) => {
                    setError([...item.path, ...childPath], get(item.error, childPath));
                });

                return;
            }

            if (isBoolean(item.error) || isString(item.error)) {
                setError(item.path, item.error);

                return;
            }
        });

        if (!isEqual(result.arrayAndObjectErrors, data.arrayAndObjectErrors)) {
            setArrayObjectErrors?.({
                headName: name,
                arrayAndObjectErrors: result.arrayAndObjectErrors,
            });
        }

        return result.error;
    };
};
