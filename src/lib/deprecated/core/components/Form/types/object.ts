import type {ObjectSpec, ObjectValue} from '../../../types';

import type {
    FieldObjectValue,
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
export type ObjectInputProps<
    InputComponentProps extends Record<string, any> | undefined = undefined,
> = InputProps<
    FieldObjectValue,
    InputComponentProps,
    undefined,
    ObjectSpec<undefined, InputComponentProps, undefined>
>;
/** @deprecated Use the SchemaRenderer API. */
export type ObjectIndependentInputProps<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = IndependentInputProps<
    FieldObjectValue,
    InputComponentProps,
    LayoutComponentProps,
    ObjectSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

/** @deprecated Use the SchemaRenderer API. */
export type ObjectLayoutProps<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = LayoutProps<
    FieldObjectValue,
    InputComponentProps,
    LayoutComponentProps,
    ObjectSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

/** @deprecated Use the SchemaRenderer API. */
export type ObjectInput<InputComponentProps extends Record<string, any> | undefined = undefined> =
    InputType<
        FieldObjectValue,
        InputComponentProps,
        undefined,
        ObjectSpec<undefined, InputComponentProps, undefined>
    >;

/** @deprecated Use the SchemaRenderer API. */
export type ObjectIndependentInput<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = IndependentInputType<
    FieldObjectValue,
    InputComponentProps,
    LayoutComponentProps,
    ObjectSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

/** @deprecated Use the SchemaRenderer API. */
export type ObjectLayout<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = LayoutType<
    FieldObjectValue,
    InputComponentProps,
    LayoutComponentProps,
    ObjectSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

/** @deprecated Use the SchemaRenderer API. */
export type ObjectInputEntity<
    InputComponentProps extends Record<string, any> | undefined = undefined,
> = InputEntity<
    FieldObjectValue,
    InputComponentProps,
    undefined,
    ObjectSpec<undefined, InputComponentProps, undefined>
>;
/** @deprecated Use the SchemaRenderer API. */
export type ObjectIndependentInputEntity<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = IndependentInputEntity<
    FieldObjectValue,
    InputComponentProps,
    LayoutComponentProps,
    ObjectSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

/** @deprecated Use the SchemaRenderer API. */
export type ObjectInputsMap = InputsMap<FieldObjectValue, ObjectSpec<undefined, any, any>>;
/** @deprecated Use the SchemaRenderer API. */
export type ObjectLayoutsMap = LayoutsMap<FieldObjectValue, ObjectSpec<undefined, any, any>>;
/** @deprecated Use the SchemaRenderer API. */
export type ObjectValidatorsMap = ValidatorsMap<ObjectValue, ObjectSpec<undefined, any, any>>;

/** @deprecated Use the SchemaRenderer API. */
export type ObjectConfig = TypeConfig<
    FieldObjectValue,
    ObjectValue,
    ObjectSpec<undefined, any, any>
>;
