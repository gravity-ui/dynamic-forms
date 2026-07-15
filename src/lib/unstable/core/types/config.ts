import type {EntityType} from '../constants';

import type {Control, ControlWrapper, View, ViewWrapper} from './components';
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
    [key: string]:
        | {
              Component?: Control<Schema>;
              defaultProps?: Record<string, any>;
              independent?: boolean;
          }
        | undefined;
}

export interface ControlWrappersConfig<Schema extends JsonSchema> {
    [key: string]:
        | {
              Component?: ControlWrapper<Schema>;
              defaultProps?: Record<string, any>;
          }
        | undefined;
}

export interface ViewsConfig<Schema extends JsonSchema> {
    [key: string]:
        | {
              Component?: View<Schema>;
              defaultProps?: Record<string, any>;
              independent?: boolean;
          }
        | undefined;
}

export interface ViewWrappersConfig<Schema extends JsonSchema> {
    [key: string]:
        | {
              Component?: ViewWrapper<Schema>;
              defaultProps?: Record<string, any>;
          }
        | undefined;
}

export interface ValidatorsConfig<Schema extends JsonSchema> {
    [key: string]: Validator<Schema> | undefined;
}

export interface TypeConfig<Schema extends JsonSchema> {
    controls: ControlsConfig<Schema>;
    controlWrappers: ControlWrappersConfig<Schema>;
    views: ViewsConfig<Schema>;
    viewWrappers: ViewWrappersConfig<Schema>;
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
