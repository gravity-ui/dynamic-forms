import type React from 'react';

import type {FormValue, Spec} from '../../../';

import type {ViewProps} from './';

export type ViewLayoutProps<
    Value extends FormValue,
    SpecType extends Spec<undefined, undefined, Record<string, any> | undefined> = Spec,
> = {
    children: React.ReactNode;
} & ViewProps<Value, SpecType>;

export type ViewLayoutType<Value extends FormValue, SpecType extends Spec> = (
    props: ViewLayoutProps<Value, SpecType>,
) => React.ReactNode | Promise<React.ReactNode>;

export type ViewLayoutsMap<Value extends FormValue, SpecType extends Spec> = Record<
    string,
    ViewLayoutType<Value, SpecType> | undefined
>;
