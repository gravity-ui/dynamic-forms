import React from 'react';

import {RadioButton, TextInput, useTheme} from '@gravity-ui/uikit';
import noop from 'lodash/noop';
import {Form} from 'react-final-form';
import MonacoEditor from 'react-monaco-editor';
import type {MonacoEditorProps} from 'react-monaco-editor/lib/types';

import {DynamicField, DynamicView} from '../';
import {FormValue, MonacoInput, MonacoInputBaseProps, Spec} from '../../../lib';
import {cn} from '../../../lib/kit/utils/cn';

import {getOptionsSpec, transformCorrect, transformIncorrect} from './utils';

import './InputPreview.scss';

const b = cn('input-preview');

export interface InputPreviewProps {
    spec: Spec;
    value?: FormValue;
    excludeOptions?: string[];
    viewMode: 'story' | 'docs';
}

export const InputPreview: React.FC<InputPreviewProps> = ({
    spec: externalSpec,
    value,
    excludeOptions,
    viewMode,
}) => {
    const [searchOptions, setSearchOptions] = React.useState('');
    const [searchInput, setSearchInput] = React.useState('');
    const [toggler, setToggler] = React.useState<'form' | 'json'>('form');
    const [togglerInput, setTogglerInput] = React.useState<'form' | 'view' | 'json'>('form');
    const theme = useTheme();

    const togglerItems = React.useMemo(
        () => [
            {value: 'form', title: 'Form'},
            {value: 'json', title: 'JSON'},
        ],
        [],
    );
    const togglerInputItems = React.useMemo(
        () => [
            {value: 'form', title: 'Form'},
            {value: 'view', title: 'View'},
            ...(viewMode !== 'docs' ? [{value: 'json', title: 'JSON'}] : []),
        ],
        [viewMode],
    );

    const handleChangeToggler = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => setToggler(e.target.value as 'form' | 'json'),
        [setToggler],
    );

    const handleChangeTogglerInput = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) =>
            setTogglerInput(e.target.value as 'form' | 'view'),
        [setTogglerInput],
    );

    const renderMonaco = React.useCallback(
        (value: FormValue) => {
            const monacoProps = {
                input: {
                    value: JSON.stringify(
                        value,
                        (_, value) => (value === undefined ? null : value),
                        2,
                    ),
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
            } as MonacoInputBaseProps;

            return <MonacoInput {...monacoProps} />;
        },
        [theme],
    );

    const initialValues = React.useMemo(
        () => ({
            optionsSpec: getOptionsSpec(externalSpec, excludeOptions),
            options: transformCorrect(externalSpec),
            input: value,
        }),
        [externalSpec, excludeOptions],
    );

    const searchFunction = React.useCallback(
        (spec: Spec) =>
            Boolean(
                spec.viewSpec.layoutTitle
                    ?.toLowerCase()
                    .includes(searchOptions.trim().toLowerCase()),
            ),
        [searchOptions],
    );

    return (
        <Form initialValues={initialValues} onSubmit={noop}>
            {(form) => (
                <div className={b({docs: viewMode === 'docs'})}>
                    <div className={b('options')}>
                        <RadioButton
                            value={toggler}
                            onChange={handleChangeToggler}
                            className={b('toggler')}
                        >
                            {togglerItems.map((option) => (
                                <RadioButton.Option key={option.value} value={option.value}>
                                    {option.title}
                                </RadioButton.Option>
                            ))}
                        </RadioButton>
                        <div className={b('options-field', {hidden: toggler !== 'form'})}>
                            <TextInput
                                size="m"
                                onUpdate={setSearchOptions}
                                value={searchOptions}
                                placeholder="Search by field"
                                className={b('search')}
                                hasClear
                            />
                            <DynamicField
                                name="options"
                                spec={form.values.optionsSpec}
                                search={searchFunction}
                            />
                        </div>
                        {toggler === 'json' ? (
                            <div className={b('monaco')}>
                                {renderMonaco(
                                    transformIncorrect(form.values.options) as unknown as FormValue,
                                )}
                            </div>
                        ) : null}
                    </div>
                    <div className={b('input')}>
                        <RadioButton
                            value={togglerInput}
                            onChange={handleChangeTogglerInput}
                            className={b('toggler')}
                        >
                            {togglerInputItems.map((option) => (
                                <RadioButton.Option key={option.value} value={option.value}>
                                    {option.title}
                                </RadioButton.Option>
                            ))}
                        </RadioButton>
                        <div className={b('input-field', {hidden: togglerInput !== 'form'})}>
                            <TextInput
                                size="m"
                                onUpdate={setSearchInput}
                                value={searchInput}
                                placeholder="Search by field"
                                className={b('search')}
                                hasClear
                            />
                            <DynamicField
                                name="input"
                                spec={transformIncorrect(form.values.options)}
                                search={searchInput}
                            />
                        </div>
                        {togglerInput === 'view' ? (
                            <div className={b('input-view')}>
                                <DynamicView
                                    value={form.values.input}
                                    spec={transformIncorrect(form.values.options)}
                                />
                            </div>
                        ) : null}
                        {togglerInput === 'json' ? (
                            <div className={b('monaco')}>{renderMonaco(form.values.input)}</div>
                        ) : null}
                    </div>
                </div>
            )}
        </Form>
    );
};
