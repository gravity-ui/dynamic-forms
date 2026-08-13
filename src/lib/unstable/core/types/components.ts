import type React from 'react';

import type {FieldRenderProps} from 'react-final-form';

import type {SchemaRendererMode} from '../constants';

import type {SchemaToValueType} from './helpers';
import type {JsonSchema} from './schema';

export interface NodeLayoutProps<Schema extends JsonSchema, Props extends Record<string, any> = {}>
    extends FieldRenderProps<SchemaToValueType<Schema> | null | undefined> {
    children: React.ReactNode;
    headName: string;
    mode: SchemaRendererMode;
    props: {
        copy?: boolean;
        hidden?: boolean;
        open?: boolean;
        required?: boolean;
    } & Partial<Props>;
    schema: Schema;
    schemaPath: string;
}

export type NodeLayout<
    Schema extends JsonSchema,
    Props extends Record<string, any> = {},
> = React.ComponentType<NodeLayoutProps<Schema, Props>>;

export interface NodeEntityProps<
    Schema extends JsonSchema,
    Props extends Record<string, any> = {},
    LayoutProps extends Record<string, any> = {},
> extends FieldRenderProps<SchemaToValueType<Schema> | null | undefined> {
    Layout?: NodeLayout<Schema, LayoutProps>;
    headName: string;
    layoutProps?: LayoutProps;
    mode: SchemaRendererMode;
    props: Partial<Props>;
    schema: Schema;
    schemaPath: string;
}

export type NodeEntity<
    Schema extends JsonSchema,
    Props extends Record<string, any> = {},
    LayoutProps extends Record<string, any> = {},
> = React.ComponentType<NodeEntityProps<Schema, Props, LayoutProps>>;
