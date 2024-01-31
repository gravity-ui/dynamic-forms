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

export type NumberInputProps<IProps extends Record<string, any> = {}> = InputProps<
    number,
    NumberSpec<any, IProps>
>;

export type NumberIndependentInputProps<IProps extends Record<string, any> = {}> =
    IndependentInputProps<number, NumberSpec<any, IProps>>;

export type NumberLayoutProps<LProps extends Record<string, any> = {}> = LayoutProps<
    number,
    NumberSpec<any, any, LProps>
>;

export type NumberInput<IProps extends Record<string, any> = {}> = InputType<
    number,
    NumberSpec<any, IProps>
>;

export type NumberIndependentInput<IProps extends Record<string, any> = {}> = IndependentInputType<
    number,
    NumberSpec<any, IProps>
>;
export type NumberLayout<LProps extends Record<string, any> = {}> = LayoutType<
    number,
    NumberSpec<any, any, LProps>
>;

export type NumberInputEntity = InputEntity<number, NumberSpec>;
export type NumberIndependentInputEntity = IndependentInputEntity<number, NumberSpec>;

export type NumberInputsMap = InputsMap<number, NumberSpec>;
export type NumberLayoutsMap = LayoutsMap<number, NumberSpec>;
export type NumberValidatorsMap = ValidatorsMap<number, NumberSpec>;

export type NumberConfig = TypeConfig<number, number, NumberSpec>;
