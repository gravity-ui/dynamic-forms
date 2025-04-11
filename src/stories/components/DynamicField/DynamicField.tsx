import React from 'react';

import cloneDeep from 'lodash/cloneDeep';
import RandExp from 'randexp';
import MonacoEditor from 'react-monaco-editor';
import {v4 as uuidv4} from 'uuid';

import type {FieldValue, Spec, StringSpec} from '../../../lib';
import {DynamicField as BaseDynamicField, dynamicConfig, prepareSpec} from '../../../lib';
import {SpecSelector} from '../InputPreview/SpecSelector';

const RenderHtmlAsync = React.lazy(() => import('../RenderHtml'));

const renderHtml = (text: string) => (
    <React.Suspense fallback={<div>Loading...</div>}>
        <RenderHtmlAsync text={text} />
    </React.Suspense>
);

export interface DynamicFieldProps {
    name: string;
    spec: Spec;
    search?: string | ((spec: Spec, input: FieldValue, name: string) => boolean);
    parseJsonDefaultValue?: boolean;
    withCustomRenderHtml?: boolean;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({
    name,
    spec,
    search,
    parseJsonDefaultValue = true,
    withCustomRenderHtml,
}) => {
    const config = React.useMemo(() => {
        const cfg = cloneDeep(dynamicConfig);

        cfg.object.inputs['spec_selector'] = {Component: SpecSelector, independent: true};

        return cfg;
    }, []);

    const generateRandomValue = React.useCallback((spec: StringSpec) => {
        if (spec.pattern) {
            const randomValue = new RandExp(spec.pattern);
            return randomValue.gen();
        } else {
            return uuidv4();
        }
    }, []);

    return (
        <BaseDynamicField
            name={name}
            spec={prepareSpec(spec, parseJsonDefaultValue)}
            config={config}
            Monaco={MonacoEditor}
            search={search}
            generateRandomValue={generateRandomValue}
            renderHtml={withCustomRenderHtml ? renderHtml : undefined}
        />
    );
};
