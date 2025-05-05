import get from 'lodash/get';

import {EMPTY_OBJECT} from '../constants';
import type {JsonSchema, View, Wrapper} from '../types';

import type {GetRenderKitParams, GetRenderKitReturn} from './types';

export const getRenderKit = <Schema extends JsonSchema>({
    config,
    mode,
    schema,
}: GetRenderKitParams<Schema>): GetRenderKitReturn<Schema> => {
    const viewType: string | undefined = get(schema, 'entityParameters.viewType');
    const ViewComponent: View<Schema> | undefined = get(
        config,
        `${schema.type}.views.${viewType}.${mode}.Component`,
    );
    const viewProps = get(schema, 'entityParameters.viewProps', EMPTY_OBJECT);
    const independent: boolean | undefined = get(
        config,
        `${schema.type}.views.${viewType}.${mode}.independent`,
    );

    const wrapperType: string | undefined = get(schema, 'entityParameters.wrapperType');
    const WrapperComponent: Wrapper<Schema> | undefined = get(
        config,
        `${schema.type}.wrappers.${wrapperType}`,
    );
    const wrapperProps = get(schema, 'entityParameters.wrapperProps', EMPTY_OBJECT);

    return {
        View: ViewComponent,
        viewProps,
        Wrapper: WrapperComponent,
        wrapperProps,
        independent,
    };
};
