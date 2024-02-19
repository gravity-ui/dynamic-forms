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

export type StringInputProps<
    InputComponentProps extends Record<string, any> | undefined = undefined,
> = InputProps<
    string,
    InputComponentProps,
    undefined,
    StringSpec<undefined, InputComponentProps, undefined>
>;

export type StringIndependentInputProps<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = IndependentInputProps<
    string,
    InputComponentProps,
    LayoutComponentProps,
    StringSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

export type StringLayoutProps<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = LayoutProps<
    string,
    InputComponentProps,
    LayoutComponentProps,
    StringSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

export type StringInput<InputComponentProps extends Record<string, any> | undefined = undefined> =
    InputType<
        string,
        InputComponentProps,
        undefined,
        StringSpec<undefined, InputComponentProps, undefined>
    >;

export type StringIndependentInput<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = IndependentInputType<
    string,
    InputComponentProps,
    LayoutComponentProps,
    StringSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

export type StringLayout<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = LayoutType<
    string,
    InputComponentProps,
    LayoutComponentProps,
    StringSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

export type StringInputEntity<
    InputComponentProps extends Record<string, any> | undefined = undefined,
> = InputEntity<
    string,
    InputComponentProps,
    undefined,
    StringSpec<undefined, InputComponentProps, undefined>
>;
export type StringIndependentInputEntity<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = IndependentInputEntity<
    string,
    InputComponentProps,
    LayoutComponentProps,
    StringSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

export type StringInputsMap = InputsMap<string, StringSpec<undefined, any, any>>;
export type StringLayoutsMap = LayoutsMap<string, StringSpec<undefined, any, any>>;
export type StringValidatorsMap = ValidatorsMap<string, StringSpec<undefined, any, any>>;

export type StringConfig = TypeConfig<string, string, StringSpec<undefined, any, any>>;
