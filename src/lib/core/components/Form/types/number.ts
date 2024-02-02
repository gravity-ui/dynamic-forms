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

export type NumberInputProps<InputComponentProps extends Record<string, any> = {}> = InputProps<
    number,
    NumberSpec<undefined, InputComponentProps>
>;

export type NumberIndependentInputProps<
    InputComponentProps extends Record<string, any> = {},
    LayoutComponentProps extends Record<string, any> = {},
> = IndependentInputProps<number, NumberSpec<undefined, InputComponentProps, LayoutComponentProps>>;

export type NumberLayoutProps<LayoutComponentProps extends Record<string, any> = {}> = LayoutProps<
    number,
    NumberSpec<undefined, any, LayoutComponentProps>
>;

export type NumberInput<InputComponentProps extends Record<string, any> = {}> = InputType<
    number,
    NumberSpec<undefined, InputComponentProps>
>;

export type NumberIndependentInput<
    InputComponentProps extends Record<string, any> = {},
    LayoutComponentProps extends Record<string, any> = {},
> = IndependentInputType<number, NumberSpec<undefined, InputComponentProps, LayoutComponentProps>>;

export type NumberLayout<LayoutComponentProps extends Record<string, any> = {}> = LayoutType<
    number,
    NumberSpec<undefined, any, LayoutComponentProps>
>;

export type NumberInputEntity = InputEntity<number, NumberSpec>;
export type NumberIndependentInputEntity = IndependentInputEntity<number, NumberSpec>;

export type NumberInputsMap = InputsMap<number, NumberSpec>;
export type NumberLayoutsMap = LayoutsMap<number, NumberSpec>;
export type NumberValidatorsMap = ValidatorsMap<number, NumberSpec>;

export type NumberConfig = TypeConfig<number, number, NumberSpec>;
