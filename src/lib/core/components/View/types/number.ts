import {NumberSpec} from '../../../types';

import {
    IndependentViewEntity,
    IndependentViewProps,
    IndependentViewType,
    ViewEntity,
    ViewLayoutProps,
    ViewLayoutType,
    ViewLayoutsMap,
    ViewProps,
    ViewType,
    ViewTypeConfig,
    ViewsMap,
} from './';

export type NumberViewProps = ViewProps<number, NumberSpec>;
export type NumberIndependentViewProps = IndependentViewProps<number, NumberSpec>;
export type NumberViewLayoutProps = ViewLayoutProps<number, NumberSpec>;

export type NumberView = ViewType<number, NumberSpec>;
export type NumberIndependentView = IndependentViewType<number, NumberSpec>;
export type NumberViewLayout = ViewLayoutType<number, NumberSpec>;

export type NumberViewEntity = ViewEntity<number, NumberSpec>;
export type NumberIndependentViewEntity = IndependentViewEntity<number, NumberSpec>;

export type NumberViewsMap = ViewsMap<number, NumberSpec>;
export type NumberViewLayoutsMap = ViewLayoutsMap<number, NumberSpec>;

export type NumberViewConfig = ViewTypeConfig<number, NumberSpec>;
