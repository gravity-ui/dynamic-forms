import type {NumberSpec} from '../../../types';

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
export type NumberViewProps = ViewProps<number, NumberSpec>;
/** @deprecated Use the SchemaRenderer API. */
export type NumberIndependentViewProps = IndependentViewProps<number, NumberSpec>;
/** @deprecated Use the SchemaRenderer API. */
export type NumberViewLayoutProps = ViewLayoutProps<number, NumberSpec>;

/** @deprecated Use the SchemaRenderer API. */
export type NumberView = ViewType<number, NumberSpec>;
/** @deprecated Use the SchemaRenderer API. */
export type NumberIndependentView = IndependentViewType<number, NumberSpec>;
/** @deprecated Use the SchemaRenderer API. */
export type NumberViewLayout = ViewLayoutType<number, NumberSpec>;

/** @deprecated Use the SchemaRenderer API. */
export type NumberViewEntity = ViewEntity<number, NumberSpec>;
/** @deprecated Use the SchemaRenderer API. */
export type NumberIndependentViewEntity = IndependentViewEntity<number, NumberSpec>;

/** @deprecated Use the SchemaRenderer API. */
export type NumberViewsMap = ViewsMap<number, NumberSpec>;
/** @deprecated Use the SchemaRenderer API. */
export type NumberViewLayoutsMap = ViewLayoutsMap<number, NumberSpec>;

/** @deprecated Use the SchemaRenderer API. */
export type NumberViewConfig = ViewTypeConfig<number, NumberSpec>;
