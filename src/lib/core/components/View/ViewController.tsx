import React from 'react';

import type {Spec} from '../../types';

import {useComponents, useDynamicFormsCtx, useRender} from './hooks';

export interface ViewControllerProps<SpecType extends Spec> {
    spec: SpecType;
    name: string;
}

export const ViewController = <SpecType extends Spec>({
    spec,
    name,
}: ViewControllerProps<SpecType>) => {
    const {config, value, Link} = useDynamicFormsCtx();
    const {viewEntity, Layout} = useComponents(spec, config);
    const render = useRender({name, value, spec, viewEntity, Layout, Link});

    return <React.Fragment>{render}</React.Fragment>;
};
