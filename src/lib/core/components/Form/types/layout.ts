import React from 'react';

import {Spec} from '../../../types';

import {FieldValue, InputProps} from './';

export type LayoutProps<
    Value extends FieldValue,
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
    SpecType extends Spec<undefined, InputComponentProps, LayoutComponentProps> = Spec,
> = {
    children: React.ReactElement;
    layoutProps?: LayoutComponentProps;
} & Omit<InputProps<Value, InputComponentProps, LayoutComponentProps, SpecType>, 'inputProps'>;

export type LayoutType<
    Value extends FieldValue,
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
    SpecType extends Spec<undefined, InputComponentProps, LayoutComponentProps> = Spec,
> = (
    props: LayoutProps<Value, InputComponentProps, LayoutComponentProps, SpecType>,
) => React.ReactElement | null;

export type LayoutsMap<
    Value extends FieldValue,
    SpecType extends Spec<undefined, any, any> = Spec,
> = Record<string, LayoutType<Value, any, any, SpecType> | undefined>;
