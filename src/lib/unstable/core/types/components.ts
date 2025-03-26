import type {FieldRenderProps} from 'react-final-form';

import type {SchemaToValueType} from './helpers';
import type {JsonSchema} from './schema';

export interface SimpleViewProps<
    Schema extends JsonSchema,
    ViewComponentProps extends Record<string, any> = {},
> extends FieldRenderProps<SchemaToValueType<Schema> | null | undefined> {
    schema: Schema;
    viewProps: Partial<ViewComponentProps>;
}

export type SimpleView<
    Schema extends JsonSchema,
    ViewComponentProps extends Record<string, any> = {},
> = React.ComponentType<SimpleViewProps<Schema, ViewComponentProps>>;

export interface WrapperProps<
    Schema extends JsonSchema,
    WrapperComponentProps extends Record<string, any> = {},
> extends FieldRenderProps<SchemaToValueType<Schema> | null | undefined> {
    schema: Schema;
    wrapperProps: Partial<WrapperComponentProps>;
}

export type Wrapper<
    Schema extends JsonSchema,
    WrapperComponentProps extends Record<string, any> = {},
> = React.ComponentType<WrapperProps<Schema, WrapperComponentProps>>;

export interface IndependentViewProps<
    Schema extends JsonSchema,
    ComponentProps extends Record<string, any> = {},
    WrapperComponentProps extends Record<string, any> = {},
> extends SimpleViewProps<Schema, ComponentProps> {
    Wrapper?: Wrapper<Schema, WrapperComponentProps>;
    wrapperProps: Partial<WrapperComponentProps>;
}

export type IndependentView<
    Schema extends JsonSchema,
    ComponentProps extends Record<string, any> = {},
    WrapperComponentProps extends Record<string, any> = {},
> = React.ComponentType<IndependentViewProps<Schema, ComponentProps, WrapperComponentProps>>;

export type View<Schema extends JsonSchema> = SimpleView<Schema> | IndependentView<Schema>;
