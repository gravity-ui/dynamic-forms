import type {ErrorObject} from 'ajv';

import type {SchemaRendererMode} from '../constants';
import type {
    FieldValue,
    JsonSchema,
    SchemaRendererConfig,
    SyncValidateError,
    Validator,
} from '../types';

import type {AsyncValidationState, ExternalErrorsState, SchemaMutatorsState} from './mutators';

export type EntityParametersError = ErrorObject<
    'entityParameters',
    {
        schema: JsonSchema;
        validator: Validator<JsonSchema>;
        value: FieldValue;
    }
>;

export interface ValidateErrorItem {
    error: SyncValidateError;
    path: string[];
}

export interface EntityState {
    config?: SchemaRendererConfig;
    mode?: SchemaRendererMode;
    errorsRef?: React.RefObject<Record<string, SyncValidateError>>;
}

export interface SchemaRendererState
    extends AsyncValidationState,
        ExternalErrorsState,
        SchemaMutatorsState {}
