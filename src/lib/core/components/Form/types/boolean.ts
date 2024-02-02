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

export type BooleanInputProps<InputComponentProps extends Record<string, any> = {}> = InputProps<
    boolean,
    BooleanSpec<undefined, InputComponentProps>
>;

export type BooleanIndependentInputProps<
    InputComponentProps extends Record<string, any> = {},
    LayoutComponentProps extends Record<string, any> = {},
> = IndependentInputProps<
    boolean,
    BooleanSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

export type BooleanLayoutProps<LayoutComponentProps extends Record<string, any> = {}> = LayoutProps<
    boolean,
    BooleanSpec<undefined, any, LayoutComponentProps>
>;

export type BooleanInput<InputComponentProps extends Record<string, any> = {}> = InputType<
    boolean,
    BooleanSpec<undefined, InputComponentProps>
>;

export type BooleanIndependentInput<
    InputComponentProps extends Record<string, any> = {},
    LayoutComponentProps extends Record<string, any> = {},
> = IndependentInputType<
    boolean,
    BooleanSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

export type BooleanLayout<LayoutComponentProps extends Record<string, any> = {}> = LayoutType<
    boolean,
    BooleanSpec<undefined, any, LayoutComponentProps>
>;

export type BooleanInputEntity = InputEntity<boolean, BooleanSpec>;
export type BooleanIndependentInputEntity = IndependentInputEntity<boolean, BooleanSpec>;

export type BooleanInputsMap = InputsMap<boolean, BooleanSpec>;
export type BooleanLayoutsMap = LayoutsMap<boolean, BooleanSpec>;
export type BooleanValidatorsMap = ValidatorsMap<boolean, BooleanSpec>;

export type BooleanConfig = TypeConfig<boolean, boolean, BooleanSpec>;
