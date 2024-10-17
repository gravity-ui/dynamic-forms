import React from 'react';

import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import {isValidElementType} from 'react-is';
import type {MonacoEditorProps} from 'react-monaco-editor/lib/types';

import {isCorrectSpec} from '../../helpers';
import {Spec, StringSpec} from '../../types';

import {Controller} from './Controller';
import {
    useCreateContext,
    useCreateSearchContext,
    useDynamicFieldMirror,
    useFormSharedStore,
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
    destroyOnUnregister?: boolean;
    mutators?: DynamicFormMutators;
    shared?: Record<string, any>;
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
    destroyOnUnregister = true,
    mutators: externalMutators,
    shared: externalShared,
    __mirror,
}) => {
    const DynamicFormsCtx = useCreateContext();
    const SearchContext = useCreateSearchContext();
    const {tools, store} = useStore(name);
    const watcher = useIntegrationFF(store, withoutInsertFFDebounce, destroyOnUnregister);
    const {mutatorsStore, mutateDFState} = useMutators(externalMutators);
    const {store: searchStore, setField, removeField, isHiddenField} = useSearchStore();
    const shared = useFormSharedStore(externalShared);

    const context = React.useMemo(
        () => ({
            config,
            Monaco: isValidElementType(Monaco) ? Monaco : undefined,
            generateRandomValue,
            tools: {...tools, mutateDFState},
            store,
            shared,
            mutatorsStore,
            __mirror,
        }),
        [
            tools,
            shared,
            config,
            Monaco,
            __mirror,
            generateRandomValue,
            mutatorsStore,
            mutateDFState,
            store,
        ],
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
