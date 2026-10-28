import type {FormValue, Spec} from '../../../types';

export type BaseValidateError = string | boolean | undefined;

export type AsyncValidateError = Promise<BaseValidateError>;

export type ValidateError = BaseValidateError | AsyncValidateError;

export type ValidatorType<Value extends FormValue, SpecType extends Spec> = (
    spec: SpecType,
    value?: Value,
) => ValidateError;

export type ValidatorsMap<Value extends FormValue, SpecType extends Spec> = {
    base: ValidatorType<Value, SpecType>;
} & Record<string, ValidatorType<Value, SpecType> | undefined>;
