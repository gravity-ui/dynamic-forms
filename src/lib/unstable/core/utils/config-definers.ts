import type {Control, ControlWrapper, JsonSchema, View, ViewWrapper} from '../types';
import type {
    ExtractControlProps,
    ExtractControlWrapperProps,
    ExtractViewProps,
    ExtractViewWrapperProps,
} from '../types/helpers';

export const defineControl = <Component extends Control<JsonSchema, any, any>>(controlConfig: {
    Component: Component;
    independent?: boolean;
    defaultProps?: Partial<ExtractControlProps<{Component: Component}>>;
}) => controlConfig;

export const defineControlWrapper = <
    Component extends ControlWrapper<JsonSchema, any>,
>(controlWrapperConfig: {
    Component: Component;
    defaultProps?: Partial<ExtractControlWrapperProps<{Component: Component}>>;
}) => controlWrapperConfig;

export const defineView = <Component extends View<JsonSchema, any, any>>(viewConfig: {
    Component: Component;
    independent?: boolean;
    defaultProps?: Partial<ExtractViewProps<{Component: Component}>>;
}) => viewConfig;

export const defineViewWrapper = <
    Component extends ViewWrapper<JsonSchema, any>,
>(viewWrapperConfig: {
    Component: Component;
    defaultProps?: Partial<ExtractViewWrapperProps<{Component: Component}>>;
}) => viewWrapperConfig;
