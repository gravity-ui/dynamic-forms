import type {StringSpec} from '../../../types';

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
} from '.';

/** @deprecated Use the SchemaRenderer API. */
export type StringInputProps<
    InputComponentProps extends Record<string, any> | undefined = undefined,
> = InputProps<
    string,
    InputComponentProps,
    undefined,
    StringSpec<undefined, InputComponentProps, undefined>
>;

/** @deprecated Use the SchemaRenderer API. */
export type StringIndependentInputProps<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = IndependentInputProps<
    string,
    InputComponentProps,
    LayoutComponentProps,
    StringSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

/** @deprecated Use the SchemaRenderer API. */
export type StringLayoutProps<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = LayoutProps<
    string,
    InputComponentProps,
    LayoutComponentProps,
    StringSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

/** @deprecated Use the SchemaRenderer API. */
export type StringInput<InputComponentProps extends Record<string, any> | undefined = undefined> =
    InputType<
        string,
        InputComponentProps,
        undefined,
        StringSpec<undefined, InputComponentProps, undefined>
    >;

/** @deprecated Use the SchemaRenderer API. */
export type StringIndependentInput<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = IndependentInputType<
    string,
    InputComponentProps,
    LayoutComponentProps,
    StringSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

/** @deprecated Use the SchemaRenderer API. */
export type StringLayout<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = LayoutType<
    string,
    InputComponentProps,
    LayoutComponentProps,
    StringSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

/** @deprecated Use the SchemaRenderer API. */
export type StringInputEntity<
    InputComponentProps extends Record<string, any> | undefined = undefined,
> = InputEntity<
    string,
    InputComponentProps,
    undefined,
    StringSpec<undefined, InputComponentProps, undefined>
>;
/** @deprecated Use the SchemaRenderer API. */
export type StringIndependentInputEntity<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = IndependentInputEntity<
    string,
    InputComponentProps,
    LayoutComponentProps,
    StringSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

/** @deprecated Use the SchemaRenderer API. */
export type StringInputsMap = InputsMap<string, StringSpec<undefined, any, any>>;
/** @deprecated Use the SchemaRenderer API. */
export type StringLayoutsMap = LayoutsMap<string, StringSpec<undefined, any, any>>;
/** @deprecated Use the SchemaRenderer API. */
export type StringValidatorsMap = ValidatorsMap<string, StringSpec<undefined, any, any>>;

/** @deprecated Use the SchemaRenderer API. */
export type StringConfig = TypeConfig<string, string, StringSpec<undefined, any, any>>;
