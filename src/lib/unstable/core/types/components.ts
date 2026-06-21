import type React from 'react';

import type {FieldRenderProps} from 'react-final-form';

import type {SchemaToValueType} from './helpers';
import type {JsonSchema} from './schema';

export interface ControlProps<
    Schema extends JsonSchema,
    ControlComponentProps extends Record<string, any> = {},
    WrapperComponentProps extends Record<string, any> = {},
> extends FieldRenderProps<SchemaToValueType<Schema> | null | undefined> {
    schema: Schema;
    controlProps: Partial<ControlComponentProps>;
    Wrapper?: Wrapper<Schema, WrapperComponentProps>;
    wrapperProps?: Partial<WrapperComponentProps>;
}

export type Control<
    Schema extends JsonSchema,
    ControlComponentProps extends Record<string, any> = {},
    WrapperComponentProps extends Record<string, any> = {},
> = React.ComponentType<ControlProps<Schema, ControlComponentProps, WrapperComponentProps>>;

export interface ViewProps<
    Schema extends JsonSchema,
    ViewComponentProps extends Record<string, any> = {},
    WrapperComponentProps extends Record<string, any> = {},
> extends FieldRenderProps<SchemaToValueType<Schema> | null | undefined> {
    schema: Schema;
    viewProps: Partial<ViewComponentProps>;
    Wrapper?: Wrapper<Schema, WrapperComponentProps>;
    wrapperProps?: Partial<WrapperComponentProps>;
}

export type View<
    Schema extends JsonSchema,
    ViewComponentProps extends Record<string, any> = {},
    WrapperComponentProps extends Record<string, any> = {},
> = React.ComponentType<ViewProps<Schema, ViewComponentProps, WrapperComponentProps>>;

export interface WrapperProps<
    Schema extends JsonSchema,
    WrapperComponentProps extends Record<string, any> = {},
> extends FieldRenderProps<SchemaToValueType<Schema> | null | undefined> {
    schema: Schema;
    wrapperProps: {
        open?: boolean;
        hidden?: boolean;
        copy?: boolean;
        required?: boolean;
    } & Partial<WrapperComponentProps>;
    children: React.ReactNode;
}

export type Wrapper<
    Schema extends JsonSchema,
    WrapperComponentProps extends Record<string, any> = {},
> = React.ComponentType<WrapperProps<Schema, WrapperComponentProps>>;
