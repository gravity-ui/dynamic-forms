import {NumberSpec} from '../../../types';

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

export type NumberInputProps = InputProps<number, NumberSpec>;
export type NumberIndependentInputProps = IndependentInputProps<number, NumberSpec>;
export type NumberLayoutProps = LayoutProps<number, NumberSpec>;

export type NumberInput = InputType<number, NumberSpec>;
export type NumberIndependentInput = IndependentInputType<number, NumberSpec>;
export type NumberLayout = LayoutType<number, NumberSpec>;

export type NumberInputEntity = InputEntity<number, NumberSpec>;
export type NumberIndependentInputEntity = IndependentInputEntity<number, NumberSpec>;

export type NumberInputsMap = InputsMap<number, NumberSpec>;
export type NumberLayoutsMap = LayoutsMap<number, NumberSpec>;
export type NumberValidatorsMap = ValidatorsMap<number, NumberSpec>;

export type NumberConfig = TypeConfig<number, number, NumberSpec>;
