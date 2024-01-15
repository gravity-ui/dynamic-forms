import React from 'react';

import type {MonacoEditorProps} from 'react-monaco-editor/lib/types';

import {StringSpec} from '../../../types';

import {
    DynamicFieldStore,
    DynamicFormConfig,
    DynamicFormMutators,
    DynamicFormMutatorsStore,
    FieldValue,
    ValidateError,
    WonderMirror,
} from './';

export interface DynamicFormsContext {
    config: DynamicFormConfig;
    Monaco?: React.ComponentType<MonacoEditorProps>;
    generateRandomValue?: (spec: StringSpec) => string;
    tools: {
        initialValue: FieldValue;
        onChange: (name: string, value: FieldValue, errors?: Record<string, ValidateError>) => void;
        onUnmount: (name: string) => void;
        submitFailed: boolean;
        mutateDFState: (mutators: DynamicFormMutators) => void;
    };
    store: DynamicFieldStore;
    mutatorsStore: DynamicFormMutatorsStore;
    __mirror?: WonderMirror;
}
