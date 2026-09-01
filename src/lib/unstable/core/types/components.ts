import type React from 'react';

import type {FieldRenderProps} from 'react-final-form';

import type {SchemaRendererMode} from '../constants';

import type {SchemaToValueType} from './helpers';
import type {JsonSchema} from './schema';

export interface DefaultNodeLayoutProps {
    copy?: boolean;
    hidden?: boolean;
    open?: boolean;
    required?: boolean;
}

export interface NodeLayoutProps<
    Schema extends JsonSchema,
    Props extends Record<string, any> = {},
    Value extends SchemaToValueType<Schema> = SchemaToValueType<Schema>,
> extends FieldRenderProps<Value | null | undefined> {
    children: React.ReactNode;
    headName: string;
    mode: SchemaRendererMode;
    props: DefaultNodeLayoutProps & Partial<Props>;
    schema: Schema;
    schemaPath: string;
}

export type NodeLayout<
    Schema extends JsonSchema,
    Props extends Record<string, any> = {},
    Value extends SchemaToValueType<Schema> = SchemaToValueType<Schema>,
> = React.FC<NodeLayoutProps<Schema, Props, Value>>;

export interface DefaultNodeEntityProps {
    disabled?: boolean;
    required?: boolean;
}

export interface NodeEntityProps<
    Schema extends JsonSchema,
    Props extends Record<string, any> = {},
    LayoutProps extends Record<string, any> = {},
    Value extends SchemaToValueType<Schema> = SchemaToValueType<Schema>,
> extends FieldRenderProps<Value | null | undefined> {
    Layout?: NodeLayout<Schema, LayoutProps>;
    headName: string;
    layoutProps?: DefaultNodeLayoutProps & Partial<LayoutProps>;
    mode: SchemaRendererMode;
    props: DefaultNodeEntityProps & Partial<Props>;
    schema: Schema;
    schemaPath: string;
}

export type NodeEntity<
    Schema extends JsonSchema,
    Props extends Record<string, any> = {},
    LayoutProps extends Record<string, any> = {},
    Value extends SchemaToValueType<Schema> = SchemaToValueType<Schema>,
> = React.FC<NodeEntityProps<Schema, Props, LayoutProps, Value>>;
