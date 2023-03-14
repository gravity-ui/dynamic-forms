import {StringSpec} from '../../../types';

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

export type StringInputProps = InputProps<string, StringSpec>;
export type StringIndependentInputProps = IndependentInputProps<string, StringSpec>;
export type StringLayoutProps = LayoutProps<string, StringSpec>;

export type StringInput = InputType<string, StringSpec>;
export type StringIndependentInput = IndependentInputType<string, StringSpec>;
export type StringLayout = LayoutType<string, StringSpec>;

export type StringInputEntity = InputEntity<string, StringSpec>;
export type StringIndependentInputEntity = IndependentInputEntity<string, StringSpec>;

export type StringInputsMap = InputsMap<string, StringSpec>;
export type StringLayoutsMap = LayoutsMap<string, StringSpec>;
export type StringValidatorsMap = ValidatorsMap<string, StringSpec>;

export type StringConfig = TypeConfig<string, string, StringSpec>;
