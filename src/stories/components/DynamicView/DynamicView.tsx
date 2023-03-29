import React from 'react';

import MonacoEditor from 'react-monaco-editor';

import {
    AnyObject,
    DynamicView as BaseDynamicView,
    Spec,
    dynamicViewConfig,
    prepareSpec,
} from '../../../lib';

import {DynLink} from './DynLink';

export interface DynamicViewProps {
    value: AnyObject;
    spec: Spec;
}

export const DynamicView: React.FC<DynamicViewProps> = ({value, spec}) => (
    <BaseDynamicView
        value={value}
        spec={prepareSpec(spec)}
        config={dynamicViewConfig}
        Monaco={MonacoEditor}
        Link={DynLink}
    />
);
