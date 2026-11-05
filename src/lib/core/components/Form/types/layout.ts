import type React from 'react';

import type {Spec} from '../../../types';

import type {FieldValue, InputProps} from './';

export type LayoutProps<
    Value extends FieldValue,
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
    SpecType extends Spec<undefined, InputComponentProps, LayoutComponentProps> = Spec,
> = {
    children: React.ReactNode;
    layoutProps?: LayoutComponentProps;
} & Omit<InputProps<Value, InputComponentProps, LayoutComponentProps, SpecType>, 'inputProps'>;

export type LayoutType<
    Value extends FieldValue,
    InputComponentProps extends Record<string, any> | undefined = undefined,
    LayoutComponentProps extends Record<string, any> | undefined = undefined,
    SpecType extends Spec<undefined, InputComponentProps, LayoutComponentProps> = Spec,
> = React.FC<LayoutProps<Value, InputComponentProps, LayoutComponentProps, SpecType>>;

export type LayoutsMap<
    Value extends FieldValue,
    SpecType extends Spec<undefined, any, any> = Spec,
> = Record<string, LayoutType<Value, any, any, SpecType> | undefined>;
