import type React from 'react';

import type {Spec} from '../../../types';

import type {FieldRenderProps, FieldValue, LayoutType} from '.';

/** @deprecated Use the SchemaRenderer API. */
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

/** @deprecated Use the SchemaRenderer API. */
export type IndependentInputProps<
    Value extends FieldValue,
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
    SpecType extends Spec<undefined, InputComponentProps, LayoutComponentProps> = Spec,
> = {
    Layout: LayoutType<Value, InputComponentProps, LayoutComponentProps, SpecType> | undefined;
    layoutProps?: LayoutComponentProps;
} & InputProps<Value, InputComponentProps, LayoutComponentProps, SpecType>;

/** @deprecated Use the SchemaRenderer API. */
export type InputType<
    Value extends FieldValue,
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
    SpecType extends Spec<undefined, InputComponentProps, LayoutComponentProps> = Spec,
> = (
    props: InputProps<Value, InputComponentProps, LayoutComponentProps, SpecType>,
) => React.ReactNode | Promise<React.ReactNode>;

/** @deprecated Use the SchemaRenderer API. */
export type IndependentInputType<
    Value extends FieldValue,
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
    SpecType extends Spec<undefined, InputComponentProps, LayoutComponentProps> = Spec,
> = (
    props: IndependentInputProps<Value, InputComponentProps, LayoutComponentProps, SpecType>,
) => React.ReactNode | Promise<React.ReactNode>;

/** @deprecated Use the SchemaRenderer API. */
export type InputEntity<
    Value extends FieldValue,
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
    SpecType extends Spec<undefined, InputComponentProps, LayoutComponentProps> = Spec,
> = {
    Component: InputType<Value, InputComponentProps, LayoutComponentProps, SpecType>;
    independent?: false;
};
/** @deprecated Use the SchemaRenderer API. */
export type IndependentInputEntity<
    Value extends FieldValue,
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
    SpecType extends Spec<undefined, InputComponentProps, LayoutComponentProps> = Spec,
> = {
    Component: IndependentInputType<Value, InputComponentProps, LayoutComponentProps, SpecType>;
    independent: true;
};

/** @deprecated Use the SchemaRenderer API. */
export type InputsMap<
    Value extends FieldValue,
    SpecType extends Spec<undefined, any, any> = Spec,
> = Record<
    string,
    | InputEntity<Value, any, any, SpecType>
    | IndependentInputEntity<Value, any, any, SpecType>
    | undefined
>;
