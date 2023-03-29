import React from 'react';

import MonacoEditor from 'react-monaco-editor';

import {
    AnyObject,
    DynamicView as BaseDynamicView,
    FormValue,
    Spec,
    dynamicViewConfig,
    prepareSpec,
} from '../../../lib';

interface DynLinkProps {
    value: FormValue;
    link: string;
}

const DynLink: React.FC<DynLinkProps> = ({value, link}) => (
    <a
        href={link}
        onClick={(e) => {
            alert(`Link clicked, your text: ${value}`);
            e.preventDefault();
        }}
    >
        {String(value)}
    </a>
);

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
