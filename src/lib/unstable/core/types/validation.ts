import type {SchemaToValueType} from './helpers';
import type {JsonSchema} from './schema';
import type {ObjectValue} from './values';

type ArrayError = Error[];
interface ObjectError extends Record<string, Error> {}
export type ValidationError = ArrayError | ObjectError | boolean | string | undefined;

export type Validator<Schema extends JsonSchema> = (
    value: SchemaToValueType<Schema> | null | undefined,
    allValues: ObjectValue,
) => ValidationError | Promise<ValidationError>;

export interface ErrorMessages {
    additionalItems?: string;
    additionalProperties?: string;
    anyOf?: string;
    const?: string;
    contains?: string;
    dependencies?: string;
    enum?: string;
    exclusiveMaximum?: string;
    exclusiveMinimum?: string;
    maxItems?: string;
    maxLength?: string;
    maxProperties?: string;
    maximum?: string;
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
    type?: string;
    uniqueItems?: string;
}
