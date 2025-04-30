import type {SchemaRendererMode} from '../constants';
import type {JsonSchema, SchemaRendererConfig} from '../types';

export interface SchemaRendererContextType {
    config: SchemaRendererConfig;
    mode: SchemaRendererMode;
    headName: string;
    schema: JsonSchema;
    serviceFieldName: string;
}
