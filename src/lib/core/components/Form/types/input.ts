import type React from 'react';

import type {Spec} from '../../../types';

import type {FieldRenderProps, FieldValue, LayoutType} from './';

export type InputProps<
    Value extends FieldValue,
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
    SpecType extends Spec<undefined, InputComponentProps, LayoutComponentProps> = Spec,
> = {
    spec: SpecType;
    name: string;
    inputProps?: InputComponentProps;
} & FieldRenderProps<Value>;

export type IndependentInputProps<
    Value extends FieldValue,
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
    SpecType extends Spec<undefined, InputComponentProps, LayoutComponentProps> = Spec,
> = {
    Layout: LayoutType<Value, InputComponentProps, LayoutComponentProps, SpecType> | undefined;
    layoutProps?: LayoutComponentProps;
} & InputProps<Value, InputComponentProps, LayoutComponentProps, SpecType>;

export type InputType<
    Value extends FieldValue,
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
    SpecType extends Spec<undefined, InputComponentProps, LayoutComponentProps> = Spec,
> = (
    props: InputProps<Value, InputComponentProps, LayoutComponentProps, SpecType>,
) => React.ReactNode | Promise<React.ReactNode>;

export type IndependentInputType<
    Value extends FieldValue,
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
    SpecType extends Spec<undefined, InputComponentProps, LayoutComponentProps> = Spec,
> = (
    props: IndependentInputProps<Value, InputComponentProps, LayoutComponentProps, SpecType>,
) => React.ReactNode | Promise<React.ReactNode>;

export type InputEntity<
    Value extends FieldValue,
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
    SpecType extends Spec<undefined, InputComponentProps, LayoutComponentProps> = Spec,
> = {
    Component: InputType<Value, InputComponentProps, LayoutComponentProps, SpecType>;
    independent?: false;
};
export type IndependentInputEntity<
    Value extends FieldValue,
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
    SpecType extends Spec<undefined, InputComponentProps, LayoutComponentProps> = Spec,
> = {
    Component: IndependentInputType<Value, InputComponentProps, LayoutComponentProps, SpecType>;
    independent: true;
};

export type InputsMap<
    Value extends FieldValue,
    SpecType extends Spec<undefined, any, any> = Spec,
> = Record<
    string,
    | InputEntity<Value, any, any, SpecType>
    | IndependentInputEntity<Value, any, any, SpecType>
    | undefined
>;
