import React from 'react';

import type {MonacoEditorProps} from 'react-monaco-editor/lib/types';

import {DynamicFormConfig, FieldValue, ValidateError, WonderMirror} from './';

export interface DynamicFormsContext {
    config: DynamicFormConfig;
    Monaco?: React.ComponentType<MonacoEditorProps>;
    generateRandomValue?: ({
        regexp,
        onChange,
    }: {
        regexp?: string;
        onChange: (value: string) => void;
    }) => void;
    tools: {
        initialValue: FieldValue;
        onChange: (name: string, value: FieldValue, errors?: Record<string, ValidateError>) => void;
        onUnmount: (name: string) => void;
        submitFailed: boolean;
    };
    __mirror?: WonderMirror;
}
