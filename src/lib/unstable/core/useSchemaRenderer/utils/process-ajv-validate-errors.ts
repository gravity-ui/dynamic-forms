import type {ErrorObject} from 'ajv';

import type {ErrorMessages, JsonSchema, ObjectValue} from '../../types';
import type {
    AsyncValidationState,
    AsyncValidationWaiter,
    SetAsyncValidationCacheMutator,
} from '../mutators';
import type {EntityParametersError, ValidateErrorItem} from '../types';

import {processAjvError} from './process-ajv-error';
import {processEntityParametersError} from './process-entity-parameters-error';

interface ProcessAjvValidateErrorsParams<Schema extends JsonSchema> {
    ajvValidateErrors: (ErrorObject | EntityParametersError)[];
    allValues: ObjectValue;
    errorMessages: ErrorMessages;
    name: string;
    schema: Schema;
    setAsyncValidationCache?: SetAsyncValidationCacheMutator;
    validationState: AsyncValidationState | undefined;
}

interface ProcessAjvValidateErrorsReturn {
    ajvErrorItems: ValidateErrorItem[];
    entityParametersErrorItems: ValidateErrorItem[];
    waiters: Record<string, AsyncValidationWaiter>;
}

export const processAjvValidateErrors = <Schema extends JsonSchema>({
    ajvValidateErrors,
    allValues,
    errorMessages,
    name,
    schema,
    setAsyncValidationCache,
    validationState,
}: ProcessAjvValidateErrorsParams<Schema>): ProcessAjvValidateErrorsReturn => {
    const waiters: Record<string, AsyncValidationWaiter> = {};
    const ajvErrorItems: ValidateErrorItem[] = [];
    const entityParametersErrorItems: ValidateErrorItem[] = [];

    ajvValidateErrors.forEach((ajvOrEntityParametersError) => {
        if (ajvOrEntityParametersError.keyword === 'entityParameters') {
            const error = ajvOrEntityParametersError as EntityParametersError;

            processEntityParametersError({
                allValues,
                error,
                onAsyncError: (w) => {
                    waiters[w.instancePath] = w.params;

                    w.promise.then((result) => {
                        setAsyncValidationCache?.({
                            headName: name,
                            cache: {
                                [w.instancePath]: {
                                    ...w.params,
                                    result,
                                },
                            },
                        });
                    });
                },
                onError: (e) => entityParametersErrorItems.push(e),
                validationState,
            });
        } else {
            const error = ajvOrEntityParametersError as ErrorObject;

            processAjvError({
                error,
                errorMessages,
                schema,
                onError: (e) => ajvErrorItems.push(e),
            });
        }
    });

    return {ajvErrorItems, entityParametersErrorItems, waiters};
};
