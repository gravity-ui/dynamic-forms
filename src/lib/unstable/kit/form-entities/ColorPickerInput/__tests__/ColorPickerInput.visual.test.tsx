import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {schemaTest as test} from '~playwright/core';
import {SchemaFormGrid, type SchemaFormGridProps} from '~playwright/core/SchemaFormGrid';
import {expectPopupInCell, fitGridInViewport} from '~playwright/core/popupGrid';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {SchemaRendererMode} from '../../../../core/constants';

import {schema, value} from './helpers';

test.describe('SchemaRenderer ColorPickerInput', () => {
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
                label: 'editing hex updates the value',
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
                label: 'compact alpha picker popup',
                height: 380,
                props: {
                    schema: {
                        ...schema,
                        nodeParameters: {
                            ...schema.nodeParameters,
                            entityProps: {
                                withAlpha: true,
                                compact: true,
                                popupPlacement: 'bottom-start',
                            },
                        },
                    },
                    value: '#5282ff80',
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
                caseHeight={220}
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
            await expect(component.getByRole('textbox')).toBeVisible();
            await expect(component.getByTestId('form-value')).toHaveText(
                JSON.stringify(value) ?? '',
            );
        }
        {
            const component = grid.getByRole('region', {
                name: 'disabled preserves the value',
                exact: true,
            });

            await expect(component.getByRole('textbox')).toBeDisabled();
            await expect(component.getByTestId('form-value')).toHaveText(
                JSON.stringify(value) ?? '',
            );
        }
        {
            const component = grid.getByRole('region', {
                name: 'editing hex updates the value',
                exact: true,
            });

            await component.getByRole('textbox').fill('ff0000');
            await component.getByRole('textbox').blur();
            await expect(component.getByTestId('form-value')).toHaveText('"#ff0000"');
        }
        await fitGridInViewport(page, grid);
        const component = grid.getByRole('region', {
            name: 'compact alpha picker popup',
            exact: true,
        });
        const control = component.locator('.g-color-picker__color-swatch');
        await control.click();
        await expect(component.getByRole('textbox')).toHaveCount(0);
        await expectPopupInCell(page.locator('.g-color-picker__popup'), component, control);
        await page.mouse.move(0, 0);
        await expectScreenshot({scale: 'css'});
    });
});
