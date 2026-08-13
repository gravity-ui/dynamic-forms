import type {NodeType} from '../constants';

import type {NodeEntity, NodeLayout} from './components';
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

export interface NodeEntityConfig<Schema extends JsonSchema> {
    Component?: NodeEntity<Schema>;
    defaultProps?: Record<string, any>;
    independent?: boolean;
}

export interface NodeLayoutConfig<Schema extends JsonSchema> {
    Component?: NodeLayout<Schema>;
    defaultProps?: Record<string, any>;
}

export interface NodeEntitiesConfig<Schema extends JsonSchema> {
    [key: string]: NodeEntityConfig<Schema> | undefined;
}

export interface NodeLayoutsConfig<Schema extends JsonSchema> {
    [key: string]: NodeLayoutConfig<Schema> | undefined;
}

export interface NodeValidatorsConfig<Schema extends JsonSchema> {
    [key: string]: Validator<Schema> | undefined;
}

export interface NodeTypeConfig<Schema extends JsonSchema> {
    formEntities?: NodeEntitiesConfig<Schema>;
    formLayouts?: NodeLayoutsConfig<Schema>;
    overviewEntities?: NodeEntitiesConfig<Schema>;
    overviewLayouts?: NodeLayoutsConfig<Schema>;
    validators?: NodeValidatorsConfig<Schema>;
}

export interface NodesConfig {
    [NodeType.Any]?: NodeTypeConfig<JsonSchemaAny>;
    [NodeType.Array]?: NodeTypeConfig<JsonSchemaArray>;
    [NodeType.Boolean]?: NodeTypeConfig<JsonSchemaBoolean>;
    [NodeType.Number]?: NodeTypeConfig<JsonSchemaNumber>;
    [NodeType.Object]?: NodeTypeConfig<JsonSchemaObject>;
    [NodeType.String]?: NodeTypeConfig<JsonSchemaString>;
}
