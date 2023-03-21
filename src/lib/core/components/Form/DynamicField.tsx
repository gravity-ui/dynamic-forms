import React from 'react';

import _ from 'lodash';
import {isValidElementType} from 'react-is';
import type {MonacoEditorProps} from 'react-monaco-editor/lib/types';

import {isCorrectSpec} from '../../helpers';
import {Spec} from '../../types';

import {Controller} from './Controller';
import {useCreateContext, useCreateSearchContext, useSearchStore, useStore} from './hooks';
import {DynamicFormConfig, FieldValue} from './types';

import {defaultSearch, isCorrectConfig} from '.';

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
    const {store, onChangeStore, onDeleteField, isHidden} = useSearchStore(name);

    const searchFunction = React.useMemo(
        () => (_.isString(search) ? defaultSearch(search) : search),
        [search],
    );

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
            store,
            onChangeStore,
            searchFunction,
            onDeleteField,
            isHidden,
        }),
        [isHidden, onChangeStore, onDeleteField, searchFunction, store],
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
