import React from 'react';

import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import get from 'lodash/get';
import {isValidElementType} from 'react-is';
import type {MonacoEditorProps} from 'react-monaco-editor/lib/types';

import {isCorrectSpec} from '../../helpers';
import {Spec, StringSpec} from '../../types';

import {Controller} from './Controller';
import {
    useCreateContext,
    useCreateSearchContext,
    useDynamicFieldMirror,
    useIntegrationFF,
    useMutators,
    useSearchStore,
    useStore,
} from './hooks';
import {DynamicFormConfig, DynamicFormMutators, FieldValue, WonderMirror} from './types';
import {getDefaultSearchFunction, isCorrectConfig} from './utils';

export interface DynamicFieldProps {
    name: string;
    spec: Spec;
    config: DynamicFormConfig;
    Monaco?: React.ComponentType<MonacoEditorProps>;
    search?: string | ((spec: Spec, input: FieldValue, name: string) => boolean);
    generateRandomValue?: (spec: StringSpec) => string;
    withoutInsertFFDebounce?: boolean;
    mutators?: DynamicFormMutators;
    __mirror?: WonderMirror;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({
    name,
    spec,
    config,
    Monaco,
    generateRandomValue,
    search,
    withoutInsertFFDebounce,
    mutators: externalMutators,
    __mirror,
}) => {
    const DynamicFormsCtx = useCreateContext();
    const SearchContext = useCreateSearchContext();
    const {tools, store} = useStore(name);
    const watcher = useIntegrationFF(store, withoutInsertFFDebounce);
    const {mutatorsStore, mutateDFState} = useMutators(externalMutators);
    const {store: searchStore, setField, removeField, isHiddenField} = useSearchStore();

    const context = React.useMemo(
        () => ({
            config,
            Monaco: isValidElementType(Monaco) ? Monaco : undefined,
            generateRandomValue,
            tools: {...tools, mutateDFState},
            store,
            mutatorsStore,
            __mirror,
        }),
        [tools, config, Monaco, __mirror, generateRandomValue, mutatorsStore, mutateDFState, store],
    );

    const searchContext = React.useMemo(
        () => ({
            setField,
            removeField,
            isHiddenField,
            searchFunction: isFunction(search) ? search : getDefaultSearchFunction(search),
        }),
        [isHiddenField, removeField, search, setField],
    );

    const correctParams = React.useMemo(
        () => isString(name) && isCorrectSpec(spec) && isCorrectConfig(config),
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
                        value={get(store.values, name)}
                    />
                    {watcher}
                </SearchContext.Provider>
            </DynamicFormsCtx.Provider>
        );
    }

    return null;
};
