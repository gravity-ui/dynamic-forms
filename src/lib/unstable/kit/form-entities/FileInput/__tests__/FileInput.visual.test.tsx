import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import {SchemaFormGrid, type SchemaFormGridProps} from '~playwright/core/SchemaFormGrid';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {SchemaRendererMode} from '../../../../core/constants';

import {schema, value} from './helpers';

test.describe('SchemaRenderer FileInput', () => {
    test('layouts sizes and views', async ({mount, page, expectScreenshot}) => {
        const stateCases: SchemaFormGridProps['cases'] = [
            {
                label: 'disabled preserves the value',
                props: {
                    schema: {
                        ...schema,
                        nodeParameters: {
                            ...schema.nodeParameters,
                            flags: {open: true, disabled: true},
                        },
                    },
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
                },
            },
            {
                label: 'readAsText uploads file content and removes the file — uploaded',
                props: {
                    schema: {
                        ...schema,
                        nodeParameters: {
                            ...schema.nodeParameters,
                            entityProps: {readAsMethod: 'readAsText', accept: ['text/plain']},
                        },
                    },
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
                },
            },
            {
                label: 'readAsText uploads file content and removes the file — removed',
                props: {
                    schema: {
                        ...schema,
                        nodeParameters: {
                            ...schema.nodeParameters,
                            entityProps: {readAsMethod: 'readAsText', accept: ['text/plain']},
                        },
                    },
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
                },
            },
            {
                label: 'readAsBinaryString uploads file content',
                props: {
                    schema: {
                        ...schema,
                        nodeParameters: {
                            ...schema.nodeParameters,
                            entityProps: {
                                readAsMethod: 'readAsBinaryString',
                                accept: ['text/plain'],
                            },
                        },
                    },
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
                },
            },
            {
                label: 'readAsDataURL uploads file content',
                props: {
                    schema: {
                        ...schema,
                        nodeParameters: {
                            ...schema.nodeParameters,
                            entityProps: {readAsMethod: 'readAsDataURL', accept: ['text/plain']},
                        },
                    },
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
                },
            },
        ];
        const additionalCases = stateCases;

        const grid = await mount(
            <SchemaFormGrid
                columns={4}
                cases={[
                    ...rendererVariants.map((variant) => {
                        const label = `layout=${variant.layoutName} / size=${variant.size} / view=${variant.view}`;
                        return {
                            label,
                            props: {
                                schema: {
                                    ...schema,
                                    nodeParameters: {
                                        ...schema.nodeParameters,
                                        layout: variant.layout,
                                        flags: {open: true},
                                    },
                                },
                                value: value,
                                mode: SchemaRendererMode.Form,
                                size: variant.size,
                                view: variant.view,
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
            await expect(component.locator('.g-file-drop-zone')).toBeVisible();
            await expect(component.getByTestId('form-value')).toHaveText(
                JSON.stringify(value) ?? '',
            );
        }
        {
            const component = grid.getByRole('region', {
                name: 'disabled preserves the value',
                exact: true,
            });

            const dropZone = component.locator('.g-file-drop-zone');
            await expect(dropZone).toHaveClass(/g-file-drop-zone_disabled/);
            await expect(dropZone).toHaveCSS('pointer-events', 'none');
            await expect(component.getByTestId('form-value')).toHaveText(
                JSON.stringify(value) ?? '',
            );
        }
        {
            const component = grid.getByRole('region', {
                name: 'readAsText uploads file content and removes the file — uploaded',
                exact: true,
            });

            const fileInput = component.locator('input[type="file"]');
            await expect(fileInput).toHaveAttribute('accept', 'text/plain');
            await fileInput.setInputFiles({
                name: 'config.txt',
                mimeType: 'text/plain',
                buffer: Buffer.from('service=gravity'),
            });
            await expect(component.getByText('config.txt', {exact: true})).toBeVisible();
            await expect(component.getByTestId('form-value')).toHaveText(
                JSON.stringify('service=gravity'),
            );
        }
        {
            const component = grid.getByRole('region', {
                name: 'readAsText uploads file content and removes the file — removed',
                exact: true,
            });

            const fileInput = component.locator('input[type="file"]');
            await expect(fileInput).toHaveAttribute('accept', 'text/plain');
            await fileInput.setInputFiles({
                name: 'config.txt',
                mimeType: 'text/plain',
                buffer: Buffer.from('service=gravity'),
            });
            await expect(component.getByText('config.txt', {exact: true})).toBeVisible();
            await expect(component.getByTestId('form-value')).toHaveText(
                JSON.stringify('service=gravity'),
            );
            const preview = component.locator('.g-file-preview');
            await preview.hover();
            await preview.getByRole('button').click();
            await expect(component.locator('.g-file-drop-zone')).toBeVisible();
            await expect(component.getByTestId('form-value')).toHaveText('');
        }
        {
            const component = grid.getByRole('region', {
                name: 'readAsBinaryString uploads file content',
                exact: true,
            });

            const fileInput = component.locator('input[type="file"]');
            const content = Buffer.from('Сервис Gravity 🌍', 'utf8');
            await fileInput.setInputFiles({
                name: 'config.txt',
                mimeType: 'text/plain',
                buffer: content,
            });
            await expect(component.getByText('config.txt', {exact: true})).toBeVisible();
            await expect(component.getByTestId('form-value')).toHaveText(
                JSON.stringify(content.toString('latin1')),
            );
        }
        {
            const component = grid.getByRole('region', {
                name: 'readAsDataURL uploads file content',
                exact: true,
            });

            const fileInput = component.locator('input[type="file"]');
            await fileInput.setInputFiles({
                name: 'config.txt',
                mimeType: 'text/plain',
                buffer: Buffer.from('service=gravity'),
            });
            await expect(component.getByText('config.txt', {exact: true})).toBeVisible();
            await expect(component.getByTestId('form-value')).toHaveText(
                JSON.stringify('data:text/plain;base64,c2VydmljZT1ncmF2aXR5'),
            );
        }
        // Removing the preview leaves the pointer over the new drop zone.
        await page.mouse.move(0, 0);
        await expectScreenshot({scale: 'css'});
    });
});
