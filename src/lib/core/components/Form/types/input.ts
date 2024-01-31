import React from 'react';

import {Spec} from '../../../types';

import {FieldRenderProps, FieldValue, LayoutType} from './';

export type InputProps<Value extends FieldValue, SpecType extends Spec> = {
    spec: SpecType;
    name: string;
    inputProps?: SpecType['viewSpec']['inputProps'];
} & FieldRenderProps<Value>;

export type IndependentInputProps<Value extends FieldValue, SpecType extends Spec> = {
    Layout: LayoutType<Value, SpecType> | undefined;
} & InputProps<Value, SpecType>;

export type InputType<Value extends FieldValue, SpecType extends Spec> = (
    props: InputProps<Value, SpecType>,
) => React.ReactElement | null;

export type IndependentInputType<Value extends FieldValue, SpecType extends Spec> = (
    props: IndependentInputProps<Value, SpecType>,
) => React.ReactElement | null;

export type InputEntity<Value extends FieldValue, SpecType extends Spec> = {
    Component: InputType<Value, SpecType>;
    independent?: false;
};
export type IndependentInputEntity<Value extends FieldValue, SpecType extends Spec> = {
    Component: IndependentInputType<Value, SpecType>;
    independent: true;
};

export type InputsMap<Value extends FieldValue, SpecType extends Spec> = Record<
    string,
    InputEntity<Value, SpecType> | IndependentInputEntity<Value, SpecType> | undefined
>;
