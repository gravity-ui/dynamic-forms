import React from 'react';

import {isValidElementType} from 'react-is';
import type {MonacoEditorProps} from 'react-monaco-editor/lib/types';

import {isCorrectSpec} from '../../helpers';
import {FormValue, Spec} from '../../types';

import {ViewController} from './ViewController';
import {isCorrectViewConfig} from './helpers';
import {useCreateContext} from './hooks';
import {DynamicViewConfig} from './types';

export interface DynamicViewProps {
    value: FormValue;
    spec: Spec;
    config: DynamicViewConfig;
    Link?: React.ComponentType<{
        value: FormValue;
        link: Spec['viewSpec']['link'];
    }>;
    Monaco?: React.ComponentType<MonacoEditorProps>;
}

export const DynamicView = ({value, spec, config, Link, Monaco}: DynamicViewProps) => {
    const DynamicFormsCtx = useCreateContext();

    const context = React.useMemo(
        () => ({config, value, Link, Monaco: isValidElementType(Monaco) ? Monaco : undefined}),
        [config, value, Link, Monaco],
    );

    if (isCorrectSpec(spec) && isCorrectViewConfig(config)) {
        return (
            <DynamicFormsCtx.Provider value={context}>
                <ViewController spec={spec} name="" />
            </DynamicFormsCtx.Provider>
        );
    }

    return null;
};
