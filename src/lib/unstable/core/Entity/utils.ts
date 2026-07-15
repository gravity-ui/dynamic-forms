import get from 'lodash/get';

import {EMPTY_OBJECT, type EntityType, SchemaRendererMode} from '../constants';
import type {Control, ControlWrapper, JsonSchema, View, ViewWrapper} from '../types';
import {smartMerge} from '../utils';

import type {GetRenderKitParams, GetRenderKitReturn} from './types';

export const getRenderKit = <Schema extends JsonSchema>({
    config,
    schema,
}: GetRenderKitParams<Schema>): GetRenderKitReturn<Schema> => {
    const entityType: EntityType | undefined = get(schema, 'entityParameters.type');

    const controlType: string | undefined = get(schema, 'entityParameters.controlType');
    const ControlComponent: Control<Schema> | undefined = get(
        config,
        `${entityType}.controls.${controlType}.Component`,
    );
    const controlProps: Record<string, any> =
        get(schema, 'entityParameters.controlProps') || EMPTY_OBJECT;
    const controlDefaultProps: Record<string, any> =
        get(config, `${entityType}.controls.${controlType}.defaultProps`) || EMPTY_OBJECT;
    const controlIndependent: boolean | undefined = get(
        config,
        `${entityType}.controls.${controlType}.independent`,
    );

    const controlWrapperType: string | undefined = get(
        schema,
        'entityParameters.controlWrapperType',
    );
    const ControlWrapperComponent: ControlWrapper<Schema> | undefined = get(
        config,
        `${entityType}.controlWrappers.${controlWrapperType}.Component`,
    );
    const controlWrapperProps: Record<string, any> =
        get(schema, 'entityParameters.controlWrapperProps') || EMPTY_OBJECT;
    const controlWrapperDefaultProps: Record<string, any> =
        get(config, `${entityType}.controlWrappers.${controlWrapperType}.defaultProps`) ||
        EMPTY_OBJECT;

    const viewType: string | undefined = get(schema, 'entityParameters.viewType');
    const ViewComponent: View<Schema> | undefined = get(
        config,
        `${entityType}.views.${viewType}.Component`,
    );
    const viewProps: Record<string, any> =
        get(schema, 'entityParameters.viewProps') || EMPTY_OBJECT;
    const viewDefaultProps: Record<string, any> =
        get(config, `${entityType}.views.${viewType}.defaultProps`) || EMPTY_OBJECT;
    const viewIndependent: boolean | undefined = get(
        config,
        `${entityType}.views.${viewType}.independent`,
    );

    const viewWrapperType: string | undefined = get(schema, 'entityParameters.viewWrapperType');
    const ViewWrapperComponent: ViewWrapper<Schema> | undefined = get(
        config,
        `${entityType}.viewWrappers.${viewWrapperType}.Component`,
    );
    const viewWrapperProps: Record<string, any> =
        get(schema, 'entityParameters.viewWrapperProps') || EMPTY_OBJECT;
    const viewWrapperDefaultProps: Record<string, any> =
        get(config, `${entityType}.viewWrappers.${viewWrapperType}.defaultProps`) || EMPTY_OBJECT;

    return {
        [SchemaRendererMode.Form]: {
            Control: ControlComponent,
            ControlWrapper: ControlWrapperComponent,
            controlProps: smartMerge(controlDefaultProps, controlProps),
            controlWrapperProps: smartMerge(controlWrapperDefaultProps, controlWrapperProps),
            independent: controlIndependent,
        },
        [SchemaRendererMode.Overview]: {
            View: ViewComponent,
            ViewWrapper: ViewWrapperComponent,
            viewProps: smartMerge(viewDefaultProps, viewProps),
            viewWrapperProps: smartMerge(viewWrapperDefaultProps, viewWrapperProps),
            independent: viewIndependent,
        },
    };
};
