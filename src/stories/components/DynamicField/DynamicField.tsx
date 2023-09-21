import React from 'react';

import _ from 'lodash';
import RandExp from 'randexp';
import MonacoEditor from 'react-monaco-editor';
import {v4 as uuidv4} from 'uuid';

import {
    DynamicField as BaseDynamicField,
    FieldValue,
    Spec,
    dynamicConfig,
    prepareSpec,
} from '../../../lib';
import {SpecSelector} from '../InputPreview/SpecSelector';

export interface DynamicFieldProps {
    name: string;
    spec: Spec;
    search?: string | ((spec: Spec, input: FieldValue, name: string) => boolean);
    parseJsonDefaultValue?: boolean;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({
    name,
    spec,
    search,
    parseJsonDefaultValue = true,
}) => {
    const config = React.useMemo(() => {
        const cfg = _.cloneDeep(dynamicConfig);

        cfg.object.inputs['spec_selector'] = {Component: SpecSelector, independent: true};

        return cfg;
    }, []);

    const generateRandomValue = React.useCallback(
        ({regexp, onChange}: {regexp?: string; onChange: (value: string) => void}) => {
            if (regexp) {
                const randExp = new RandExp(regexp);
                onChange(randExp.gen());
            } else {
                onChange(uuidv4());
            }
        },
        [],
    );

    return (
        <BaseDynamicField
            name={name}
            spec={prepareSpec(spec, parseJsonDefaultValue)}
            config={config}
            Monaco={MonacoEditor}
            search={search}
            generateRandomValue={generateRandomValue}
        />
    );
};
