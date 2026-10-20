import type {FieldObjectValue, ValidateError} from '.';

/** @deprecated Use the SchemaRenderer API. */
export interface DynamicFieldStore {
    name: string;
    initialValue: FieldObjectValue;
    values: FieldObjectValue;
    errors: Record<string, ValidateError>;
}
