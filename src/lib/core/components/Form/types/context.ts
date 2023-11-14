import React from 'react';

import type {MonacoEditorProps} from 'react-monaco-editor/lib/types';

import {StringSpec} from '../../../types';

import {BaseValidateError, DynamicFormConfig, FieldValue, ValidateError, WonderMirror} from './';

export interface DynamicFormsContext {
    config: DynamicFormConfig;
    Monaco?: React.ComponentType<MonacoEditorProps>;
    generateRandomValue?: (spec: StringSpec) => string;
    tools: {
        initialValue: FieldValue;
        onChange: (name: string, value: FieldValue, errors?: Record<string, ValidateError>) => void;
        onUnmount: (name: string) => void;
        submitFailed: boolean;
    };
    externalErrors?: Record<string, BaseValidateError>;
    __mirror?: WonderMirror;
}
