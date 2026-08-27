import React from 'react';

import {Dialog} from '@gravity-ui/uikit';
import type {MonacoEditorProps} from 'react-monaco-editor/lib/types';

import {
    type JsonSchemaString,
    type NodeEntity,
    SchemaRendererEventType,
    SchemaRendererMode,
    useSchemaRendererState,
    useSchemaRendererTools,
} from '../../../core';
import {EmptyEntityValue, EntityContainer, MonacoContainer} from '../../components';
import {block, getBooleanValidationState} from '../../utils';

import './Monaco.scss';

const b = block('monaco');

export interface MonacoProps
    extends Omit<MonacoEditorProps, 'defaultValue' | 'value' | 'onChange'> {
    ignoreMonacoErrors?: boolean;
    withDialog?: boolean;
}

export const Monaco: NodeEntity<JsonSchemaString, MonacoProps> = ({
    headName,
    input,
    meta,
    mode,
    props,
    schema,
}) => {
    const {name, onBlur, onChange, onFocus, value} = input;

    const overviewFlag = mode === SchemaRendererMode.Overview;

    const {
        language = 'plaintext',
        options: optionsProps,
        withDialog = true,
        ignoreMonacoErrors = false,
        width = '100%',
        height = 350,
        ...restEntityProps
    } = props;

    const srState = useSchemaRendererState({
        headName,
        subscriptions: [SchemaRendererEventType.UserContext],
    });
    const {addExternalErrors, removeExternalErrors} = useSchemaRendererTools();
    const {MonacoEditor} = srState?.userContext || {};

    const modelUrisRef = React.useRef<string[]>([]);
    const innerErrorRef = React.useRef<string | null>(null);
    const [dialogOpen, setDialogOpen] = React.useState(false);

    const toggleDialogOpen = React.useCallback(() => setDialogOpen((f) => !f), []);

    const options: MonacoEditorProps['options'] = React.useMemo(
        () => ({
            fontSize: 12,
            readOnly: overviewFlag || schema.readOnly,
            formatOnPaste: true,
            formatOnType: true,
            contextmenu: false,
            minimap: {enabled: false},
            autoClosingBrackets: 'languageDefined',
            automaticLayout: true,
            ...optionsProps,
        }),
        [optionsProps, overviewFlag, schema.readOnly],
    );

    const onUpdate = React.useCallback(
        (value: string) => {
            onFocus();
            onChange(value);
            onBlur();
        },
        [onFocus, onChange, onBlur],
    );

    const editorDidMount: MonacoEditorProps['editorDidMount'] = React.useMemo(() => {
        if (ignoreMonacoErrors) {
            return undefined;
        }

        return (editor, monaco) => {
            const model = editor.getModel();

            if (model) {
                const modelUri = model.uri.toString();

                modelUrisRef.current.push(modelUri);

                model.onWillDispose(() => {
                    modelUrisRef.current = modelUrisRef.current.filter((u) => u !== modelUri);
                });

                monaco.editor.onDidChangeMarkers((uris) => {
                    const editedUri = uris.find((u) => modelUrisRef.current.includes(u.toString()));

                    if (!editedUri) {
                        return;
                    }

                    const marker = monaco.editor
                        .getModelMarkers({resource: editedUri})
                        .find((m) => m.severity === monaco.MarkerSeverity.Error);

                    if (marker) {
                        const error = `${marker.message}${
                            marker.message[marker.message.length - 1] === '.' ? '' : '.'
                        } ${marker.source}(${marker.code}) [Line ${
                            marker.startLineNumber
                        }, Column ${marker.startColumn}]`;

                        if (innerErrorRef.current !== error) {
                            innerErrorRef.current = error;
                            addExternalErrors?.({headName, regularErrors: {[name]: error}});
                        }
                    } else if (innerErrorRef.current) {
                        innerErrorRef.current = null;
                        removeExternalErrors?.({headName, removeFunctionOrNames: [name]});
                    }
                });
            }

            return;
        };
    }, [addExternalErrors, headName, name, ignoreMonacoErrors, removeExternalErrors]);

    if (!MonacoEditor) {
        return null;
    }

    if (overviewFlag && !value) {
        return <EmptyEntityValue />;
    }

    const control = (
        <MonacoEditor
            {...restEntityProps}
            language={language}
            value={value}
            onChange={onUpdate}
            options={options}
            editorDidMount={editorDidMount}
        />
    );

    return (
        <EntityContainer
            className={b({error: getBooleanValidationState(meta)})}
            stretch="max"
            fill="populated"
        >
            <MonacoContainer
                dialog={false}
                height={height}
                language={language}
                toggleDialogVisibility={toggleDialogOpen}
                width={width}
                withDialog={withDialog}
                qa={name}
            >
                {control}
            </MonacoContainer>
            <Dialog open={dialogOpen} onClose={toggleDialogOpen} hasCloseButton={false}>
                <Dialog.Body className={b('dialog-body')}>
                    <MonacoContainer
                        dialog={true}
                        height="90vh"
                        language={language}
                        toggleDialogVisibility={toggleDialogOpen}
                        width="80vw"
                        withDialog={withDialog}
                        qa={name}
                    >
                        {control}
                    </MonacoContainer>
                </Dialog.Body>
            </Dialog>
        </EntityContainer>
    );
};
