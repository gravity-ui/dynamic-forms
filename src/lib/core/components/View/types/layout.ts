import React from 'react';

import {FormValue, Spec} from '../../../';

import {ViewProps} from './';

export type ViewLayoutProps<Value extends FormValue, SpecType extends Spec> = {
    children: React.ReactElement;
} & ViewProps<Value, SpecType>;

export type ViewLayoutType<Value extends FormValue, SpecType extends Spec> = (
    props: ViewLayoutProps<Value, SpecType>,
) => React.ReactElement | null;

export type ViewLayoutsMap<Value extends FormValue, SpecType extends Spec> = Record<
    string,
    ViewLayoutType<Value, SpecType> | undefined
>;
