import type React from 'react';

import type {
    JsonSchema,
    JsonSchemaArray,
    JsonSchemaBoolean,
    JsonSchemaNumber,
    JsonSchemaObject,
    JsonSchemaString,
} from './schema';
import type {ArrayValue, FieldValue, ObjectValue} from './values';

export type ObjectKeys<T extends Record<string, unknown>> = Exclude<keyof T, number | symbol>;

export type SchemaToValueType<Schema extends JsonSchema<any>> = Schema extends JsonSchemaArray<any>
    ? ArrayValue
    : Schema extends JsonSchemaBoolean<any>
    ? boolean
    : Schema extends JsonSchemaNumber<any>
    ? number
    : Schema extends JsonSchemaObject<any>
    ? ObjectValue
    : Schema extends JsonSchemaString<any>
    ? string
    : FieldValue;

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
