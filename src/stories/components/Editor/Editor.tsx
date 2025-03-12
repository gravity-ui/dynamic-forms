import React from 'react';

import {Flex, SegmentedRadioGroup, Switch, Text, useTheme} from '@gravity-ui/uikit';
import noop from 'lodash/noop';
import {Form} from 'react-final-form';
import MonacoEditor from 'react-monaco-editor';
import type {MonacoEditorProps} from 'react-monaco-editor/lib/types';

import {DynamicField, DynamicView} from '../';
import type {AnyObject, FormValue, MonacoInputBaseProps, Spec} from '../../../lib';
import {MonacoInput, SpecTypes} from '../../../lib';
import {cn} from '../../../lib/kit/utils/cn';

import {renderHtml} from './renderHtml';

import './Editor.scss';

const b = cn('editor');

export interface EditorProps {
    spec: Spec;
    value?: FormValue;
    viewMode: 'story' | 'docs';
    withCustomRenderHtml?: boolean;
}

export const Editor: React.FC<EditorProps> = ({
    spec: externalSpec,
    value,
    viewMode,
    withCustomRenderHtml,
}) => {
    const [spec, setSpec] = React.useState(externalSpec);
    const [ready, setReady] = React.useState(true);
    const [showLayoutDescription, setShowLayoutDescription] = React.useState(false);
    const [toggler, setToggler] = React.useState<'form' | 'view' | 'json'>('form');
    const [parseJson, setParseJson] = React.useState(false);
    const theme = useTheme();

    const togglerItems = React.useMemo(
        () => [
            {value: 'form', title: 'Form'},
            {value: 'view', title: 'View'},
            ...(viewMode !== 'docs' ? [{value: 'json', title: 'JSON'}] : []),
        ],
        [viewMode],
    );

    const handleChangeTogglerInput = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => setToggler(e.target.value as 'form' | 'view'),
        [setToggler],
    );

    const handleSetSpec = React.useCallback(
        (value: Spec) => {
            setReady(false);
            setSpec(value);
        },
        [setSpec, setReady],
    );

    const specEditorProps = React.useMemo(
        () =>
            ({
                input: {
                    value: JSON.stringify(spec, null, 2),
                    onChange: (value) => {
                        try {
                            const spec = JSON.parse(value as string);

                            handleSetSpec(spec);
                        } catch (_) {}
                    },
                },
                spec: {viewSpec: {monacoParams: {language: 'json', fontSize: 11}}},
                MonacoComponent: (props: MonacoEditorProps) => (
                    <MonacoEditor
                        {...props}
                        width="640px"
                        height="calc(100% - 49px)"
                        theme={`vs-${theme.includes('dark') ? 'dark' : 'light'}`}
                    />
                ),
                withoutDialog: true,
            }) as MonacoInputBaseProps,
        [theme],
    );

    const getValuesEditorProps = React.useCallback(
        (value: AnyObject) =>
            ({
                input: {
                    value: JSON.stringify(value, null, 2),
                    onChange: noop,
                },
                spec: {viewSpec: {monacoParams: {language: 'json', fontSize: 11}, disabled: true}},
                MonacoComponent: (props: MonacoEditorProps) => (
                    <MonacoEditor
                        {...props}
                        width="640px"
                        height="calc(100% - 49px)"
                        theme={`vs-${theme.includes('dark') ? 'dark' : 'light'}`}
                    />
                ),
                withoutDialog: true,
            }) as MonacoInputBaseProps,
        [theme],
    );

    const getViewProps = React.useCallback(
        (values: FormValue, spec: Spec, showLayoutDescription: boolean) => ({
            value: {'__any-name': values},
            spec: {
                type: SpecTypes.Object,
                properties: {'__any-name': spec},
                viewSpec: {type: 'base'},
            },
            showLayoutDescription,
        }),
        [],
    );

    React.useEffect(() => {
        if (!ready) {
            setReady(true);
        }
    }, [ready]);

    return (
        <div className={b({docs: viewMode === 'docs'})}>
            <div className={b('options')}>
                <div className={b('parse-json')}>
                    <Text variant="body-2">Parse default values like json</Text>
                    <Switch onChange={() => setParseJson((v) => !v)} className={b('switch')} />
                </div>
                <div className={b('monaco')}>
                    <MonacoInput {...specEditorProps} />
                </div>
            </div>
            <div className={b('input')}>
                <SegmentedRadioGroup
                    value={toggler}
                    onChange={handleChangeTogglerInput}
                    className={b('toggler')}
                >
                    {togglerItems.map((option) => (
                        <SegmentedRadioGroup.Option key={option.value} value={option.value}>
                            {option.title}
                        </SegmentedRadioGroup.Option>
                    ))}
                </SegmentedRadioGroup>
                <Form initialValues={{input: value}} onSubmit={noop}>
                    {(form) => (
                        <React.Fragment>
                            {ready ? (
                                <div className={b('input-field', {hidden: toggler !== 'form'})}>
                                    <DynamicField
                                        name="input"
                                        spec={spec}
                                        parseJsonDefaultValue={parseJson}
                                        renderHtml={withCustomRenderHtml ? renderHtml : undefined}
                                    />
                                </div>
                            ) : null}
                            {toggler === 'view' ? (
                                <div className={b('input-view')}>
                                    <Flex gap={1} spacing={{mb: 6}}>
                                        <Text variant="body-2">
                                            Enable showLayoutDescription props
                                        </Text>
                                        <Switch
                                            onChange={() => setShowLayoutDescription((v) => !v)}
                                            className={b('switch')}
                                        />
                                    </Flex>
                                    <DynamicView
                                        {...getViewProps(
                                            form.values.input,
                                            spec,
                                            showLayoutDescription,
                                        )}
                                        renderHtml={withCustomRenderHtml ? renderHtml : undefined}
                                    />
                                </div>
                            ) : null}
                            {toggler === 'json' ? (
                                <div className={b('monaco')}>
                                    <MonacoInput {...getValuesEditorProps(form.values.input)} />
                                </div>
                            ) : null}
                        </React.Fragment>
                    )}
                </Form>
            </div>
        </div>
    );
};
