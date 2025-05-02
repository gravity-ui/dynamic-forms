import type {SchemaToValueType} from './helpers';
import type {JsonSchema} from './schema';
import type {ObjectValue} from './values';

type ArrayError = SyncValidateError[];
interface ObjectError extends Record<string, SyncValidateError> {}

export type SyncValidateError = ArrayError | boolean | string | ObjectError | undefined;

export type AsyncValidateError = Promise<SyncValidateError>;

export type SyncValidator<Schema extends JsonSchema> = (
    value: SchemaToValueType<Schema> | null | undefined,
    allValues: ObjectValue,
) => SyncValidateError;

export type AsyncValidator<Schema extends JsonSchema> = (
    value: SchemaToValueType<Schema> | null | undefined,
    allValues: ObjectValue,
) => AsyncValidateError;

export type Validator<Schema extends JsonSchema> = SyncValidator<Schema> | AsyncValidator<Schema>;

export interface ErrorMessages {
    additionalProperties?: string;
    anyOf?: string;
    const?: string;
    contains?: string;
    dependencies?: string;
    else?: string;
    enum?: string;
    exclusiveMaximum?: string;
    exclusiveMinimum?: string;
    maxContains?: string;
    maxItems?: string;
    maxLength?: string;
    maxProperties?: string;
    maximum?: string;
    minContains?: string;
    minItems?: string;
    minLength?: string;
    minProperties?: string;
    minimum?: string;
    multipleOf?: string;
    not?: string;
    oneOf?: string;
    pattern?: string;
    propertyNames?: string;
    required?: string;
    then?: string;
    type?: string;
    uniqueItems?: string;
}
