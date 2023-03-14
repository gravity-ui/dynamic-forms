import {BooleanSpec} from '../../../types';

import {
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

export type BooleanInputProps = InputProps<boolean, BooleanSpec>;
export type BooleanIndependentInputProps = IndependentInputProps<boolean, BooleanSpec>;
export type BooleanLayoutProps = LayoutProps<boolean, BooleanSpec>;

export type BooleanInput = InputType<boolean, BooleanSpec>;
export type BooleanIndependentInput = IndependentInputType<boolean, BooleanSpec>;
export type BooleanLayout = LayoutType<boolean, BooleanSpec>;

export type BooleanInputEntity = InputEntity<boolean, BooleanSpec>;
export type BooleanIndependentInputEntity = IndependentInputEntity<boolean, BooleanSpec>;

export type BooleanInputsMap = InputsMap<boolean, BooleanSpec>;
export type BooleanLayoutsMap = LayoutsMap<boolean, BooleanSpec>;
export type BooleanValidatorsMap = ValidatorsMap<boolean, BooleanSpec>;

export type BooleanConfig = TypeConfig<boolean, boolean, BooleanSpec>;
