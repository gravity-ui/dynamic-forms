import {ObjectSpec, ObjectValue} from '../../../types';

import {
    FieldObjectValue,
    IndependentInputEntity,
    IndependentInputProps,
    IndependentInputType,
    InputEntity,
    InputProps,
    InputType,
    InputsMap,
    LayoutProps,
    LayoutType,
    LayoutsMap,
    TypeConfig,
    ValidatorsMap,
} from './';

export type ObjectInputProps<InputComponentProps extends Record<string, any> = {}> = InputProps<
    FieldObjectValue,
    ObjectSpec<undefined, InputComponentProps>
>;
export type ObjectIndependentInputProps<
    InputComponentProps extends Record<string, any> = {},
    LayoutComponentProps extends Record<string, any> = {},
> = IndependentInputProps<
    FieldObjectValue,
    ObjectSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

export type ObjectLayoutProps<LayoutComponentProps extends Record<string, any> = {}> = LayoutProps<
    FieldObjectValue,
    ObjectSpec<undefined, any, LayoutComponentProps>
>;

export type ObjectInput<InputComponentProps extends Record<string, any> = {}> = InputType<
    FieldObjectValue,
    ObjectSpec<undefined, InputComponentProps>
>;

export type ObjectIndependentInput<
    InputComponentProps extends Record<string, any> = {},
    LayoutComponentProps extends Record<string, any> = {},
> = IndependentInputType<
    FieldObjectValue,
    ObjectSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

export type ObjectLayout<LayoutComponentProps extends Record<string, any> = {}> = LayoutType<
    FieldObjectValue,
    ObjectSpec<undefined, any, LayoutComponentProps>
>;

export type ObjectInputEntity = InputEntity<FieldObjectValue, ObjectSpec>;
export type ObjectIndependentInputEntity = IndependentInputEntity<FieldObjectValue, ObjectSpec>;

export type ObjectInputsMap = InputsMap<FieldObjectValue, ObjectSpec>;
export type ObjectLayoutsMap = LayoutsMap<FieldObjectValue, ObjectSpec>;
export type ObjectValidatorsMap = ValidatorsMap<ObjectValue, ObjectSpec>;

export type ObjectConfig = TypeConfig<FieldObjectValue, ObjectValue, ObjectSpec>;
