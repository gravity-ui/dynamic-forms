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
} from './';

export type StringViewProps = ViewProps<string, StringSpec>;
export type StringIndependentViewProps = IndependentViewProps<string, StringSpec>;
export type StringViewLayoutProps = ViewLayoutProps<string, StringSpec>;

export type StringView = ViewType<string, StringSpec>;
export type StringIndependentView = IndependentViewType<string, StringSpec>;
export type StringViewLayout = ViewLayoutType<string, StringSpec>;

export type StringViewEntity = ViewEntity<string, StringSpec>;
export type StringIndependentViewEntity = IndependentViewEntity<string, StringSpec>;

export type StringViewsMap = ViewsMap<string, StringSpec>;
export type StringViewLayoutsMap = ViewLayoutsMap<string, StringSpec>;

export type StringViewConfig = ViewTypeConfig<string, StringSpec>;
