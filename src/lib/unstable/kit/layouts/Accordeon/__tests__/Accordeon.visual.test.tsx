import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {schemaTest as test} from '~playwright/core';
import {SchemaForm, type SchemaFormProps} from '~playwright/core/SchemaForm';
import {SchemaFormGrid, type SchemaFormGridProps} from '~playwright/core/SchemaFormGrid';
import {rendererSizes, rendererViews} from '~playwright/core/schemaRendererVariants';

import {JsonSchemaType, NodeType, SchemaRendererMode} from '../../../../core/constants';
import type {JsonSchemaString} from '../../../../core/types';

const modes = [SchemaRendererMode.Form, SchemaRendererMode.Overview];
const baseSchema: JsonSchemaString = {
    type: JsonSchemaType.String,
    title: 'Service name',
    description: 'Name shown to other team members',
    nodeParameters: {
        type: NodeType.String,
        entity: 'base',
        layout: 'accordeon',
        flags: {open: true},
    },
};

test.describe('Accordeon', () => {
    for (const mode of modes) {
        test(`${mode} sizes and views`, async ({mount, expectScreenshot}) => {
            const stateCases: SchemaFormGridProps['cases'] = [
                {
                    label: 'closed layout expands and collapses without losing the value — Collapsed',
                    props: ((): SchemaFormProps => {
                        const schema: JsonSchemaString = {
                            ...baseSchema,
                            nodeParameters: {
                                ...baseSchema.nodeParameters,
                                flags: {open: false},
                            },
                        };
                        const value = 'Preserved value';
                        const mode = SchemaRendererMode.Form;
                        const size = 'l';
                        const view = 'fit';
                        return {
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
                        };
                    })(),
                },
                {
                    label: 'closed layout expands and collapses without losing the value — Expanded',
                    props: ((): SchemaFormProps => {
                        const schema: JsonSchemaString = {
                            ...baseSchema,
                            nodeParameters: {
                                ...baseSchema.nodeParameters,
                                flags: {open: false},
                            },
                        };
                        const value = 'Preserved value';
                        const mode = SchemaRendererMode.Form;
                        const size = 'l';
                        const view = 'fit';
                        return {
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
                        };
                    })(),
                },
                {
                    label: 'default summary and indent',
                    props: ((): SchemaFormProps => {
                        const schema: JsonSchemaString = {
                            ...baseSchema,
                            nodeParameters: {
                                ...baseSchema.nodeParameters,
                                layoutProps: {
                                    withDefaultSummary: true,
                                    withIndent: true,
                                    titleProps: {color: 'secondary'},
                                    togglerProps: {view: 'outlined'},
                                },
                            },
                        };
                        const value = 'Gravity service';
                        const mode = SchemaRendererMode.Form;
                        const size = 'xl';
                        const view = 'stretch';
                        return {
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
                        };
                    })(),
                },
                {
                    label: 'custom summary applies toggler props',
                    props: ((): SchemaFormProps => {
                        const schema: JsonSchemaString = {
                            ...baseSchema,
                            nodeParameters: {
                                ...baseSchema.nodeParameters,
                                flags: {open: true},
                                layoutProps: {
                                    withDefaultSummary: false,
                                    togglerProps: {view: 'outlined', disabled: true},
                                },
                            },
                        };
                        return {
                            schema: schema,
                            value: 'Visible in disabled summary',
                            mode: SchemaRendererMode.Form,
                            size: 'xl',
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

            const schema = baseSchema;
            const value = 'Gravity service';
            const variants = rendererSizes.flatMap((size) =>
                rendererViews.map((view) => ({size, view})),
            );
            const grid = await mount(
                <SchemaFormGrid
                    caseHeight={mode === SchemaRendererMode.Form ? 180 : 160}
                    cases={[
                        ...variants.map(({size, view}) => {
                            const label = `size=${size} / view=${view}`;
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
            await expect(cases).toHaveCount(variants.length + additionalCases.length);
            for (let index = 0; index < variants.length; index++) {
                const component = cases.nth(index);
                if (mode === SchemaRendererMode.Form) {
                    await expect(component.getByRole('textbox')).toHaveValue(value);
                } else {
                    await expect(component.getByText(value, {exact: true})).toBeVisible();
                }
            }
            if (mode === SchemaRendererMode.Form) {
                const component = grid.getByRole('region', {
                    name: 'closed layout expands and collapses without losing the value — Collapsed',
                    exact: true,
                });

                await expect(component.getByRole('textbox')).not.toBeVisible();
            }
            if (mode === SchemaRendererMode.Form) {
                const component = grid.getByRole('region', {
                    name: 'closed layout expands and collapses without losing the value — Expanded',
                    exact: true,
                });
                const value = 'Preserved value';
                await expect(component.getByRole('textbox')).not.toBeVisible();
                await component.getByRole('button').first().click();
                await expect(component.getByRole('textbox')).toHaveValue(value);
            }
            if (mode === SchemaRendererMode.Form) {
                const component = grid.getByRole('region', {
                    name: 'default summary and indent',
                    exact: true,
                });
                const value = 'Gravity service';
                await expect(component.getByRole('textbox')).toHaveValue(value);
            }
            if (mode === SchemaRendererMode.Form) {
                const component = grid.getByRole('region', {
                    name: 'custom summary applies toggler props',
                    exact: true,
                });

                const toggler = component.getByRole('button', {name: 'Service name', exact: true});
                await expect(toggler).toBeDisabled();
                await expect(toggler).toHaveClass(/g-button_view_outlined/);
                await expect(component.getByRole('textbox')).toHaveValue(
                    'Visible in disabled summary',
                );
            }
            await expectScreenshot({scale: 'css'});
        });
    }

    test('closed layout expands and collapses without losing the value', async ({mount}) => {
        const schema: JsonSchemaString = {
            ...baseSchema,
            nodeParameters: {
                ...baseSchema.nodeParameters,
                flags: {open: false},
            },
        };
        const value = 'Preserved value';
        const mode = SchemaRendererMode.Form;
        const size = 'l';
        const view = 'fit';
        const component = await mount(
            <SchemaForm
                schema={schema}
                value={value}
                mode={mode}
                size={size}
                view={view}
                coerceInitialValues={true}
                jsonDefaultValues={false}
                validateOnBlur={false}
                userContext={{}}
                showSubmit={false}
                width={600}
            />,
        );
        await expect(component.getByRole('textbox')).not.toBeVisible();

        await component.getByRole('button').first().click();
        await expect(component.getByRole('textbox')).toHaveValue(value);

        await component.getByRole('button').first().click();
        await expect(component.getByRole('textbox')).not.toBeVisible();
        await expect(component.getByTestId('form-value')).toHaveText(JSON.stringify(value));
    });
});
