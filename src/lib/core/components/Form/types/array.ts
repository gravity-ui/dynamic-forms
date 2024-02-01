import {ArraySpec, ArrayValue} from '../../../types';

import {
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
} from './';

export type ArrayInputProps<InputComponentProps extends Record<string, any> = {}> = InputProps<
    FieldArrayValue,
    ArraySpec<undefined, InputComponentProps>
>;
export type ArrayIndependentInputProps<
    InputComponentProps extends Record<string, any> = {},
    LayoutComponentProps extends Record<string, any> = {},
> = IndependentInputProps<
    FieldArrayValue,
    ArraySpec<undefined, InputComponentProps, LayoutComponentProps>
>;

export type ArrayLayoutProps<LayoutComponentProps extends Record<string, any> = {}> = LayoutProps<
    FieldArrayValue,
    ArraySpec<undefined, any, LayoutComponentProps>
>;

export type ArrayInput<InputComponentProps extends Record<string, any> = {}> = InputType<
    FieldArrayValue,
    ArraySpec<undefined, InputComponentProps>
>;
export type ArrayIndependentInput<
    InputComponentProps extends Record<string, any> = {},
    LayoutComponentProps extends Record<string, any> = {},
> = IndependentInputType<
    FieldArrayValue,
    ArraySpec<undefined, InputComponentProps, LayoutComponentProps>
>;

export type ArrayLayout<LayoutComponentProps extends Record<string, any> = {}> = LayoutType<
    FieldArrayValue,
    ArraySpec<undefined, any, LayoutComponentProps>
>;

export type ArrayInputEntity = InputEntity<FieldArrayValue, ArraySpec>;
export type ArrayIndependentInputEntity = IndependentInputEntity<FieldArrayValue, ArraySpec>;

export type ArrayInputsMap = InputsMap<FieldArrayValue, ArraySpec>;
export type ArrayLayoutsMap = LayoutsMap<FieldArrayValue, ArraySpec>;
export type ArrayValidatorsMap = ValidatorsMap<ArrayValue, ArraySpec>;

export type ArrayConfig = TypeConfig<FieldArrayValue, ArrayValue, ArraySpec>;
