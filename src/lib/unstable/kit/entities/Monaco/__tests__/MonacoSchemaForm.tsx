/// <reference types="vite/client" />

import React from 'react';

import type {Environment} from 'monaco-editor/esm/vs/editor/editor.api';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import 'monaco-editor/esm/vs/language/json/monaco.contribution';
import MonacoEditor from 'react-monaco-editor';

import {SchemaForm, type SchemaFormProps} from '~playwright/core/SchemaForm';
import {SchemaFormGrid, type SchemaFormGridProps} from '~playwright/core/SchemaFormGrid';

const browserGlobal = self as typeof self & {MonacoEnvironment?: Environment};

browserGlobal.MonacoEnvironment = {
    getWorker: (_moduleId, label) => (label === 'json' ? new JsonWorker() : new EditorWorker()),
};

// Functions stay on the browser side of the component-testing boundary.
export const MonacoSchemaForm = ({userContext, ...rendererProps}: SchemaFormProps) => (
    <SchemaForm {...rendererProps} userContext={{...userContext, MonacoEditor}} />
);

export const MonacoSchemaFormGrid = ({cases, columns}: SchemaFormGridProps) => (
    <SchemaFormGrid
        columns={columns}
        cases={cases.map(({label, props}) => ({
            label,
            props: {...props, userContext: {...props.userContext, MonacoEditor}},
        }))}
    />
);
