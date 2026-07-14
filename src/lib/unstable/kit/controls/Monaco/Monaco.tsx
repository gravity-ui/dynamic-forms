import React from 'react';

import {ChevronsCollapseUpRight, ChevronsExpandUpRight, Code} from '@gravity-ui/icons';
import {Button, Dialog, Flex, Icon, Text} from '@gravity-ui/uikit';
import type {MonacoEditorProps} from 'react-monaco-editor/lib/types';

import {
    type Control,
    type JsonSchemaString,
    useSchemaRendererMutators,
    useUserContext,
} from '../../../core';
import {ControlContainer} from '../../components';
import {block, getBooleanValidationState} from '../../utils';

import './Monaco.scss';

const b = block('monaco');

export interface MonacoProps
    extends Omit<MonacoEditorProps, 'defaultValue' | 'value' | 'onChange'> {
    withoutDialog?: boolean;
    ignoreMonacoErrors?: boolean;
}

const Component: Control<JsonSchemaString, MonacoProps> = ({controlProps, input, meta, schema}) => {
    const {name, onBlur, onChange, onFocus, value} = input;
    const {
        language = 'plaintext',
        options: optionsProps,
        withoutDialog = true,
        ignoreMonacoErrors = false,
        width = '100%',
        height = 350,
        ...restControlProps
    } = controlProps;

    const {MonacoEditor} = useUserContext(name);
    const {removeExternalErrors, setExternalErrors} = useSchemaRendererMutators();

    const modelUrisRef = React.useRef<string[]>([]);
    const innerErrorRef = React.useRef<string | null>(null);
    const [dialogOpen, setDialogOpen] = React.useState(false);

    const toggleDialogOpen = React.useCallback(() => setDialogOpen((f) => !f), []);

    const options: MonacoEditorProps['options'] = React.useMemo(
        () => ({
            fontSize: 12,
            readOnly: schema.readOnly,
            formatOnPaste: true,
            formatOnType: true,
            contextmenu: false,
            minimap: {enabled: false},
            autoClosingBrackets: 'languageDefined',
            automaticLayout: true,
            ...optionsProps,
        }),
        [optionsProps, schema.readOnly],
    );

    const onUpdate = React.useCallback(
        (value: string) => {
            onFocus();
            onChange(value);
            onBlur();
        },
        [onFocus, onChange, onBlur],
    );

    const Container: React.FC<
        React.PropsWithChildren<{
            dialog?: boolean;
            width: string | number;
            height: string | number;
        }>
    > = React.useCallback(
        ({children, dialog, width, height}) => (
            <div className={b('container')} data-qa={name}>
                <Flex alignItems="center" justifyContent="space-between" className={b('header')}>
                    <Flex alignItems="center" gap={1}>
                        <Icon data={Code} size={16} />
                        <Text variant="subheader-1">{language}</Text>
                    </Flex>
                    {withoutDialog ? (
                        <Button
                            onClick={toggleDialogOpen}
                            view="flat-secondary"
                            qa={`${name}-dialog-open`}
                        >
                            <Icon
                                data={dialog ? ChevronsCollapseUpRight : ChevronsExpandUpRight}
                                size={16}
                            />
                        </Button>
                    ) : null}
                </Flex>
                <div className={b('control')} style={{width, height}}>
                    <div className={b('control-inner')}>{children}</div>
                </div>
            </div>
        ),
        [name, language, withoutDialog, toggleDialogOpen],
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
                            setExternalErrors?.({regularErrors: {[name]: error}});
                        }
                    } else if (innerErrorRef.current) {
                        innerErrorRef.current = null;
                        removeExternalErrors?.({removeFunctionOrNames: [name]});
                    }
                });
            }

            return;
        };
    }, [name, ignoreMonacoErrors, setExternalErrors, removeExternalErrors]);

    if (!MonacoEditor) {
        return null;
    }

    const control = (
        <MonacoEditor
            {...restControlProps}
            language={language}
            value={value}
            onChange={onUpdate}
            options={options}
            editorDidMount={editorDidMount}
        />
    );

    return (
        <ControlContainer stretch="max" className={b({error: getBooleanValidationState(meta)})}>
            <Container width={width} height={height}>
                {control}
            </Container>
            <Dialog open={dialogOpen} onClose={toggleDialogOpen} hasCloseButton={false}>
                <Dialog.Body className={b('dialog-body')}>
                    <Container width="80vw" height="90vh" dialog>
                        {control}
                    </Container>
                </Dialog.Body>
            </Dialog>
        </ControlContainer>
    );
};

export const Monaco = React.memo(Component);
