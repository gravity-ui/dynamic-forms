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
    ControlWrapper?: ControlWrapper<Schema, WrapperComponentProps>;
    controlWrapperProps?: Partial<WrapperComponentProps>;
}

export type Control<
    Schema extends JsonSchema,
    ControlComponentProps extends Record<string, any> = {},
    WrapperComponentProps extends Record<string, any> = {},
> = React.ComponentType<ControlProps<Schema, ControlComponentProps, WrapperComponentProps>>;

export interface ControlWrapperProps<
    Schema extends JsonSchema,
    WrapperComponentProps extends Record<string, any> = {},
> extends FieldRenderProps<SchemaToValueType<Schema> | null | undefined> {
    schema: Schema;
    controlWrapperProps: {
        open?: boolean;
        hidden?: boolean;
        copy?: boolean;
        required?: boolean;
    } & Partial<WrapperComponentProps>;
    children: React.ReactNode;
}

export type ControlWrapper<
    Schema extends JsonSchema,
    WrapperComponentProps extends Record<string, any> = {},
> = React.ComponentType<ControlWrapperProps<Schema, WrapperComponentProps>>;

export interface ViewProps<
    Schema extends JsonSchema,
    ViewComponentProps extends Record<string, any> = {},
    WrapperComponentProps extends Record<string, any> = {},
> extends FieldRenderProps<SchemaToValueType<Schema> | null | undefined> {
    schema: Schema;
    viewProps: Partial<ViewComponentProps>;
    ViewWrapper?: ViewWrapper<Schema, WrapperComponentProps>;
    viewWrapperProps?: Partial<WrapperComponentProps>;
}

export type View<
    Schema extends JsonSchema,
    ViewComponentProps extends Record<string, any> = {},
    WrapperComponentProps extends Record<string, any> = {},
> = React.ComponentType<ViewProps<Schema, ViewComponentProps, WrapperComponentProps>>;

export interface ViewWrapperProps<
    Schema extends JsonSchema,
    WrapperComponentProps extends Record<string, any> = {},
> extends FieldRenderProps<SchemaToValueType<Schema> | null | undefined> {
    schema: Schema;
    viewWrapperProps: {
        open?: boolean;
        hidden?: boolean;
        copy?: boolean;
        required?: boolean;
    } & Partial<WrapperComponentProps>;
    children: React.ReactNode;
}

export type ViewWrapper<
    Schema extends JsonSchema,
    WrapperComponentProps extends Record<string, any> = {},
> = React.ComponentType<ViewWrapperProps<Schema, WrapperComponentProps>>;
