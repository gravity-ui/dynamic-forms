import type {EntityType} from '../constants';

import type {Control, View, Wrapper} from './components';
import type {
    JsonSchema,
    JsonSchemaAny,
    JsonSchemaArray,
    JsonSchemaBoolean,
    JsonSchemaNumber,
    JsonSchemaObject,
    JsonSchemaString,
} from './schema';
import type {Validator} from './validation';

export interface ControlsConfig<Schema extends JsonSchema> {
    [key: string]: {Component?: Control<Schema>; independent?: boolean} | undefined;
}

export interface ViewsConfig<Schema extends JsonSchema> {
    [key: string]: {Component?: View<Schema>; independent?: boolean} | undefined;
}

export interface WrappersConfig<Schema extends JsonSchema> {
    [key: string]: Wrapper<Schema> | undefined;
}

export interface ValidatorsConfig<Schema extends JsonSchema> {
    [key: string]: Validator<Schema> | undefined;
}

export interface TypeConfig<Schema extends JsonSchema> {
    controls: ControlsConfig<Schema>;
    views: ViewsConfig<Schema>;
    wrappers: WrappersConfig<Schema>;
    validators: ValidatorsConfig<Schema>;
}

export interface SchemaRendererConfig {
    [EntityType.Any]: TypeConfig<JsonSchemaAny>;
    [EntityType.Array]: TypeConfig<JsonSchemaArray>;
    [EntityType.Boolean]: TypeConfig<JsonSchemaBoolean>;
    [EntityType.Number]: TypeConfig<JsonSchemaNumber>;
    [EntityType.Object]: TypeConfig<JsonSchemaObject>;
    [EntityType.String]: TypeConfig<JsonSchemaString>;
}
