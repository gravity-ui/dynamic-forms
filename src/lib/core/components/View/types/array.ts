import {ArraySpec, ArrayValue} from '../../../types';

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

export type ArrayViewProps = ViewProps<ArrayValue, ArraySpec>;
export type ArrayIndependentViewProps = IndependentViewProps<ArrayValue, ArraySpec>;
export type ArrayViewLayoutProps = ViewLayoutProps<ArrayValue, ArraySpec>;

export type ArrayView = ViewType<ArrayValue, ArraySpec>;
export type ArrayIndependentView = IndependentViewType<ArrayValue, ArraySpec>;
export type ArrayViewLayout = ViewLayoutType<ArrayValue, ArraySpec>;

export type ArrayViewEntity = ViewEntity<ArrayValue, ArraySpec>;
export type ArrayIndependentViewEntity = IndependentViewEntity<ArrayValue, ArraySpec>;

export type ArrayViewsMap = ViewsMap<ArrayValue, ArraySpec>;
export type ArrayViewLayoutsMap = ViewLayoutsMap<ArrayValue, ArraySpec>;

export type ArrayViewConfig = ViewTypeConfig<ArrayValue, ArraySpec>;
