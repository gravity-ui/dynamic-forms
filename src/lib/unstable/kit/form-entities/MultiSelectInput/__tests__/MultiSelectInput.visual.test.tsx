import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {schemaTest as test} from '~playwright/core';
import type {SchemaFormProps} from '~playwright/core/SchemaForm';
import {SchemaFormGrid, type SchemaFormGridProps} from '~playwright/core/SchemaFormGrid';
import {expectPopupInCell, fitGridInViewport, getSelectPopup} from '~playwright/core/popupGrid';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {JsonSchemaType, SchemaRendererMode} from '../../../../core/constants';

import {schema, value} from './helpers';

test.describe('SchemaRenderer MultiSelectInput', () => {
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
                label: 'selection updates the form and clear removes it — selected',
                props: {
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
                },
            },
            {
                label: 'selection updates the form and clear removes it — cleared',
                props: {
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
                },
            },
            {
                label: 'filtering more than nine options selects the matching value',
                props: ((): SchemaFormProps => {
                    const options = Array.from({length: 12}, (_, index) => `choice-${index + 1}`);
                    return {
                        schema: {...schema, items: {type: JsonSchemaType.String, enum: options}},
                        value: ['choice-1'],
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
                label: 'open filtered options',

                props: ((): SchemaFormProps => {
                    const options = Array.from({length: 12}, (_, index) => `choice-${index + 1}`);
                    return {
                        schema: {
                            ...schema,
                            items: {type: JsonSchemaType.String, enum: options},
                            nodeParameters: {
                                ...schema.nodeParameters,
                                entityProps: {
                                    ...schema.nodeParameters?.entityProps,
                                    open: true,
                                    filter: 'choice-10',
                                    popupPlacement: 'bottom-start',
                                },
                            },
                        },
                        value: ['choice-1'],
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
        ];
        const additionalCases = stateCases;

        const grid = await mount(
            <SchemaFormGrid
                caseHeight={360}
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
                                        entityProps: {
                                            ...schema.nodeParameters?.entityProps,
                                            open: true,
                                            popupPlacement: 'bottom-start',
                                        },
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
        await fitGridInViewport(page, grid);
        const cases = grid.getByTestId('schema-variant');
        await expect(cases).toHaveCount(rendererVariants.length + additionalCases.length);
        for (let index = 0; index < rendererVariants.length; index++) {
            const component = cases.nth(index);
            await expect(component.getByTestId('input')).toBeVisible();
            await expect(component.getByTestId('form-value')).toHaveText(
                JSON.stringify(value) ?? '',
            );
        }
        {
            const component = grid.getByRole('region', {
                name: 'disabled preserves the value',
                exact: true,
            });

            await expect(component.getByTestId('input')).toBeDisabled();
            await expect(component.getByTestId('form-value')).toHaveText(
                JSON.stringify(value) ?? '',
            );
        }
        {
            const component = grid.getByRole('region', {
                name: 'selection updates the form and clear removes it — selected',
                exact: true,
            });

            await component.getByTestId('input').click();
            const popup = await getSelectPopup(page, component.getByTestId('input'));
            await popup.getByRole('option', {name: /Beta/}).click();
            await page.keyboard.press('Escape');
            await expect(component.getByTestId('form-value')).toHaveText('["alpha","beta"]');
        }
        {
            const component = grid.getByRole('region', {
                name: 'selection updates the form and clear removes it — cleared',
                exact: true,
            });

            await component.getByTestId('input').click();
            const popup = await getSelectPopup(page, component.getByTestId('input'));
            await popup.getByRole('option', {name: /Beta/}).click();
            await page.keyboard.press('Escape');
            await expect(component.getByTestId('form-value')).toHaveText('["alpha","beta"]');
            await component.getByRole('button', {name: 'Clear', exact: true}).click();
            await expect(component.getByTestId('form-value')).toHaveText('[]');
        }
        {
            const component = grid.getByRole('region', {
                name: 'filtering more than nine options selects the matching value',
                exact: true,
            });
            await component.getByTestId('input').click();
            const popup = await getSelectPopup(page, component.getByTestId('input'));
            await popup.getByRole('combobox', {name: 'Filter', exact: true}).fill('choice-10');
            await expect(popup.getByRole('option')).toHaveCount(1);
            await expect(popup.getByRole('option', {name: 'choice-10', exact: true})).toBeVisible();
            await popup.getByRole('option', {name: 'choice-10', exact: true}).click();
            await page.keyboard.press('Escape');
            await expect(component.getByTestId('form-value')).toHaveText(
                '["choice-1","choice-10"]',
            );
        }
        // Restore the viewport after interactions that may scroll to a control.
        await fitGridInViewport(page, grid);
        for (let index = 0; index < rendererVariants.length; index++) {
            const cell = cases.nth(index);
            const control = cell.getByTestId('input');
            const popup = await getSelectPopup(page, control);
            await expect(popup.getByRole('option', {name: /Beta/})).toBeVisible();
            await expect(popup.getByText('The second team', {exact: true})).toBeVisible();
            await expectPopupInCell(popup, cell, control);
        }
        const filteredCell = grid.getByRole('region', {name: 'open filtered options', exact: true});
        const filteredControl = filteredCell.getByTestId('input');
        const filteredPopup = await getSelectPopup(page, filteredControl);
        await expect(
            filteredPopup.getByRole('combobox', {name: 'Filter', exact: true}),
        ).toHaveValue('choice-10');
        await expect(filteredPopup.getByRole('option')).toHaveCount(1);
        await expect(
            filteredPopup.getByRole('option', {name: 'choice-10', exact: true}),
        ).toBeVisible();
        await expectPopupInCell(filteredPopup, filteredCell, filteredControl);
        await page.mouse.move(0, 0);
        await expectScreenshot({scale: 'css'});
    });
});
