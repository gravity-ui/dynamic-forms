import type React from 'react';

import type {FormValue, Spec} from '../../..';

import type {ViewLayoutType} from '.';

/** @deprecated Use the SchemaRenderer API. */
export type ViewProps<
    Value extends FormValue,
    SpecType extends Spec<undefined, undefined, Record<string, any> | undefined> = Spec,
> = {
    spec: SpecType;
    name: string;
    value?: Value;
    linkValue?: React.ReactElement;
};

/** @deprecated Use the SchemaRenderer API. */
export type IndependentViewProps<Value extends FormValue, SpecType extends Spec> = {
    Layout: ViewLayoutType<Value, SpecType> | undefined;
} & ViewProps<Value, SpecType>;

/** @deprecated Use the SchemaRenderer API. */
export type ViewType<Value extends FormValue, SpecType extends Spec> = (
    props: ViewProps<Value, SpecType>,
) => React.ReactNode | Promise<React.ReactNode>;

/** @deprecated Use the SchemaRenderer API. */
export type IndependentViewType<Value extends FormValue, SpecType extends Spec> = (
    props: IndependentViewProps<Value, SpecType>,
) => React.ReactNode | Promise<React.ReactNode>;

/** @deprecated Use the SchemaRenderer API. */
export type ViewEntity<Value extends FormValue, SpecType extends Spec> = {
    Component: ViewType<Value, SpecType>;
    independent?: false;
};
/** @deprecated Use the SchemaRenderer API. */
export type IndependentViewEntity<Value extends FormValue, SpecType extends Spec> = {
    Component: IndependentViewType<Value, SpecType>;
    independent: true;
};

/** @deprecated Use the SchemaRenderer API. */
export type ViewsMap<Value extends FormValue, SpecType extends Spec> = Record<
    string,
    ViewEntity<Value, SpecType> | IndependentViewEntity<Value, SpecType> | undefined
>;
