import type {ErrorObject, ValidateFunction} from 'ajv';
import type {FieldValidator} from 'final-form';

import type {ARRAY_AND_OBJECT_ERRORS} from '../constants';
import type {
    ErrorsState,
    SetValidationCacheMutator,
    SetValidationWaitersMutator,
    ValidationState,
    ValidationWaiter,
} from '../mutators';
import type {
    AsyncValidateError,
    ErrorMessages,
    FieldValue,
    JsonSchema,
    ObjectValue,
    SchemaRendererConfig,
    SchemaToValueType,
    SyncValidateError,
    Validator,
} from '../types';

export type EntityParametersError = ErrorObject<
    'entityParameters',
    {
        schema: JsonSchema;
        validator: Validator<JsonSchema>;
        value: FieldValue | null | undefined;
    }
>;

export type GetAjvValidateParams = {
    config: SchemaRendererConfig;
    mainSchema: JsonSchema;
};

export interface GetAjvValidateReturn extends ValidateFunction {
    errors?: (ErrorObject | EntityParametersError)[];
}

export interface GetAjvErrorMessageParams {
    ajvErrorMessage?: string;
    errorMessages: ErrorMessages | undefined;
    instancePath: string;
    keyword: string;
    mainSchema: JsonSchema;
    schemaPath: string;
}

export interface ValidateErrorItem {
    error: SyncValidateError;
    path: string[];
}

export interface ProcessEntityParametersErrorParams {
    allValues: ObjectValue;
    error: EntityParametersError;
    headName: string;
    onAsyncError: (waiter: {
        instancePath: string;
        params: EntityParametersError['params'];
        promise: AsyncValidateError;
    }) => void;
    onError: (error: ValidateErrorItem) => void;
    validationState: ValidationState | undefined;
}

export interface ProcessAjvErrorParams<Schema extends JsonSchema> {
    error: ErrorObject;
    errorMessages: ErrorMessages | undefined;
    headName: string;
    mainSchema: Schema;
    onError: (error: ValidateErrorItem) => void;
}

export interface ProcessAjvValidateErrorsParams<Schema extends JsonSchema> {
    ajvValidateErrors: (ErrorObject | EntityParametersError)[];
    allValues: ObjectValue;
    errorMessages: ErrorMessages | undefined;
    headName: string;
    mainSchema: Schema;
    serviceFieldName: string;
    setValidationCache: SetValidationCacheMutator;
    validationState: ValidationState | undefined;
}

export interface ProcessAjvValidateErrorsReturn {
    ajvErrorItems: ValidateErrorItem[];
    entityParametersErrorItems: ValidateErrorItem[];
    waiters: Record<string, ValidationWaiter>;
}

export interface ProcessErrorsStateParams {
    errorsState: ErrorsState | undefined;
}

export interface ProcessErrorsStateReturn {
    externalPriorityErrorItems: ValidateErrorItem[];
    externalRegularErrorItems: ValidateErrorItem[];
}

export interface ProcessErrorItemsParams<Schema extends JsonSchema> {
    errorItems: ValidateErrorItem[];
    headName: string;
    mainSchema: Schema;
}

export type ProcessErrorItemsReturn = {
    [ARRAY_AND_OBJECT_ERRORS]: {[key: string]: boolean | string | undefined};
} & {[key: string]: SyncValidateError};

export type GetValidateParams<Schema extends JsonSchema> = {
    config: SchemaRendererConfig;
    errorMessages?: ErrorMessages;
    headName: string;
    mainSchema: Schema;
    serviceFieldName: string;
    setValidationCache: SetValidationCacheMutator;
    setValidationWaiters: SetValidationWaitersMutator;
};

export type GetValidateReturn<Schema extends JsonSchema> = FieldValidator<
    SchemaToValueType<Schema>
>;
