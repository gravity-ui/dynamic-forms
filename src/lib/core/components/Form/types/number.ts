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

export type NumberInputProps<
    InputComponentProps extends Record<string, any> | undefined = undefined,
> = InputProps<
    number,
    InputComponentProps,
    undefined,
    NumberSpec<undefined, InputComponentProps, undefined>
>;

export type NumberIndependentInputProps<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = IndependentInputProps<
    number,
    InputComponentProps,
    LayoutComponentProps,
    NumberSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

export type NumberLayoutProps<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = LayoutProps<
    number,
    InputComponentProps,
    LayoutComponentProps,
    NumberSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

export type NumberInput<InputComponentProps extends Record<string, any> | undefined = undefined> =
    InputType<
        number,
        InputComponentProps,
        undefined,
        NumberSpec<undefined, InputComponentProps, undefined>
    >;

export type NumberIndependentInput<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = IndependentInputType<
    number,
    InputComponentProps,
    LayoutComponentProps,
    NumberSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

export type NumberLayout<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = LayoutType<
    number,
    InputComponentProps,
    LayoutComponentProps,
    NumberSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

export type NumberInputEntity<
    InputComponentProps extends Record<string, any> | undefined = undefined,
> = InputEntity<
    number,
    InputComponentProps,
    undefined,
    NumberSpec<undefined, InputComponentProps, undefined>
>;
export type NumberIndependentInputEntity<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = IndependentInputEntity<
    number,
    InputComponentProps,
    LayoutComponentProps,
    NumberSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

export type NumberInputsMap = InputsMap<number, NumberSpec<undefined, any, any>>;
export type NumberLayoutsMap = LayoutsMap<number, NumberSpec<undefined, any, any>>;
export type NumberValidatorsMap = ValidatorsMap<number, NumberSpec<undefined, any, any>>;

export type NumberConfig = TypeConfig<number, number, NumberSpec<undefined, any, any>>;
