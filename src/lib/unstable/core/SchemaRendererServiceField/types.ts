import type {ErrorObject} from 'ajv';

import type {FieldValue, JsonSchema, SyncValidateError, Validator} from '../types';

export type EntityParametersError = ErrorObject<
    'entityParameters',
    {
        schema: JsonSchema;
        validator: Validator<JsonSchema>;
        value: FieldValue | null | undefined;
    }
>;

export interface ValidateErrorItem {
    error: SyncValidateError;
    path: string[];
}
