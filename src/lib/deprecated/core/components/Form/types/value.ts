import type {OBJECT_ARRAY_CNT, OBJECT_ARRAY_FLAG} from '../constants';

/** @deprecated Use the SchemaRenderer API. */
export interface FieldArrayValue extends Record<string, FieldValue> {
    [OBJECT_ARRAY_FLAG]: true;
    [OBJECT_ARRAY_CNT]: number;
}

/** @deprecated Use the SchemaRenderer API. */
export interface FieldObjectValue extends Record<string, FieldValue> {}

/** @deprecated Use the SchemaRenderer API. */
export type FieldValue =
    | number
    | boolean
    | string
    | FieldArrayValue
    | FieldObjectValue
    | null
    | undefined;
