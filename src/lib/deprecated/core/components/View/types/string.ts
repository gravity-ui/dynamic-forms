import type {StringSpec} from '../../../types';

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
export type StringViewProps = ViewProps<string, StringSpec>;
/** @deprecated Use the SchemaRenderer API. */
export type StringIndependentViewProps = IndependentViewProps<string, StringSpec>;
/** @deprecated Use the SchemaRenderer API. */
export type StringViewLayoutProps = ViewLayoutProps<string, StringSpec>;

/** @deprecated Use the SchemaRenderer API. */
export type StringView = ViewType<string, StringSpec>;
/** @deprecated Use the SchemaRenderer API. */
export type StringIndependentView = IndependentViewType<string, StringSpec>;
/** @deprecated Use the SchemaRenderer API. */
export type StringViewLayout = ViewLayoutType<string, StringSpec>;

/** @deprecated Use the SchemaRenderer API. */
export type StringViewEntity = ViewEntity<string, StringSpec>;
/** @deprecated Use the SchemaRenderer API. */
export type StringIndependentViewEntity = IndependentViewEntity<string, StringSpec>;

/** @deprecated Use the SchemaRenderer API. */
export type StringViewsMap = ViewsMap<string, StringSpec>;
/** @deprecated Use the SchemaRenderer API. */
export type StringViewLayoutsMap = ViewLayoutsMap<string, StringSpec>;

/** @deprecated Use the SchemaRenderer API. */
export type StringViewConfig = ViewTypeConfig<string, StringSpec>;
