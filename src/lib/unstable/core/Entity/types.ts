import type {SchemaRendererMode} from '../constants';
import type {
    IndependentView,
    JsonSchema,
    SchemaRendererConfig,
    SimpleView,
    Wrapper,
} from '../types';

export type GetRenderKitParams<Schema extends JsonSchema> = {
    config: SchemaRendererConfig;
    mode: SchemaRendererMode;
    schema: Schema;
};

export type GetRenderKitReturn<Schema extends JsonSchema> =
    | {
          View: SimpleView<Schema> | undefined;
          Wrapper: Wrapper<Schema> | undefined;
          independent: false | undefined;
          viewProps: Record<string, any>;
          wrapperProps: Record<string, any>;
      }
    | {
          View: IndependentView<Schema>;
          Wrapper: Wrapper<Schema> | undefined;
          independent: true;
          viewProps: Record<string, any>;
          wrapperProps: Record<string, any>;
      };
