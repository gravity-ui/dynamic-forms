import React from 'react';

import _ from 'lodash';
import MonacoEditor from 'react-monaco-editor';

import {DynamicField as BaseDynamicField, Spec, dynamicConfig, prepareSpec} from '../../../lib';
import {SpecSelector} from '../InputPreview/SpecSelector';

export interface DynamicFieldProps {
    name: string;
    spec: Spec;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({name, spec}) => {
    const config = React.useMemo(() => {
        const cfg = _.cloneDeep(dynamicConfig);

        cfg.object.inputs['spec_selector'] = {Component: SpecSelector, independent: true};

        return cfg;
    }, []);

    return (
        <BaseDynamicField
            name={name}
            spec={prepareSpec(spec, true)}
            config={config}
            Monaco={MonacoEditor}
        />
    );
};
