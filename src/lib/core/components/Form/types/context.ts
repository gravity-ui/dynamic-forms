import React from 'react';

import type {MonacoEditorProps} from 'react-monaco-editor/lib/types';

import {DynamicFormConfig, FieldObjectValue, FieldValue, ValidateError} from './';

export interface DynamicFormsContext {
    config: DynamicFormConfig;
    Monaco?: React.ComponentType<MonacoEditorProps>;
    tools: {
        initialValue: FieldObjectValue;
        onChange: (name: string, value: FieldValue, errors?: Record<string, ValidateError>) => void;
        onUnmount: (name: string) => void;
        submitFailed: boolean;
    };
}
