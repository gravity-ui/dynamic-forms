import type React from 'react';

import type {FormValue, Spec} from '../../../';

import type {ViewLayoutType} from './';

export type ViewProps<
    Value extends FormValue,
    SpecType extends Spec<undefined, undefined, Record<string, any> | undefined> = Spec,
> = {
    spec: SpecType;
    name: string;
    value?: Value;
    linkValue?: React.ReactElement;
};

export type IndependentViewProps<Value extends FormValue, SpecType extends Spec> = {
    Layout: ViewLayoutType<Value, SpecType> | undefined;
} & ViewProps<Value, SpecType>;

export type ViewType<Value extends FormValue, SpecType extends Spec> = (
    props: ViewProps<Value, SpecType>,
) => React.ReactNode | Promise<React.ReactNode>;

export type IndependentViewType<Value extends FormValue, SpecType extends Spec> = (
    props: IndependentViewProps<Value, SpecType>,
) => React.ReactNode | Promise<React.ReactNode>;

export type ViewEntity<Value extends FormValue, SpecType extends Spec> = {
    Component: ViewType<Value, SpecType>;
    independent?: false;
};
export type IndependentViewEntity<Value extends FormValue, SpecType extends Spec> = {
    Component: IndependentViewType<Value, SpecType>;
    independent: true;
};

export type ViewsMap<Value extends FormValue, SpecType extends Spec> = Record<
    string,
    ViewEntity<Value, SpecType> | IndependentViewEntity<Value, SpecType> | undefined
>;
