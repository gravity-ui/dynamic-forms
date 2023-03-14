import {ArraySpec, ArrayValue} from '../../../types';

import {
    FieldArrayValue,
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

export type ArrayInputProps = InputProps<FieldArrayValue, ArraySpec>;
export type ArrayIndependentInputProps = IndependentInputProps<FieldArrayValue, ArraySpec>;
export type ArrayLayoutProps = LayoutProps<FieldArrayValue, ArraySpec>;

export type ArrayInput = InputType<FieldArrayValue, ArraySpec>;
export type ArrayIndependentInput = IndependentInputType<FieldArrayValue, ArraySpec>;
export type ArrayLayout = LayoutType<FieldArrayValue, ArraySpec>;

export type ArrayInputEntity = InputEntity<FieldArrayValue, ArraySpec>;
export type ArrayIndependentInputEntity = IndependentInputEntity<FieldArrayValue, ArraySpec>;

export type ArrayInputsMap = InputsMap<FieldArrayValue, ArraySpec>;
export type ArrayLayoutsMap = LayoutsMap<FieldArrayValue, ArraySpec>;
export type ArrayValidatorsMap = ValidatorsMap<ArrayValue, ArraySpec>;

export type ArrayConfig = TypeConfig<FieldArrayValue, ArrayValue, ArraySpec>;
