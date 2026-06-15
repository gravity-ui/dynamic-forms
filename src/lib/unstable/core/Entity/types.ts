import type {SchemaRendererMode} from '../constants';
import type {Control, JsonSchema, SchemaRendererConfig, View, Wrapper} from '../types';

export type GetRenderKitParams<Schema extends JsonSchema> = {
    config?: SchemaRendererConfig;
    schema: Schema;
};

export type GetRenderKitReturn<Schema extends JsonSchema> = {
    [SchemaRendererMode.Form]: {
        Component: Control<Schema> | undefined;
        props: Record<string, any>;
        independent: boolean | undefined;
        Wrapper: Wrapper<Schema> | undefined;
        wrapperProps: Record<string, any>;
    };
    [SchemaRendererMode.Overview]: {
        Component: View<Schema> | undefined;
        props: Record<string, any>;
        independent: boolean | undefined;
        Wrapper: Wrapper<Schema> | undefined;
        wrapperProps: Record<string, any>;
    };
};

export interface EntityState {
    headName?: string;
    schema?: JsonSchema;
}
