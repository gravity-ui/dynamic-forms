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

export interface EntitiesState {
    config?: SchemaRendererConfig;
    errorsRef?: React.RefObject<Record<string, SyncValidateError>>;
    headName?: string;
    mode?: SchemaRendererMode;
    schema?: SchemaMutatorsState['schema'];
}

export interface SchemaRendererState
    extends AsyncValidationState,
        ExternalErrorsState,
        SchemaMutatorsState {}
