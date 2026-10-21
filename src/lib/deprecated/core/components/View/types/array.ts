import type {ArraySpec, ArrayValue} from '../../../types';

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
export type ArrayViewProps = ViewProps<ArrayValue, ArraySpec>;
/** @deprecated Use the SchemaRenderer API. */
export type ArrayIndependentViewProps = IndependentViewProps<ArrayValue, ArraySpec>;
/** @deprecated Use the SchemaRenderer API. */
export type ArrayViewLayoutProps = ViewLayoutProps<ArrayValue, ArraySpec>;

/** @deprecated Use the SchemaRenderer API. */
export type ArrayView = ViewType<ArrayValue, ArraySpec>;
/** @deprecated Use the SchemaRenderer API. */
export type ArrayIndependentView = IndependentViewType<ArrayValue, ArraySpec>;
/** @deprecated Use the SchemaRenderer API. */
export type ArrayViewLayout = ViewLayoutType<ArrayValue, ArraySpec>;

/** @deprecated Use the SchemaRenderer API. */
export type ArrayViewEntity = ViewEntity<ArrayValue, ArraySpec>;
/** @deprecated Use the SchemaRenderer API. */
export type ArrayIndependentViewEntity = IndependentViewEntity<ArrayValue, ArraySpec>;

/** @deprecated Use the SchemaRenderer API. */
export type ArrayViewsMap = ViewsMap<ArrayValue, ArraySpec>;
/** @deprecated Use the SchemaRenderer API. */
export type ArrayViewLayoutsMap = ViewLayoutsMap<ArrayValue, ArraySpec>;

/** @deprecated Use the SchemaRenderer API. */
export type ArrayViewConfig = ViewTypeConfig<ArrayValue, ArraySpec>;
