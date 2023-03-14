import React from 'react';

import _ from 'lodash';
import {isValidElementType} from 'react-is';
import type {MonacoEditorProps} from 'react-monaco-editor/lib/types';

import {isCorrectSpec} from '../../helpers';
import {Spec} from '../../types';

import {Controller} from './Controller';
import {isCorrectConfig} from './helpers';
import {useCreateContext, useStore} from './hooks';
import {DynamicFormConfig} from './types';

export interface DynamicFieldProps {
    name: string;
    spec: Spec;
    config: DynamicFormConfig;
    Monaco?: React.ComponentType<MonacoEditorProps>;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({name, spec, config, Monaco}) => {
    const DynamicFormsCtx = useCreateContext();
    const {tools, watcher} = useStore(name);

    const context = React.useMemo(
        () => ({
            config,
            Monaco: isValidElementType(Monaco) ? Monaco : undefined,
            tools,
        }),
        [tools, config, Monaco],
    );

    const correctParams = React.useMemo(
        () => _.isString(name) && isCorrectSpec(spec) && isCorrectConfig(config),
        [name, spec, config],
    );

    if (correctParams) {
        return (
            <DynamicFormsCtx.Provider value={context}>
                <Controller
                    spec={spec}
                    name={name}
                    parentOnChange={null}
                    initialValue={_.get(tools.initialValue, name)}
                />
                {watcher}
            </DynamicFormsCtx.Provider>
        );
    }

    return null;
};
