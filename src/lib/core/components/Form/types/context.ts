import type React from 'react';

import type {MonacoEditorProps} from 'react-monaco-editor/lib/types';

import type {StringSpec} from '../../../types';

import type {
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
    shared: {
        store: Record<string, any>;
        onChangeShared: (name: string, value: any) => void;
    };
    mutatorsStore: DynamicFormMutatorsStore;
    renderHtml?: (text: string) => React.ReactNode;
    __mirror?: WonderMirror;
}
