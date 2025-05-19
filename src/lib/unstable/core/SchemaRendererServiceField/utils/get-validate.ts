import type {FieldValidator} from 'final-form';
import get from 'lodash/get';

import type {
    ErrorsState,
    SetValidationCacheMutator,
    SetValidationWaitersMutator,
    ValidationState,
} from '../../mutators';
import type {
    ErrorMessages,
    JsonSchema,
    ObjectValue,
    SchemaRendererConfig,
    SchemaToValueType,
} from '../../types';

import {getAjvValidate} from './get-ajv-validate';
import {processAjvValidateErrors} from './process-ajv-validate-errors';
import {processErrorItems} from './process-error-items';
import {processErrorsState} from './process-errors-state';

type GetValidateParams<Schema extends JsonSchema> = {
    config: SchemaRendererConfig;
    errorMessages?: ErrorMessages;
    headName: string;
    mainSchema: Schema;
    serviceFieldName: string;
    setValidationCache: SetValidationCacheMutator;
    setValidationWaiters: SetValidationWaitersMutator;
};

type GetValidateReturn<Schema extends JsonSchema> = FieldValidator<SchemaToValueType<Schema>>;

export const getValidate = <Schema extends JsonSchema>({
    config,
    errorMessages,
    headName,
    mainSchema,
    serviceFieldName,
    setValidationCache,
    setValidationWaiters,
}: GetValidateParams<Schema>): GetValidateReturn<Schema> => {
    const ajvValidate = getAjvValidate({config, mainSchema});

    return (_value, allValues, meta) => {
        ajvValidate(get(allValues, headName));

        const {ajvErrorItems, entityParametersErrorItems, waiters} = processAjvValidateErrors({
            ajvValidateErrors: ajvValidate.errors || [],
            allValues: allValues as ObjectValue,
            errorMessages,
            headName,
            mainSchema,
            serviceFieldName,
            setValidationCache,
            validationState: meta?.data as ValidationState | undefined,
        });
        const {externalPriorityErrorItems, externalRegularErrorItems} = processErrorsState({
            errorsState: meta?.data as ErrorsState | undefined,
        });

        if (Object.keys(waiters).length) {
            setValidationWaiters({serviceFieldName, waiters});
        }

        const result = processErrorItems({
            errorItems: [
                ...externalRegularErrorItems,
                ...ajvErrorItems,
                ...entityParametersErrorItems,
                ...externalPriorityErrorItems,
            ],
            headName,
            mainSchema,
        });

        return result;
    };
};
