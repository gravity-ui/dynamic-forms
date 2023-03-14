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

export type ObjectInputProps = InputProps<FieldObjectValue, ObjectSpec>;
export type ObjectIndependentInputProps = IndependentInputProps<FieldObjectValue, ObjectSpec>;
export type ObjectLayoutProps = LayoutProps<FieldObjectValue, ObjectSpec>;

export type ObjectInput = InputType<FieldObjectValue, ObjectSpec>;
export type ObjectIndependentInput = IndependentInputType<FieldObjectValue, ObjectSpec>;
export type ObjectLayout = LayoutType<FieldObjectValue, ObjectSpec>;

export type ObjectInputEntity = InputEntity<FieldObjectValue, ObjectSpec>;
export type ObjectIndependentInputEntity = IndependentInputEntity<FieldObjectValue, ObjectSpec>;

export type ObjectInputsMap = InputsMap<FieldObjectValue, ObjectSpec>;
export type ObjectLayoutsMap = LayoutsMap<FieldObjectValue, ObjectSpec>;
export type ObjectValidatorsMap = ValidatorsMap<ObjectValue, ObjectSpec>;

export type ObjectConfig = TypeConfig<FieldObjectValue, ObjectValue, ObjectSpec>;
