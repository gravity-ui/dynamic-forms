import type {JsonSchemaType, SchemaRendererMode} from '../constants';

import type {SchemaRendererConfig} from './config';
import type {
    JsonSchema,
    JsonSchemaArray,
    JsonSchemaBoolean,
    JsonSchemaNumber,
    JsonSchemaObject,
    JsonSchemaString,
} from './schema';
import type {ArrayValue, FieldValue, ObjectValue} from './values';

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

export type SchemaToSchemaType<Schema extends JsonSchema> = Schema extends JsonSchemaArray
    ? JsonSchemaType.Array
    : Schema extends JsonSchemaBoolean
    ? JsonSchemaType.Boolean
    : Schema extends JsonSchemaNumber
    ? JsonSchemaType.Number
    : Schema extends JsonSchemaObject
    ? JsonSchemaType.Object
    : Schema extends JsonSchemaString
    ? JsonSchemaType.String
    : JsonSchemaType;

export type SchemaTypeToSchema<SchemaType extends JsonSchemaType> =
    SchemaType extends JsonSchemaType.Array
        ? JsonSchemaArray
        : SchemaType extends JsonSchemaType.Boolean
        ? JsonSchemaBoolean
        : SchemaType extends JsonSchemaType.Number
        ? JsonSchemaNumber
        : SchemaType extends JsonSchemaType.Object
        ? JsonSchemaObject
        : SchemaType extends JsonSchemaType.String
        ? JsonSchemaString
        : JsonSchema;

type ExtractViewProps<ViewConfig> = ViewConfig extends {
    [SchemaRendererMode.Form]: infer FormComponentConfig;
    [SchemaRendererMode.Overview]: infer OverviewComponentConfig;
}
    ? (FormComponentConfig extends {
          Component: React.ComponentType<infer FormViewComponentProps>;
      }
          ? FormViewComponentProps extends {viewProps: infer ViewComponentProps}
              ? ViewComponentProps
              : {}
          : {}) &
          (OverviewComponentConfig extends {
              Component: React.ComponentType<infer OverivewViewComponentProps>;
          }
              ? OverivewViewComponentProps extends {viewProps: infer ViewComponentProps}
                  ? ViewComponentProps
                  : {}
              : {})
    : {};

export type ViewComponentPropsByConfig<Config extends SchemaRendererConfig[JsonSchemaType]> = {
    [Key in keyof Config['views']]: ExtractViewProps<Config['views'][Key]>;
};

type ExtractWrapperProps<Wrapper> = Wrapper extends React.ComponentType<infer WrapperProps>
    ? WrapperProps extends {wrapperProps: infer WrapperComponentProps}
        ? WrapperComponentProps
        : {}
    : {};

export type WrapperComponentPropsByConfig<Config extends SchemaRendererConfig[JsonSchemaType]> = {
    [Key in keyof Config['wrappers']]: ExtractWrapperProps<Config['wrappers'][Key]>;
};
