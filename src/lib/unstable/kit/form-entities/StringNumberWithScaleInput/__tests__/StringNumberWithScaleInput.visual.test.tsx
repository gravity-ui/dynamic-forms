import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {schemaTest as test} from '~playwright/core';
import {SchemaFormGrid, type SchemaFormGridProps} from '~playwright/core/SchemaFormGrid';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {SchemaRendererMode} from '../../../../core/constants';

import {schema, value} from './helpers';

test.describe('SchemaRenderer StringNumberWithScaleInput', () => {
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
                label: 'converts an edited display value to base units',
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
                label: 'changing scale preserves the base value',
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
                label: 'without scale renders just the input',
                props: {
                    schema: {
                        ...schema,
                        nodeParameters: {...schema.nodeParameters, entityProps: {}},
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
                label: 'omitting viewType uses defaultType',
                props: {
                    schema: {
                        ...schema,
                        nodeParameters: {
                            ...schema.nodeParameters,
                            entityProps: {
                                ...schema.nodeParameters?.entityProps,
                                viewType: undefined,
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
                label: 'large negative decimal strings keep precision during scaling',
                props: {
                    schema: {
                        ...schema,
                        stringNumber: {
                            ...schema.stringNumber,
                            minimum: '-999999999999999999',
                            maximum: '999999999999999999',
                            multipleOf: '0.001',
                        },
                    },
                    value: '-123456789012345.125',
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
                name: 'converts an edited display value to base units',
                exact: true,
            });

            await expect(component.getByRole('textbox')).toHaveValue('1.5');
            await component.getByRole('textbox').fill('2.125');
            await component.getByRole('textbox').blur();
            await expect(component.getByTestId('form-value')).toHaveText('"2125"');
        }
        {
            const component = grid.getByRole('region', {
                name: 'changing scale preserves the base value',
                exact: true,
            });

            await component.locator('button[aria-haspopup="listbox"]').click();
            await page.getByRole('option', {name: 'm', exact: true}).click();
            await expect(component.getByRole('textbox')).toHaveValue('1500');
            await expect(component.getByTestId('form-value')).toHaveText(JSON.stringify(value));
        }
        {
            const component = grid.getByRole('region', {
                name: 'without scale renders just the input',
                exact: true,
            });

            await expect(component.getByRole('textbox')).toHaveValue('1500');
            await expect(component.locator('button[aria-haspopup="listbox"]')).toHaveCount(0);
        }
        {
            const component = grid.getByRole('region', {
                name: 'omitting viewType uses defaultType',
                exact: true,
            });

            await expect(component.getByRole('textbox')).toHaveValue('1500');
            await expect(component.locator('button[aria-haspopup="listbox"]')).toHaveText('m');
            await expect(component.getByTestId('form-value')).toHaveText(JSON.stringify(value));
        }
        {
            const component = grid.getByRole('region', {
                name: 'large negative decimal strings keep precision during scaling',
                exact: true,
            });

            await expect(component.getByRole('textbox')).toHaveValue('-123456789012.345125');
            await component.getByRole('textbox').fill('-123456789012.345126');
            await component.getByRole('textbox').blur();
            await expect(component.getByTestId('form-value')).toHaveText('"-123456789012345.126"');
            await component.locator('button[aria-haspopup="listbox"]').click();
            await page.getByRole('option', {name: 'm', exact: true}).click();
            await expect(component.getByRole('textbox')).toHaveValue('-123456789012345.126');
            await expect(component.getByTestId('form-value')).toHaveText('"-123456789012345.126"');
        }
        await expectScreenshot({scale: 'css'});
    });
});
