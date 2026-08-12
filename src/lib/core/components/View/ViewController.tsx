import React from 'react';

import type {FormValue, Spec} from '../../types';

import {useComponents, useDynamicFormsCtx, useRender} from './hooks';

export interface ViewControllerProps<SpecType extends Spec> {
    spec: SpecType;
    name: string;
    resolvedValue?: FormValue;
}

export const ViewController = <SpecType extends Spec>(props: ViewControllerProps<SpecType>) => {
    const {spec, name} = props;
    const {config, value: contextValue, Link} = useDynamicFormsCtx();
    const {viewEntity, Layout} = useComponents(spec, config);
    const resolved = 'resolvedValue' in props;
    const render = useRender({
        name,
        value: resolved ? props.resolvedValue : contextValue,
        resolved,
        spec,
        viewEntity,
        Layout,
        Link,
    });

    return <React.Fragment>{render}</React.Fragment>;
};
