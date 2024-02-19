import {ObjectSpec, ObjectValue} from '../../../types';

import {
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
} from './';

export type ObjectInputProps<
    InputComponentProps extends Record<string, any> | undefined = undefined,
> = InputProps<
    FieldObjectValue,
    InputComponentProps,
    undefined,
    ObjectSpec<undefined, InputComponentProps, undefined>
>;
export type ObjectIndependentInputProps<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = IndependentInputProps<
    FieldObjectValue,
    InputComponentProps,
    LayoutComponentProps,
    ObjectSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

export type ObjectLayoutProps<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = LayoutProps<
    FieldObjectValue,
    InputComponentProps,
    LayoutComponentProps,
    ObjectSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

export type ObjectInput<InputComponentProps extends Record<string, any> | undefined = undefined> =
    InputType<
        FieldObjectValue,
        InputComponentProps,
        undefined,
        ObjectSpec<undefined, InputComponentProps, undefined>
    >;

export type ObjectIndependentInput<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = IndependentInputType<
    FieldObjectValue,
    InputComponentProps,
    LayoutComponentProps,
    ObjectSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

export type ObjectLayout<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = LayoutType<
    FieldObjectValue,
    InputComponentProps,
    LayoutComponentProps,
    ObjectSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

export type ObjectInputEntity<
    InputComponentProps extends Record<string, any> | undefined = undefined,
> = InputEntity<
    FieldObjectValue,
    InputComponentProps,
    undefined,
    ObjectSpec<undefined, InputComponentProps, undefined>
>;
export type ObjectIndependentInputEntity<
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
> = IndependentInputEntity<
    FieldObjectValue,
    InputComponentProps,
    LayoutComponentProps,
    ObjectSpec<undefined, InputComponentProps, LayoutComponentProps>
>;

export type ObjectInputsMap = InputsMap<FieldObjectValue, ObjectSpec<undefined, any, any>>;
export type ObjectLayoutsMap = LayoutsMap<FieldObjectValue, ObjectSpec<undefined, any, any>>;
export type ObjectValidatorsMap = ValidatorsMap<ObjectValue, ObjectSpec<undefined, any, any>>;

export type ObjectConfig = TypeConfig<
    FieldObjectValue,
    ObjectValue,
    ObjectSpec<undefined, any, any>
>;
