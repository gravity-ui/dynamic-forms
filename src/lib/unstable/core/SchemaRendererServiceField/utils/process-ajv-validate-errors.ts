import type {ErrorObject} from 'ajv';

import type {SetValidationCacheMutator, ValidationState, ValidationWaiter} from '../../mutators';
import type {ErrorMessages, JsonSchema, ObjectValue} from '../../types';
import type {EntityParametersError, ValidateErrorItem} from '../types';

import {processAjvError} from './process-ajv-error';
import {processEntityParametersError} from './process-entity-parameters-error';

interface ProcessAjvValidateErrorsParams<Schema extends JsonSchema> {
    ajvValidateErrors: (ErrorObject | EntityParametersError)[];
    allValues: ObjectValue;
    errorMessages: ErrorMessages | undefined;
    headName: string;
    mainSchema: Schema;
    serviceFieldName: string;
    setValidationCache: SetValidationCacheMutator;
    validationState: ValidationState | undefined;
}

interface ProcessAjvValidateErrorsReturn {
    ajvErrorItems: ValidateErrorItem[];
    entityParametersErrorItems: ValidateErrorItem[];
    waiters: Record<string, ValidationWaiter>;
}

export const processAjvValidateErrors = <Schema extends JsonSchema>({
    ajvValidateErrors,
    allValues,
    errorMessages,
    headName,
    mainSchema,
    serviceFieldName,
    setValidationCache,
    validationState,
}: ProcessAjvValidateErrorsParams<Schema>): ProcessAjvValidateErrorsReturn => {
    const waiters: Record<string, ValidationWaiter> = {};
    const ajvErrorItems: ValidateErrorItem[] = [];
    const entityParametersErrorItems: ValidateErrorItem[] = [];

    ajvValidateErrors.forEach((ajvOrEntityParametersError) => {
        if (ajvOrEntityParametersError.keyword === 'entityParameters') {
            processEntityParametersError({
                allValues: allValues,
                error: ajvOrEntityParametersError as EntityParametersError,
                headName,
                onAsyncError: (w) => {
                    waiters[w.instancePath] = w.params;

                    w.promise.then((result) => {
                        setValidationCache({
                            cache: {
                                [w.instancePath]: {
                                    ...w.params,
                                    result,
                                },
                            },
                            serviceFieldName,
                        });
                    });
                },
                onError: (err) => entityParametersErrorItems.push(err),
                validationState,
            });
        } else {
            processAjvError({
                error: ajvOrEntityParametersError as ErrorObject,
                errorMessages,
                headName,
                mainSchema,
                onError: (err) => ajvErrorItems.push(err),
            });
        }
    });

    return {ajvErrorItems, entityParametersErrorItems, waiters};
};
