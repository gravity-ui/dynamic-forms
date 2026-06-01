import type {ErrorObject} from 'ajv';

import type {SchemaRendererMode} from '../constants';
import type {
    FieldValue,
    JsonSchema,
    SchemaRendererConfig,
    SyncValidateError,
    Validator,
} from '../types';

import type {
    ArrayObjectErrorsState,
    AsyncValidationState,
    ExternalErrorsState,
    SchemaMutatorsState,
} from './mutators';

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

export interface EntityState extends ArrayObjectErrorsState {
    config?: SchemaRendererConfig;
    mode?: SchemaRendererMode;
}

export interface SchemaRendererState
    extends ArrayObjectErrorsState,
        AsyncValidationState,
        ExternalErrorsState,
        SchemaMutatorsState {}
