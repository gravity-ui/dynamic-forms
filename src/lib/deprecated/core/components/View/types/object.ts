import type {ObjectSpec, ObjectValue} from '../../../types';

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
export type ObjectViewProps = ViewProps<ObjectValue, ObjectSpec>;
/** @deprecated Use the SchemaRenderer API. */
export type ObjectIndependentViewProps = IndependentViewProps<ObjectValue, ObjectSpec>;
/** @deprecated Use the SchemaRenderer API. */
export type ObjectViewLayoutProps = ViewLayoutProps<ObjectValue, ObjectSpec>;

/** @deprecated Use the SchemaRenderer API. */
export type ObjectView = ViewType<ObjectValue, ObjectSpec>;
/** @deprecated Use the SchemaRenderer API. */
export type ObjectIndependentView = IndependentViewType<ObjectValue, ObjectSpec>;
/** @deprecated Use the SchemaRenderer API. */
export type ObjectViewLayout = ViewLayoutType<ObjectValue, ObjectSpec>;

/** @deprecated Use the SchemaRenderer API. */
export type ObjectViewEntity = ViewEntity<ObjectValue, ObjectSpec>;
/** @deprecated Use the SchemaRenderer API. */
export type ObjectIndependentViewEntity = IndependentViewEntity<ObjectValue, ObjectSpec>;

/** @deprecated Use the SchemaRenderer API. */
export type ObjectViewsMap = ViewsMap<ObjectValue, ObjectSpec>;
/** @deprecated Use the SchemaRenderer API. */
export type ObjectViewLayoutsMap = ViewLayoutsMap<ObjectValue, ObjectSpec>;

/** @deprecated Use the SchemaRenderer API. */
export type ObjectViewConfig = ViewTypeConfig<ObjectValue, ObjectSpec>;
