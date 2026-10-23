import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {schemaTest as test} from '~playwright/core';
import type {SchemaFormProps} from '~playwright/core/SchemaForm';
import type {SchemaFormGridProps} from '~playwright/core/SchemaFormGrid';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {SchemaRendererMode} from '../../../../core/constants';

import {MonacoSchemaForm, MonacoSchemaFormGrid} from './MonacoSchemaForm';
import {createSchema, value} from './helpers';

test.describe('SchemaRenderer Monaco', () => {
    // Each grid mounts 64 editors; keep these scenarios in one worker per browser.
    test.describe.configure({mode: 'default'});

    for (const mode of [SchemaRendererMode.Form, SchemaRendererMode.Overview]) {
        test(`${mode} layouts sizes and views`, async ({mount, page, expectScreenshot}) => {
            const stateCases: SchemaFormGridProps['cases'] = [
                {
                    label: 'editing JSON updates the form value',
                    props: ((): SchemaFormProps => {
                        const schema = createSchema('column');
                        return {
                            schema: schema,
                            value: value,
                            mode: SchemaRendererMode.Form,
                            size: 'm',
                            view: 'stretch',
                            coerceInitialValues: true,
                            jsonDefaultValues: false,
                            validateOnBlur: false,
                            userContext: {},
                            showSubmit: false,
                            width: 600,
                        };
                    })(),
                },
                {
                    label: 'disabled editor preserves its value',
                    props: ((): SchemaFormProps => {
                        const base = createSchema('column');
                        const schema = {
                            ...base,
                            nodeParameters: {
                                ...base.nodeParameters,
                                flags: {open: true, disabled: true},
                            },
                        };
                        return {
                            schema: schema,
                            value: value,
                            mode: SchemaRendererMode.Form,
                            size: 'm',
                            view: 'stretch',
                            coerceInitialValues: true,
                            jsonDefaultValues: false,
                            validateOnBlur: false,
                            userContext: {},
                            showSubmit: false,
                            width: 600,
                        };
                    })(),
                },
                {
                    label: 'overview editor is read only',
                    props: ((): SchemaFormProps => {
                        const schema = createSchema('column');
                        return {
                            schema: schema,
                            value: value,
                            mode: SchemaRendererMode.Overview,
                            size: 'm',
                            view: 'stretch',
                            coerceInitialValues: true,
                            jsonDefaultValues: false,
                            validateOnBlur: false,
                            userContext: {},
                            showSubmit: false,
                            width: 600,
                        };
                    })(),
                },
                {
                    label: 'invalid JSON can ignore editor validation without replacing the editor',
                    props: ((): SchemaFormProps => {
                        const base = createSchema('column');
                        const schema = {
                            ...base,
                            nodeParameters: {
                                ...base.nodeParameters,
                                entityProps: {
                                    ...base.nodeParameters?.entityProps,
                                    withDialog: false,
                                    ignoreMonacoErrors: true,
                                },
                            },
                        };
                        return {
                            schema: schema,
                            value: '{broken json}',
                            mode: SchemaRendererMode.Form,
                            size: 'm',
                            view: 'stretch',
                            coerceInitialValues: true,
                            jsonDefaultValues: false,
                            validateOnBlur: false,
                            userContext: {},
                            showSubmit: true,
                            width: 600,
                        };
                    })(),
                },
                {
                    label: 'editor diagnostics reach the form validation',
                    props: ((): SchemaFormProps => {
                        const schema = createSchema('column');
                        return {
                            schema: schema,
                            value: '{broken json}',
                            mode: SchemaRendererMode.Form,
                            size: 'm',
                            view: 'stretch',
                            coerceInitialValues: true,
                            jsonDefaultValues: false,
                            validateOnBlur: false,
                            userContext: {},
                            showSubmit: true,
                            width: 600,
                        };
                    })(),
                },
                {
                    label: 'empty overview uses the empty value marker',
                    props: ((): SchemaFormProps => {
                        const schema = createSchema('cell');
                        return {
                            schema: schema,
                            value: undefined,
                            mode: SchemaRendererMode.Overview,
                            size: 'm',
                            view: 'stretch',
                            coerceInitialValues: true,
                            jsonDefaultValues: false,
                            validateOnBlur: false,
                            userContext: {},
                            showSubmit: false,
                            width: 600,
                        };
                    })(),
                },
            ];
            const additionalCases = stateCases.filter(({props}) => props.mode === mode);

            const grid = await mount(
                <MonacoSchemaFormGrid
                    caseHeight={420}
                    cases={[
                        ...rendererVariants.map(({layout, layoutName, size, view}) => {
                            const schema = createSchema(layout);
                            const label = `layout=${layoutName} / size=${size} / view=${view}`;
                            return {
                                label,
                                props: {
                                    schema: schema,
                                    value: value,
                                    mode: mode,
                                    size: size,
                                    view: view,
                                    coerceInitialValues: true,
                                    jsonDefaultValues: false,
                                    validateOnBlur: false,
                                    userContext: {},
                                    showSubmit: false,
                                    width: 600,
                                },
                            };
                        }),
                        ...additionalCases,
                    ]}
                />,
            );
            const cases = grid.getByTestId('schema-variant');
            await expect(cases).toHaveCount(rendererVariants.length + additionalCases.length);
            for (let index = 0; index < rendererVariants.length; index++) {
                const component = cases.nth(index);
                await expect(component.locator('.monaco-editor')).toBeVisible();
                await expect(component.locator('.view-lines')).toContainText('enabled');
            }
            if (mode === SchemaRendererMode.Form) {
                const component = grid.getByRole('region', {
                    name: 'editing JSON updates the form value',
                    exact: true,
                });

                const editor = component.locator('.monaco-editor textarea.inputarea');
                await expect(component.locator('.view-lines')).toContainText('enabled');
                await editor.click();
                const selectAll = await page.evaluate(() =>
                    navigator.userAgent.includes('Macintosh') ? 'Meta+A' : 'Control+A',
                );
                await editor.press(selectAll);
                await editor.press('Backspace');
                await expect(component.getByTestId('form-value')).toHaveText(JSON.stringify(''));
                await page.keyboard.type('{"enabled":false}');
                await expect(component.getByTestId('form-value')).toHaveText(
                    JSON.stringify('{"enabled":false}'),
                );
                await editor.blur();
            }
            if (mode === SchemaRendererMode.Form) {
                const component = grid.getByRole('region', {
                    name: 'disabled editor preserves its value',
                    exact: true,
                });

                await expect(component.locator('.monaco-editor')).toBeVisible();
                await component.locator('.monaco-editor textarea.inputarea').press('End');
                await page.keyboard.insertText('changed');
                await expect(component.getByTestId('form-value')).toHaveText(JSON.stringify(value));
            }
            if (mode === SchemaRendererMode.Overview) {
                const component = grid.getByRole('region', {
                    name: 'overview editor is read only',
                    exact: true,
                });

                await expect(component.locator('.view-lines')).toContainText('enabled');
                await component.locator('.monaco-editor textarea.inputarea').press('End');
                await page.keyboard.insertText('changed');
                await expect(component.getByTestId('form-value')).toHaveText(JSON.stringify(value));
            }
            if (mode === SchemaRendererMode.Form) {
                const component = grid.getByRole('region', {
                    name: 'invalid JSON can ignore editor validation without replacing the editor',
                    exact: true,
                });

                await expect(component.locator('.monaco-editor')).toBeVisible();
                await expect(component.locator('.view-lines')).toContainText('broken');
                await expect(component.getByTestId('input-dialog-toggler')).toHaveCount(0);
                await expect(component.getByTestId('form-value')).toHaveText(
                    JSON.stringify('{broken json}'),
                );
                await expect(component.locator('.squiggly-error').first()).toBeVisible();
                await component.getByRole('button', {name: 'Submit', exact: true}).click();
                await expect(component.locator('[data-sr-error="true"]')).toHaveCount(0);
            }
            if (mode === SchemaRendererMode.Form) {
                const component = grid.getByRole('region', {
                    name: 'editor diagnostics reach the form validation',
                    exact: true,
                });

                await expect(component.locator('.squiggly-error').first()).toBeVisible();
                await component.getByRole('button', {name: 'Submit', exact: true}).click();
                await expect(component.locator('[data-sr-error="true"]')).toContainText('Line 1');
            }
            if (mode === SchemaRendererMode.Overview) {
                const component = grid.getByRole('region', {
                    name: 'empty overview uses the empty value marker',
                    exact: true,
                });

                await expect(component.getByText('—', {exact: true})).toBeVisible();
            }
            await expectScreenshot({scale: 'css'});
        });
    }

    test('dialog opens the actual editor and closes again', async ({
        mount,
        page,
        expectScreenshot,
    }) => {
        const schema = createSchema('column');
        const component = await mount(
            <MonacoSchemaForm
                schema={schema}
                value={value}
                mode={SchemaRendererMode.Form}
                size="m"
                view="stretch"
                coerceInitialValues={true}
                jsonDefaultValues={false}
                validateOnBlur={false}
                userContext={{}}
                showSubmit={false}
                width={600}
            />,
        );
        await component.getByTestId('input-dialog-toggler').click();
        const dialog = page.getByRole('dialog');
        await expect(dialog.locator('.monaco-editor')).toBeVisible();
        await expect(dialog.locator('.view-lines')).toContainText('enabled');
        await expectScreenshot({component: dialog, screenshotName: 'Monaco expanded dialog'});
        await dialog.getByTestId('input-dialog-toggler').click();
        await expect(dialog).toBeHidden();
        await expect(component.locator('.monaco-editor')).toBeVisible();
    });
});
