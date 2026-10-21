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
} from '.';

/** @deprecated Use the SchemaRenderer API. */
export type BooleanViewProps = ViewProps<boolean, BooleanSpec>;
/** @deprecated Use the SchemaRenderer API. */
export type BooleanIndependentViewProps = IndependentViewProps<boolean, BooleanSpec>;
/** @deprecated Use the SchemaRenderer API. */
export type BooleanViewLayoutProps = ViewLayoutProps<boolean, BooleanSpec>;

/** @deprecated Use the SchemaRenderer API. */
export type BooleanView = ViewType<boolean, BooleanSpec>;
/** @deprecated Use the SchemaRenderer API. */
export type BooleanIndependentView = IndependentViewType<boolean, BooleanSpec>;
/** @deprecated Use the SchemaRenderer API. */
export type BooleanViewLayout = ViewLayoutType<boolean, BooleanSpec>;

/** @deprecated Use the SchemaRenderer API. */
export type BooleanViewEntity = ViewEntity<boolean, BooleanSpec>;
/** @deprecated Use the SchemaRenderer API. */
export type BooleanIndependentViewEntity = IndependentViewEntity<boolean, BooleanSpec>;

/** @deprecated Use the SchemaRenderer API. */
export type BooleanViewsMap = ViewsMap<boolean, BooleanSpec>;
/** @deprecated Use the SchemaRenderer API. */
export type BooleanViewLayoutsMap = ViewLayoutsMap<boolean, BooleanSpec>;

/** @deprecated Use the SchemaRenderer API. */
export type BooleanViewConfig = ViewTypeConfig<boolean, BooleanSpec>;
