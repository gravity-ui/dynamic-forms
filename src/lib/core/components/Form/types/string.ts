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

export type StringInputProps<InputComponentProps extends Record<string, any> = {}> = InputProps<
    string,
    StringSpec<undefined, InputComponentProps>
>;

export type StringIndependentInputProps<
    InputComponentProps extends Record<string, any> = {},
    LayoutComponentProps extends Record<string, any> = {},
> = IndependentInputProps<string, StringSpec<undefined, InputComponentProps, LayoutComponentProps>>;

export type StringLayoutProps<LayoutComponentProps extends Record<string, any> = {}> = LayoutProps<
    string,
    StringSpec<undefined, any, LayoutComponentProps>
>;

export type StringInput<InputComponentProps extends Record<string, any> = {}> = InputType<
    string,
    StringSpec<undefined, InputComponentProps>
>;

export type StringIndependentInput<
    InputComponentProps extends Record<string, any> = {},
    LayoutComponentProps extends Record<string, any> = {},
> = IndependentInputType<string, StringSpec<undefined, InputComponentProps, LayoutComponentProps>>;

export type StringLayout<LayoutComponentProps extends Record<string, any> = {}> = LayoutType<
    string,
    StringSpec<undefined, any, LayoutComponentProps>
>;

export type StringInputEntity = InputEntity<string, StringSpec>;
export type StringIndependentInputEntity = IndependentInputEntity<string, StringSpec>;

export type StringInputsMap = InputsMap<string, StringSpec>;
export type StringLayoutsMap = LayoutsMap<string, StringSpec>;
export type StringValidatorsMap = ValidatorsMap<string, StringSpec>;

export type StringConfig = TypeConfig<string, string, StringSpec>;
