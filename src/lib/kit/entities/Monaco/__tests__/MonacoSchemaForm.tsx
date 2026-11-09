/// <reference types="vite/client" />

import React from 'react';

import {useThemeType} from '@gravity-ui/uikit';
import type {Environment} from 'monaco-editor/esm/vs/editor/editor.api';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import 'monaco-editor/esm/vs/language/json/monaco.contribution';
import MonacoEditor from 'react-monaco-editor';
import type {MonacoEditorProps} from 'react-monaco-editor/lib/types';

import {SchemaForm, type SchemaFormProps} from '~playwright/core/SchemaForm';
import {SchemaFormGrid, type SchemaFormGridProps} from '~playwright/core/SchemaFormGrid';

const browserGlobal = self as typeof self & {MonacoEnvironment?: Environment};

browserGlobal.MonacoEnvironment = {
    getWorker: (_moduleId, label) => (label === 'json' ? new JsonWorker() : new EditorWorker()),
};

const ThemedMonacoEditor = (props: MonacoEditorProps) => {
    const theme = useThemeType();

    return <MonacoEditor {...props} theme={theme === 'dark' ? 'vs-dark' : 'vs'} />;
};

// Functions stay on the browser side of the component-testing boundary.
export const MonacoSchemaForm = ({userContext, ...rendererProps}: SchemaFormProps) => (
    <SchemaForm
        {...rendererProps}
        userContext={{...userContext, MonacoEditor: ThemedMonacoEditor}}
    />
);

export const MonacoSchemaFormGrid = ({cases, caseHeight}: SchemaFormGridProps) => (
    <SchemaFormGrid
        caseHeight={caseHeight}
        cases={cases.map(({props, ...frame}) => ({
            ...frame,
            props: {
                ...props,
                userContext: {...props.userContext, MonacoEditor: ThemedMonacoEditor},
            },
        }))}
    />
);
