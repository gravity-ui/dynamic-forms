import type {SchemaRendererMode} from '../constants';
import type {
    Control,
    ControlWrapper,
    JsonSchema,
    SchemaRendererConfig,
    View,
    ViewWrapper,
} from '../types';

export type GetRenderKitParams<Schema extends JsonSchema> = {
    config?: SchemaRendererConfig;
    schema: Schema;
};

export type GetRenderKitReturn<Schema extends JsonSchema> = {
    [SchemaRendererMode.Form]: {
        Control: Control<Schema> | undefined;
        ControlWrapper: ControlWrapper<Schema> | undefined;
        controlProps: Record<string, any>;
        controlWrapperProps: Record<string, any>;
        independent: boolean | undefined;
    };
    [SchemaRendererMode.Overview]: {
        View: View<Schema> | undefined;
        ViewWrapper: ViewWrapper<Schema> | undefined;
        viewProps: Record<string, any>;
        viewWrapperProps: Record<string, any>;
        independent: boolean | undefined;
    };
};

export interface EntityState<Schema extends JsonSchema = JsonSchema> {
    headName?: string;
    mode?: SchemaRendererMode;
    schema?: Schema;
}
