import type {SchemaToValueType} from './helpers';
import type {JSLErrors} from './jsl-errors';
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
    additionalItems?: ((e: JSLErrors.AdditionalItems) => string) | string;
    additionalProperties?: ((e: JSLErrors.AdditionalProperties) => string) | string;
    anyOf?: ((e: JSLErrors.AnyOf) => string) | string;
    const?: ((e: JSLErrors.Const) => string) | string;
    contains?: ((e: JSLErrors.ContainsAny) => string) | string;
    dependencies?: ((e: JSLErrors.Dependencies) => string) | string;
    enum?: ((e: JSLErrors.Enum) => string) | string;
    exclusiveMaximum?: ((e: JSLErrors.ExclusiveMaximum) => string) | string;
    exclusiveMinimum?: ((e: JSLErrors.ExclusiveMinimum) => string) | string;
    maxItems?: ((e: JSLErrors.MaxItems) => string) | string;
    maxLength?: ((e: JSLErrors.MaxLength) => string) | string;
    maxProperties?: ((e: JSLErrors.MaxProperties) => string) | string;
    maximum?: ((e: JSLErrors.Maximum) => string) | string;
    minItems?: ((e: JSLErrors.MinItems) => string) | string;
    minLength?: ((e: JSLErrors.MinLength) => string) | string;
    minProperties?: ((e: JSLErrors.MinProperties) => string) | string;
    minimum?: ((e: JSLErrors.Minimum) => string) | string;
    multipleOf?: ((e: JSLErrors.MultipleOf) => string) | string;
    not?: ((e: JSLErrors.Not) => string) | string;
    oneOf?: ((e: JSLErrors.OneOf) => string) | string;
    pattern?: ((e: JSLErrors.Pattern) => string) | string;
    propertyNames?: ((e: JSLErrors.PropertyNames) => string) | string;
    required?: ((e: JSLErrors.Required) => string) | string;
    type?: ((e: JSLErrors.Type) => string) | string;
    uniqueItems?: ((e: JSLErrors.UniqueItems) => string) | string;
}
