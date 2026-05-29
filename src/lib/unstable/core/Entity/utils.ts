import get from 'lodash/get';

import {EMPTY_OBJECT, type JsonSchemaType, SchemaRendererMode} from '../constants';
import type {Control, JsonSchema, View, Wrapper} from '../types';
import {getSchemaType} from '../utils';

import type {GetRenderKitParams, GetRenderKitReturn} from './types';

export const getRenderKit = <Schema extends JsonSchema>({
    config,
    schema,
}: GetRenderKitParams<Schema>): GetRenderKitReturn<Schema> => {
    const schemaType: JsonSchemaType = getSchemaType(schema);

    const controlType: string | undefined = get(schema, 'entityParameters.controlType');
    const ControlComponent: Control<Schema> | undefined = get(
        config,
        `${schemaType}.controls.${controlType}.Component`,
    );
    const controlProps: Record<string, any> =
        get(schema, 'entityParameters.controlProps') || EMPTY_OBJECT;
    const controlIndependent: boolean | undefined = get(
        config,
        `${schemaType}.controls.${controlType}.independent`,
    );

    const controlWrapperType: string | undefined = get(
        schema,
        'entityParameters.controlWrapperType',
    );
    const ControlWrapperComponent: Wrapper<Schema> | undefined = get(
        config,
        `${schemaType}.wrappers.${controlWrapperType}`,
    );
    const controlWrapperProps: Record<string, any> =
        get(schema, 'entityParameters.controlWrapperProps') || EMPTY_OBJECT;

    const viewType: string | undefined = get(schema, 'entityParameters.viewType');
    const ViewComponent: View<Schema> | undefined = get(config, `${schemaType}.views.${viewType}`);
    const viewProps: Record<string, any> =
        get(schema, 'entityParameters.viewProps') || EMPTY_OBJECT;
    const viewIndependent: boolean | undefined = get(
        config,
        `${schemaType}.views.${viewType}.independent`,
    );

    const viewWrapperType: string | undefined = get(schema, 'entityParameters.viewWrapperType');
    const ViewWrapperComponent: Wrapper<Schema> | undefined = get(
        config,
        `${schemaType}.wrappers.${viewWrapperType}`,
    );
    const viewWrapperProps: Record<string, any> =
        get(schema, 'entityParameters.viewWrapperProps') || EMPTY_OBJECT;

    return {
        [SchemaRendererMode.Form]: {
            Component: ControlComponent,
            props: controlProps,
            independent: controlIndependent,
            Wrapper: ControlWrapperComponent,
            wrapperProps: controlWrapperProps,
        },
        [SchemaRendererMode.Overview]: {
            Component: ViewComponent,
            props: viewProps,
            independent: viewIndependent,
            Wrapper: ViewWrapperComponent,
            wrapperProps: viewWrapperProps,
        },
    };
};
