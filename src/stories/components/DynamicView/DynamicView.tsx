import React from 'react';

import MonacoEditor from 'react-monaco-editor';

import type {FormValue, Spec} from '../../../lib';
import {DynamicView as BaseDynamicView, dynamicViewConfig, prepareSpec} from '../../../lib';

import {DynLink} from './DynLink';

const RenderHtmlAsync = React.lazy(() => import('../Editor/RenderHtml'));

const renderHtml = (text: string) => (
    <React.Suspense fallback={<div>Loading...</div>}>
        <RenderHtmlAsync text={text} />
    </React.Suspense>
);

export interface DynamicViewProps {
    value: FormValue;
    spec: Spec;
    showLayoutDescription?: boolean;
    withCustomRenderHtml?: boolean;
}

export const DynamicView: React.FC<DynamicViewProps> = ({
    value,
    spec,
    showLayoutDescription,
    withCustomRenderHtml,
}) => {
    return (
        <BaseDynamicView
            value={value}
            spec={prepareSpec(spec)}
            config={dynamicViewConfig}
            Monaco={MonacoEditor}
            Link={DynLink}
            showLayoutDescription={showLayoutDescription}
            renderHtml={withCustomRenderHtml ? renderHtml : undefined}
        />
    );
};
