import React from 'react';

import _ from 'lodash';
import {isValidElementType} from 'react-is';
import type {MonacoEditorProps} from 'react-monaco-editor/lib/types';

import {isCorrectSpec} from '../../helpers';
import {Spec} from '../../types';

import {Controller} from './Controller';
import {useCreateContext, useCreateSearchContext, useSearchStore, useStore} from './hooks';
import {DynamicFormConfig, FieldValue} from './types';
import {getDefaultSearchFunction, isCorrectConfig} from './utils';

export interface DynamicFieldProps {
    name: string;
    spec: Spec;
    config: DynamicFormConfig;
    Monaco?: React.ComponentType<MonacoEditorProps>;
    search?: string | ((spec: Spec, input: FieldValue, name: string) => boolean);
}

export const DynamicField: React.FC<DynamicFieldProps> = ({name, spec, config, Monaco, search}) => {
    const DynamicFormsCtx = useCreateContext();
    const SearchContext = useCreateSearchContext();
    const {tools, watcher} = useStore(name);

    const {setField, removeField, isHiddenField} = useSearchStore(name);

    const context = React.useMemo(
        () => ({
            config,
            Monaco: isValidElementType(Monaco) ? Monaco : undefined,
            tools,
        }),
        [tools, config, Monaco],
    );

    const searchContext = React.useMemo(
        () => ({
            setField,
            removeField,
            isHiddenField,
            searchFunction: _.isString(search) ? getDefaultSearchFunction(search) : search,
        }),
        [isHiddenField, removeField, search, setField],
    );

    const correctParams = React.useMemo(
        () => _.isString(name) && isCorrectSpec(spec) && isCorrectConfig(config),
        [name, spec, config],
    );

    if (correctParams) {
        return (
            <DynamicFormsCtx.Provider value={context}>
                <SearchContext.Provider value={searchContext}>
                    <Controller
                        spec={spec}
                        name={name}
                        parentOnChange={null}
                        initialValue={_.get(tools.initialValue, name)}
                    />
                    {watcher}
                </SearchContext.Provider>
            </DynamicFormsCtx.Provider>
        );
    }

    return null;
};
