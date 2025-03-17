import type {FormValue, Spec} from '../../../types';

import type {
    ArrayConfig,
    BooleanConfig,
    FieldValue,
    InputsMap,
    LayoutsMap,
    NumberConfig,
    ObjectConfig,
    StringConfig,
    ValidatorsMap,
} from './';

export interface TypeConfig<
    DirtyValue extends FieldValue,
    Value extends FormValue,
    SpecType extends Spec<undefined, any, any>,
> {
    inputs: InputsMap<DirtyValue, SpecType>;
    layouts: LayoutsMap<DirtyValue, SpecType>;
    validators: ValidatorsMap<Value, SpecType>;
}

export interface DynamicFormConfig {
    array: ArrayConfig;
    boolean: BooleanConfig;
    number: NumberConfig;
    object: ObjectConfig;
    string: StringConfig;
}
