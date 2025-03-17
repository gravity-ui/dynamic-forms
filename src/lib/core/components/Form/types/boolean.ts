import type {BooleanSpec} from '../../../types';

import type {
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

export type BooleanInputProps<
    InputComponentProps extends Record<string, any> | undefined = undefined,
> = InputProps<
    boolean,
    InputComponentProps,
    undefined,
    BooleanSpec<undefined, InputComponentProps, undefined>
>;

export type BooleanIndependentInputProps<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = IndependentInputProps<
    boolean,
    InputComponentProps,
    LayoutComponentProps,
    BooleanSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

export type BooleanLayoutProps<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = LayoutProps<
    boolean,
    InputComponentProps,
    LayoutComponentProps,
    BooleanSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

export type BooleanInput<InputComponentProps extends Record<string, any> | undefined = undefined> =
    InputType<
        boolean,
        InputComponentProps,
        undefined,
        BooleanSpec<undefined, InputComponentProps, undefined>
    >;

export type BooleanIndependentInput<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = IndependentInputType<
    boolean,
    InputComponentProps,
    LayoutComponentProps,
    BooleanSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

export type BooleanLayout<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = LayoutType<
    boolean,
    InputComponentProps,
    LayoutComponentProps,
    BooleanSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

export type BooleanInputEntity<
    InputComponentProps extends Record<string, any> | undefined = undefined,
> = InputEntity<
    boolean,
    InputComponentProps,
    undefined,
    BooleanSpec<undefined, InputComponentProps, undefined>
>;
export type BooleanIndependentInputEntity<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = IndependentInputEntity<
    boolean,
    InputComponentProps,
    LayoutComponentProps,
    BooleanSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

export type BooleanInputsMap = InputsMap<boolean, BooleanSpec<undefined, any, any>>;
export type BooleanLayoutsMap = LayoutsMap<boolean, BooleanSpec<undefined, any, any>>;
export type BooleanValidatorsMap = ValidatorsMap<boolean, BooleanSpec<undefined, any, any>>;

export type BooleanConfig = TypeConfig<boolean, boolean, BooleanSpec<undefined, any, any>>;
