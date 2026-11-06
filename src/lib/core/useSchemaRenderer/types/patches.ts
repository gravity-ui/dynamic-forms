import type {JsonSchema} from '../../types';

export type SchemaPatch =
    | {headName: string; name: string; schema: JsonSchema; replace?: boolean}
    | {headName: string; schemaPath: string; schema: JsonSchema; replace?: boolean};

export type SchemaPatchRemover =
    | {headName: string; name: string; schema: JsonSchema | true}
    | {headName: string; schemaPath: string; schema: JsonSchema | true};
