import React from 'react';

import {RadioButton} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import _ from 'lodash';
import {Form} from 'react-final-form';
import MonacoEditor from 'react-monaco-editor';
import type {MonacoEditorProps} from 'react-monaco-editor/lib/types';

import {DynamicField, DynamicView} from '../';
import {
    AnyObject,
    FormValue,
    MonacoInput,
    MonacoInputBaseProps,
    Spec,
    SpecTypes,
} from '../../../lib';

import './Editor.scss';

const b = block('editor');

export interface EditorProps {
    spec: Spec;
    value?: FormValue;
    viewMode: 'story' | 'docs';
}

export const Editor: React.FC<EditorProps> = ({spec: externalSpec, value, viewMode}) => {
    const [spec, setSpec] = React.useState(externalSpec);
    const [toggler, setToggler] = React.useState<'form' | 'view' | 'json'>('form');

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

    const specEditorProps = React.useMemo(
        () =>
            ({
                input: {
                    value: JSON.stringify(spec, null, 2),
                    onChange: (value) => {
                        try {
                            setSpec(JSON.parse(value as string));
                        } catch (_) {}
                    },
                },
                spec: {viewSpec: {monacoParams: {language: 'json', fontSize: 11}}},
                MonacoComponent: (props: MonacoEditorProps) => (
                    <MonacoEditor {...props} width="640px" height="calc(100% - 49px)" />
                ),
                withoutDialog: true,
            } as MonacoInputBaseProps),
        [],
    );

    const getValuesEditorProps = React.useCallback(
        (value: AnyObject) =>
            ({
                input: {
                    value: JSON.stringify(value, null, 2),
                    onChange: _.noop,
                },
                spec: {viewSpec: {monacoParams: {language: 'json', fontSize: 11}, disabled: true}},
                MonacoComponent: (props: MonacoEditorProps) => (
                    <MonacoEditor {...props} width="640px" height="calc(100% - 49px)" />
                ),
                withoutDialog: true,
            } as MonacoInputBaseProps),
        [],
    );

    const getViewProps = React.useCallback(
        (values: FormValue, spec: Spec) => ({
            value: {'__any-name': values},
            spec: {
                type: SpecTypes.Object,
                properties: {'__any-name': spec},
                viewSpec: {type: 'base'},
            },
        }),
        [],
    );

    return (
        <div className={b({docs: viewMode === 'docs'})}>
            <div className={b('options')}>
                <div className={b('monaco')}>
                    <MonacoInput {...specEditorProps} />
                </div>
            </div>
            <div className={b('input')}>
                <RadioButton
                    value={toggler}
                    onChange={handleChangeTogglerInput}
                    className={b('toggler')}
                >
                    {togglerItems.map((option) => (
                        <RadioButton.Option key={option.value} value={option.value}>
                            {option.title}
                        </RadioButton.Option>
                    ))}
                </RadioButton>
                <Form initialValues={{input: value}} onSubmit={_.noop}>
                    {(form) => (
                        <React.Fragment>
                            <div
                                className={b('input-field', {hidden: toggler !== 'form'})}
                                style={{maxWidth: '400px'}}
                            >
                                <DynamicField name="input" spec={spec} />
                            </div>
                            <div className={b('input-view', {hidden: toggler !== 'view'})}>
                                <DynamicView {...getViewProps(form.values.input, spec)} />
                            </div>
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
