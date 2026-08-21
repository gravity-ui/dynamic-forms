import type {FieldValue, JsonSchema, ValidationError, Validator} from '../../types';

export interface ValidationWaiter {
    promise: Promise<ValidationError>;
    schema: JsonSchema;
    validator: Validator<JsonSchema>;
    value: FieldValue;
}

export interface ValidationCache extends Omit<ValidationWaiter, 'promise'> {
    result: ValidationError;
}
