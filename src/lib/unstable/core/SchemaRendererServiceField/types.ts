import type {ErrorObject, ValidateFunction} from 'ajv';
import type {FieldValidator} from 'final-form';

import type {SetValidationCacheMutator, SetValidationWaitersMutator} from '../mutators';
import type {
    ErrorMessages,
    FieldValue,
    JsonSchema,
    SchemaRendererConfig,
    SchemaToValueType,
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
    errorMessages?: ErrorMessages;
    instancePath: string;
    keyword: string;
    mainSchema: JsonSchema;
    schemaPath: string;
}

export type GetValidateParams<Schema extends JsonSchema> = {
    config: SchemaRendererConfig;
    errorMessages?: ErrorMessages;
    name: string;
    mainSchema: Schema;
    serviceFieldName: string;
    setValidationCache: SetValidationCacheMutator;
    setValidationWaiters: SetValidationWaitersMutator;
};

export type GetValidateReturn<Schema extends JsonSchema> = FieldValidator<
    SchemaToValueType<Schema>
>;
