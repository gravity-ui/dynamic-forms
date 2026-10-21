import type {ArraySpec, ArrayValue} from '../../../types';

import type {
    FieldArrayValue,
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
export type ArrayInputProps<
    InputComponentProps extends Record<string, any> | undefined = undefined,
> = InputProps<
    FieldArrayValue,
    InputComponentProps,
    undefined,
    ArraySpec<undefined, InputComponentProps, undefined>
>;

/** @deprecated Use the SchemaRenderer API. */
export type ArrayIndependentInputProps<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = IndependentInputProps<
    FieldArrayValue,
    InputComponentProps,
    LayoutComponentProps,
    ArraySpec<undefined, InputComponentProps, LayoutComponentProps>
>;

/** @deprecated Use the SchemaRenderer API. */
export type ArrayLayoutProps<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = LayoutProps<
    FieldArrayValue,
    InputComponentProps,
    LayoutComponentProps,
    ArraySpec<undefined, InputComponentProps, LayoutComponentProps>
>;

/** @deprecated Use the SchemaRenderer API. */
export type ArrayInput<InputComponentProps extends Record<string, any> | undefined = undefined> =
    InputType<
        FieldArrayValue,
        InputComponentProps,
        undefined,
        ArraySpec<undefined, InputComponentProps, undefined>
    >;

/** @deprecated Use the SchemaRenderer API. */
export type ArrayIndependentInput<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = IndependentInputType<
    FieldArrayValue,
    InputComponentProps,
    LayoutComponentProps,
    ArraySpec<undefined, InputComponentProps, LayoutComponentProps>
>;

/** @deprecated Use the SchemaRenderer API. */
export type ArrayLayout<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = LayoutType<
    FieldArrayValue,
    InputComponentProps,
    LayoutComponentProps,
    ArraySpec<undefined, InputComponentProps, LayoutComponentProps>
>;

/** @deprecated Use the SchemaRenderer API. */
export type ArrayInputEntity<
    InputComponentProps extends Record<string, any> | undefined = undefined,
> = InputEntity<
    FieldArrayValue,
    InputComponentProps,
    undefined,
    ArraySpec<undefined, InputComponentProps, undefined>
>;
/** @deprecated Use the SchemaRenderer API. */
export type ArrayIndependentInputEntity<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = IndependentInputEntity<
    FieldArrayValue,
    InputComponentProps,
    LayoutComponentProps,
    ArraySpec<undefined, InputComponentProps, LayoutComponentProps>
>;

/** @deprecated Use the SchemaRenderer API. */
export type ArrayInputsMap = InputsMap<FieldArrayValue, ArraySpec<undefined, any, any>>;
/** @deprecated Use the SchemaRenderer API. */
export type ArrayLayoutsMap = LayoutsMap<FieldArrayValue, ArraySpec<undefined, any, any>>;
/** @deprecated Use the SchemaRenderer API. */
export type ArrayValidatorsMap = ValidatorsMap<ArrayValue, ArraySpec<undefined, any, any>>;

/** @deprecated Use the SchemaRenderer API. */
export type ArrayConfig = TypeConfig<FieldArrayValue, ArrayValue, ArraySpec<undefined, any, any>>;
