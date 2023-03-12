import {ObjectSpec, ObjectValue} from '../../../types';

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

export type ObjectViewProps = ViewProps<ObjectValue, ObjectSpec>;
export type ObjectIndependentViewProps = IndependentViewProps<ObjectValue, ObjectSpec>;
export type ObjectViewLayoutProps = ViewLayoutProps<ObjectValue, ObjectSpec>;

export type ObjectView = ViewType<ObjectValue, ObjectSpec>;
export type ObjectIndependentView = IndependentViewType<ObjectValue, ObjectSpec>;
export type ObjectViewLayout = ViewLayoutType<ObjectValue, ObjectSpec>;

export type ObjectViewEntity = ViewEntity<ObjectValue, ObjectSpec>;
export type ObjectIndependentViewEntity = IndependentViewEntity<ObjectValue, ObjectSpec>;

export type ObjectViewsMap = ViewsMap<ObjectValue, ObjectSpec>;
export type ObjectViewLayoutsMap = ViewLayoutsMap<ObjectValue, ObjectSpec>;

export type ObjectViewConfig = ViewTypeConfig<ObjectValue, ObjectSpec>;
