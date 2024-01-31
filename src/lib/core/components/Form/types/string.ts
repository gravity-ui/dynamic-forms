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

export type StringInputProps<IProps extends Record<string, any> = {}> = InputProps<
    string,
    StringSpec<any, IProps>
>;

export type StringIndependentInputProps<IProps extends Record<string, any> = {}> =
    IndependentInputProps<string, StringSpec<any, IProps>>;

export type StringLayoutProps<LProps extends Record<string, any> = {}> = LayoutProps<
    string,
    StringSpec<any, any, LProps>
>;

export type StringInput<IProps extends Record<string, any> = {}> = InputType<
    string,
    StringSpec<any, IProps>
>;

export type StringIndependentInput<IProps extends Record<string, any> = {}> = IndependentInputType<
    string,
    StringSpec<any, IProps>
>;

export type StringLayout<LProps extends Record<string, any> = {}> = LayoutType<
    string,
    StringSpec<any, any, LProps>
>;

export type StringInputEntity = InputEntity<string, StringSpec>;
export type StringIndependentInputEntity = IndependentInputEntity<string, StringSpec>;

export type StringInputsMap = InputsMap<string, StringSpec>;
export type StringLayoutsMap = LayoutsMap<string, StringSpec>;
export type StringValidatorsMap = ValidatorsMap<string, StringSpec>;

export type StringConfig = TypeConfig<string, string, StringSpec>;
