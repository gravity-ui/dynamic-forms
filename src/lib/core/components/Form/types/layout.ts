import React from 'react';

import {Spec} from '../../../types';

import {FieldValue, InputProps} from './';

export type LayoutProps<Value extends FieldValue, SpecType extends Spec> = {
    children: React.ReactElement;
    layoutProps?: SpecType['viewSpec']['layoutProps'];
} & InputProps<Value, SpecType>;

export type LayoutType<Value extends FieldValue, SpecType extends Spec> = (
    props: LayoutProps<Value, SpecType>,
) => React.ReactElement | null;

export type LayoutsMap<Value extends FieldValue, SpecType extends Spec> = Record<
    string,
    LayoutType<Value, SpecType> | undefined
>;
