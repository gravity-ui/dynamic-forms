import type {FormValue, Spec} from '../../../types';

/** @deprecated Use the SchemaRenderer API. */
export type BaseValidateError = string | boolean | undefined;

/** @deprecated Use the SchemaRenderer API. */
export type AsyncValidateError = Promise<BaseValidateError>;

/** @deprecated Use the SchemaRenderer API. */
export type ValidateError = BaseValidateError | AsyncValidateError;

/** @deprecated Use the SchemaRenderer API. */
export type ValidatorType<Value extends FormValue, SpecType extends Spec> = (
    spec: SpecType,
    value?: Value,
) => ValidateError;

/** @deprecated Use the SchemaRenderer API. */
export type ValidatorsMap<Value extends FormValue, SpecType extends Spec> = {
    base: ValidatorType<Value, SpecType>;
} & Record<string, ValidatorType<Value, SpecType> | undefined>;
