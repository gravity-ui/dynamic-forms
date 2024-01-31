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

export type ArrayInputProps<IProps extends Record<string, any> = {}> = InputProps<
    FieldArrayValue,
    ArraySpec<any, IProps>
>;
export type ArrayIndependentInputProps<IProps extends Record<string, any> = {}> =
    IndependentInputProps<FieldArrayValue, ArraySpec<any, IProps>>;

export type ArrayLayoutProps<LProps extends Record<string, any> = {}> = LayoutProps<
    FieldArrayValue,
    ArraySpec<any, any, LProps>
>;

export type ArrayInput<IProps extends Record<string, any> = {}> = InputType<
    FieldArrayValue,
    ArraySpec<any, IProps>
>;
export type ArrayIndependentInput<IProps extends Record<string, any> = {}> = IndependentInputType<
    FieldArrayValue,
    ArraySpec<any, IProps>
>;
export type ArrayLayout<LProps extends Record<string, any> = {}> = LayoutType<
    FieldArrayValue,
    ArraySpec<any, any, LProps>
>;

export type ArrayInputEntity = InputEntity<FieldArrayValue, ArraySpec>;
export type ArrayIndependentInputEntity = IndependentInputEntity<FieldArrayValue, ArraySpec>;

export type ArrayInputsMap = InputsMap<FieldArrayValue, ArraySpec>;
export type ArrayLayoutsMap = LayoutsMap<FieldArrayValue, ArraySpec>;
export type ArrayValidatorsMap = ValidatorsMap<ArrayValue, ArraySpec>;

export type ArrayConfig = TypeConfig<FieldArrayValue, ArrayValue, ArraySpec>;
