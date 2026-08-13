import type {ErrorObject} from 'ajv';

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

export type NodeParametersErrorObject = ErrorObject<
    'nodeParameters',
    {schema: JsonSchema; validator: Validator<JsonSchema>; value: FieldValue}
>;
