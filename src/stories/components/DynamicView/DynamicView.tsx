import React from 'react';

import MonacoEditor from 'react-monaco-editor';

import {
    DynamicView as BaseDynamicView,
    FormValue,
    Spec,
    dynamicViewConfig,
    prepareSpec,
} from '../../../lib';

import {DynLink} from './DynLink';

export interface DynamicViewProps {
    value: FormValue;
    spec: Spec;
    showLayoutDescription?: boolean;
}

export const DynamicView: React.FC<DynamicViewProps> = ({value, spec, showLayoutDescription}) => (
    <BaseDynamicView
        value={value}
        spec={prepareSpec(spec)}
        config={dynamicViewConfig}
        Monaco={MonacoEditor}
        Link={DynLink}
        showLayoutDescription={showLayoutDescription}
    />
);
