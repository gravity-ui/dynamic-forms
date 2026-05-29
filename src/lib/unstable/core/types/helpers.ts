import type React from 'react';

import type {JsonSchemaType} from '../constants';

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
    : JsonSchemaType.Any;

export type ExtractControlProps<Control> = Control extends {
    Component: React.ComponentType<infer ControlProps>;
}
    ? ControlProps extends {controlProps: infer ControlComponentProps}
        ? ControlComponentProps
        : Record<string, any>
    : Record<string, any>;

export type ExtractViewProps<View> = View extends {Component: React.ComponentType<infer ViewProps>}
    ? ViewProps extends {viewProps: infer ViewComponentProps}
        ? ViewComponentProps
        : Record<string, any>
    : Record<string, any>;

export type ExtractWrapperProps<Wrapper> = Wrapper extends React.ComponentType<infer WrapperProps>
    ? WrapperProps extends {wrapperProps: infer WrapperComponentProps}
        ? WrapperComponentProps
        : Record<string, any>
    : Record<string, any>;
