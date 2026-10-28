import type {BooleanSpec} from '../../../types';

import type {
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

export type BooleanViewProps = ViewProps<boolean, BooleanSpec>;
export type BooleanIndependentViewProps = IndependentViewProps<boolean, BooleanSpec>;
export type BooleanViewLayoutProps = ViewLayoutProps<boolean, BooleanSpec>;

export type BooleanView = ViewType<boolean, BooleanSpec>;
export type BooleanIndependentView = IndependentViewType<boolean, BooleanSpec>;
export type BooleanViewLayout = ViewLayoutType<boolean, BooleanSpec>;

export type BooleanViewEntity = ViewEntity<boolean, BooleanSpec>;
export type BooleanIndependentViewEntity = IndependentViewEntity<boolean, BooleanSpec>;

export type BooleanViewsMap = ViewsMap<boolean, BooleanSpec>;
export type BooleanViewLayoutsMap = ViewLayoutsMap<boolean, BooleanSpec>;

export type BooleanViewConfig = ViewTypeConfig<boolean, BooleanSpec>;
