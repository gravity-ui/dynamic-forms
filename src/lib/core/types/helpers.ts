import type {NodeType} from '../constants';

import type {NodeEntity, NodeLayout} from './components';
import type {NodeTypeConfig, NodesConfig} from './config';
import type {
    JsonSchema,
    JsonSchemaAny,
    JsonSchemaArray,
    JsonSchemaBoolean,
    JsonSchemaNumber,
    JsonSchemaObject,
    JsonSchemaString,
} from './schema';
import type {ArrayValue, FieldValue, ObjectValue} from './values';

export type EntityKind = 'formEntities' | 'overviewEntities';
export type LayoutKind = 'formLayouts' | 'overviewLayouts';

export type SchemaOfNodeType<Type extends NodeType> = Type extends NodeType.Any
    ? JsonSchemaAny
    : Type extends NodeType.Array
    ? JsonSchemaArray
    : Type extends NodeType.Boolean
    ? JsonSchemaBoolean
    : Type extends NodeType.Number
    ? JsonSchemaNumber
    : Type extends NodeType.Object
    ? JsonSchemaObject
    : Type extends NodeType.String
    ? JsonSchemaString
    : JsonSchema;

export type SchemaToValueType<Schema extends JsonSchema> = Schema extends JsonSchemaArray
    ? ArrayValue
    : Schema extends JsonSchemaBoolean
    ? boolean
    : Schema extends JsonSchemaNumber
    ? number
    : Schema extends JsonSchemaObject
    ? ObjectValue
    : Schema extends JsonSchemaString
    ? string
    : FieldValue;

export type ExtractNodeEntityProps<Component> = Component extends React.ComponentType<
    infer NodeEntityProps
>
    ? NodeEntityProps extends {props?: infer EntityProps}
        ? NonNullable<EntityProps>
        : Record<string, any>
    : Record<string, any>;

export type ExtractNodeLayoutProps<Component> = Component extends React.ComponentType<
    infer NodeLayoutProps
>
    ? NodeLayoutProps extends {props?: infer LayoutProps}
        ? NonNullable<LayoutProps>
        : Record<string, any>
    : Record<string, any>;

type ComponentOf<Entry> = Entry extends {Component?: infer C} ? NonNullable<C> : never;

type OrRecord<T> = [T] extends [never] ? Record<string, any> : T;

type NodeComponentPropsFromConfig<
    NodeConfig extends NodeTypeConfig<any>,
    Kind extends EntityKind | LayoutKind,
    Key extends string,
> = Key extends keyof NonNullable<NodeConfig[Kind]>
    ? Kind extends EntityKind
        ? ExtractNodeEntityProps<ComponentOf<NonNullable<NodeConfig[Kind]>[Key]>>
        : ExtractNodeLayoutProps<ComponentOf<NonNullable<NodeConfig[Kind]>[Key]>>
    : never;

export type NodeComponentProps<
    Config extends NodesConfig,
    Type extends NodeType,
    Kind extends EntityKind | LayoutKind,
    Ref,
> = [Kind] extends [EntityKind]
    ? Ref extends NodeEntity<any>
        ? ExtractNodeEntityProps<Ref>
        : Ref extends string
        ? OrRecord<
              Kind extends infer K extends EntityKind
                  ? NodeComponentPropsFromConfig<NonNullable<Config[Type]>, K, Ref>
                  : never
          >
        : Record<string, any>
    : Ref extends NodeLayout<any>
    ? ExtractNodeLayoutProps<Ref>
    : Ref extends string
    ? OrRecord<
          Kind extends infer K extends LayoutKind
              ? NodeComponentPropsFromConfig<NonNullable<Config[Type]>, K, Ref>
              : never
      >
    : Record<string, any>;

export type NodeTypeConfigKey<
    Config extends NodesConfig,
    Type extends NodeType,
    Kind extends keyof NodeTypeConfig<any>,
> = `${Extract<keyof NonNullable<NonNullable<Config[Type]>[Kind]>, string>}`;
