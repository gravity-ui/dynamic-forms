import type {SchemaRendererMode} from '../constants';
import type {JsonSchema, SchemaRendererConfig} from '../types';

export interface SchemaRendererContextType {
    config: SchemaRendererConfig;
    mode: SchemaRendererMode;
    name: string;
    schema: JsonSchema;
    serviceFieldName: string;
}
