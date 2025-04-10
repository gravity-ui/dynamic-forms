import type {JsonSchemaType, SchemaRendererMode} from '../constants';

import type {IndependentView, SimpleView, Wrapper} from './components';
import type {
    JsonSchema,
    JsonSchemaArray,
    JsonSchemaBoolean,
    JsonSchemaNumber,
    JsonSchemaObject,
    JsonSchemaString,
} from './schema';
import type {Validator} from './validation';

export interface SimpleViewComponentConfig<Schema extends JsonSchema> {
    Component: SimpleView<Schema> | null;
    independent?: false;
}

export interface IndependentViewComponentConfig<Schema extends JsonSchema> {
    Component: IndependentView<Schema>;
    independent: true;
}

export type ViewComponentConfig<Schema extends JsonSchema> =
    | SimpleViewComponentConfig<Schema>
    | IndependentViewComponentConfig<Schema>;

export interface ViewConfig<Schema extends JsonSchema> {
    [SchemaRendererMode.Form]: ViewComponentConfig<Schema>;
    [SchemaRendererMode.Overview]: ViewComponentConfig<Schema>;
}

export interface ViewsConfig<Schema extends JsonSchema> {
    [key: string]: ViewConfig<Schema> | undefined;
}

export interface WrappersConfig<Schema extends JsonSchema> {
    [key: string]: Wrapper<Schema> | undefined;
}

export interface ValidatorsConfig<Schema extends JsonSchema> {
    [key: string]: Validator<Schema> | undefined;
}

export interface TypeConfig<Schema extends JsonSchema> {
    views: ViewsConfig<Schema>;
    wrappers: WrappersConfig<Schema>;
    validators: ValidatorsConfig<Schema>;
}

export interface SchemaRendererConfig {
    [JsonSchemaType.Array]: TypeConfig<JsonSchemaArray>;
    [JsonSchemaType.Boolean]: TypeConfig<JsonSchemaBoolean>;
    [JsonSchemaType.Number]: TypeConfig<JsonSchemaNumber>;
    [JsonSchemaType.Object]: TypeConfig<JsonSchemaObject>;
    [JsonSchemaType.String]: TypeConfig<JsonSchemaString>;
}
