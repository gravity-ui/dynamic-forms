import React from 'react';

import _ from 'lodash';
import {isValidElementType} from 'react-is';
import type {MonacoEditorProps} from 'react-monaco-editor/lib/types';

import {isCorrectSpec} from '../../helpers';
import {Spec} from '../../types';

import {Controller} from './Controller';
import {
    useCreateContext,
    useCreateSearchContext,
    useDynamicFieldMirror,
    useIntegrationFF,
    useSearchStore,
    useStore,
} from './hooks';
import {DynamicFormConfig, FieldValue, WonderMirror} from './types';
import {getDefaultSearchFunction, isCorrectConfig} from './utils';

export interface DynamicFieldProps {
    name: string;
    spec: Spec;
    config: DynamicFormConfig;
    Monaco?: React.ComponentType<MonacoEditorProps>;
    search?: string | ((spec: Spec, input: FieldValue, name: string) => boolean);
    __mirror?: WonderMirror;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({
    name,
    spec,
    config,
    Monaco,
    search,
    __mirror,
}) => {
    const DynamicFormsCtx = useCreateContext();
    const SearchContext = useCreateSearchContext();
    const {tools, store} = useStore(name);
    const watcher = useIntegrationFF(store);
    const {store: searchStore, setField, removeField, isHiddenField} = useSearchStore();

    const context = React.useMemo(
        () => ({
            config,
            Monaco: isValidElementType(Monaco) ? Monaco : undefined,
            tools,
            __mirror,
        }),
        [tools, config, Monaco, __mirror],
    );

    const searchContext = React.useMemo(
        () => ({
            setField,
            removeField,
            isHiddenField,
            searchFunction: _.isFunction(search) ? search : getDefaultSearchFunction(search),
        }),
        [isHiddenField, removeField, search, setField],
    );

    const correctParams = React.useMemo(
        () => _.isString(name) && isCorrectSpec(spec) && isCorrectConfig(config),
        [name, spec, config],
    );

    useDynamicFieldMirror(
        {
            useStore: {tools, store},
            useIntegrationFF: watcher,
            useSearchStore: {store: searchStore, setField, removeField, isHiddenField},
        },
        __mirror,
    );

    if (correctParams) {
        return (
            <DynamicFormsCtx.Provider value={context}>
                <SearchContext.Provider value={searchContext}>
                    <Controller
                        spec={spec}
                        name={name}
                        parentOnChange={null}
                        parentOnUnmount={null}
                        value={_.get(store.values, name)}
                    />
                    {watcher}
                </SearchContext.Provider>
            </DynamicFormsCtx.Provider>
        );
    }

    return null;
};
