import type {FieldObjectValue, ValidateError} from '../types';

export interface DynamicFieldStore {
    name: string;
    initialValue: FieldObjectValue;
    values: FieldObjectValue;
    errors: Record<string, ValidateError>;
}
