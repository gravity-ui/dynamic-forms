import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {schemaTest as test} from '~playwright/core';
import {SchemaFormGrid, type SchemaFormGridProps} from '~playwright/core/SchemaFormGrid';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {SchemaRendererMode} from '../../../../core/constants';

import {schema, value} from './helpers';

test.describe('SchemaRenderer TextAreaInput', () => {
    test('layouts sizes and views', async ({mount, expectScreenshot}) => {
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
                label: 'edits and clears the value — edited',
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
                label: 'edits and clears the value — cleared',
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
                label: 'empty placeholder',
                props: {
                    schema: schema,
                    value: undefined,
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
                label: 'reports minimum length after submit',
                props: {
                    schema: {
                        ...schema,
                        minLength: 5,
                        nodeParameters: {
                            ...schema.nodeParameters,
                            errorMessages: {minLength: 'At least five characters'},
                        },
                    },
                    value: 'ab',
                    mode: SchemaRendererMode.Form,
                    size: 'm',
                    view: 'stretch',
                    coerceInitialValues: true,
                    jsonDefaultValues: false,
                    validateOnBlur: false,
                    userContext: {},
                    showSubmit: true,
                    width: 600,
                },
            },
        ];
        const additionalCases = stateCases;

        const grid = await mount(
            <SchemaFormGrid
                caseHeight={240}
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
                name: 'edits and clears the value — edited',
                exact: true,
            });

            await component.getByRole('textbox').fill('Updated description\nwith another line');
            await expect(component.getByTestId('form-value')).toHaveText(
                JSON.stringify('Updated description\nwith another line'),
            );
        }
        {
            const component = grid.getByRole('region', {
                name: 'edits and clears the value — cleared',
                exact: true,
            });

            await component.getByRole('textbox').fill('Updated description\nwith another line');
            await expect(component.getByTestId('form-value')).toHaveText(
                JSON.stringify('Updated description\nwith another line'),
            );
            await component.getByRole('button', {name: 'Clear', exact: true}).click();
            await expect(component.getByRole('textbox')).toHaveValue('');
            await expect(component.getByTestId('form-value')).toHaveText(JSON.stringify(''));
        }
        {
            const component = grid.getByRole('region', {name: 'empty placeholder', exact: true});

            await expect(component.getByRole('textbox')).toHaveValue('');
            await expect(component.getByRole('textbox')).toHaveAttribute(
                'placeholder',
                schema.examples![0],
            );
        }
        {
            const component = grid.getByRole('region', {
                name: 'reports minimum length after submit',
                exact: true,
            });

            await component.getByRole('button', {name: 'Submit', exact: true}).click();
            await expect(component.locator('[data-sr-error]')).toHaveText(
                'At least five characters',
            );
        }
        await expectScreenshot({scale: 'css'});
    });
});
