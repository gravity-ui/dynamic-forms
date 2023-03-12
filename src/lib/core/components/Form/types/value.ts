import {OBJECT_ARRAY_CNT, OBJECT_ARRAY_FLAG} from '../constants';

export interface FieldArrayValue extends Record<string, FieldValue> {
    [OBJECT_ARRAY_FLAG]: true;
    [OBJECT_ARRAY_CNT]: number;
}

export interface FieldObjectValue extends Record<string, FieldValue> {}

export type FieldValue =
    | number
    | boolean
    | string
    | FieldArrayValue
    | FieldObjectValue
    | null
    | undefined;
