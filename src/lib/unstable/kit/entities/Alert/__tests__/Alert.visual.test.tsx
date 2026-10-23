import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {schemaTest as test} from '~playwright/core';
import type {SchemaFormProps} from '~playwright/core/SchemaForm';
import {SchemaFormGrid, type SchemaFormGridProps} from '~playwright/core/SchemaFormGrid';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {SchemaRendererMode} from '../../../../core/constants';

import {createSchema, value} from './helpers';

test.describe('SchemaRenderer Alert', () => {
    for (const mode of [SchemaRendererMode.Form, SchemaRendererMode.Overview]) {
        test(`${mode} layouts sizes and views`, async ({mount, expectScreenshot}) => {
            const stateCases: SchemaFormGridProps['cases'] = [
                {
                    label: 'warning theme with custom icon',
                    props: ((): SchemaFormProps => {
                        const base = createSchema('row');
                        const schema = {
                            ...base,
                            nodeParameters: {
                                ...base.nodeParameters,
                                entityProps: {
                                    ...base.nodeParameters?.entityProps,
                                    theme: 'warning',
                                    iconName: 'CircleExclamation',
                                    iconProps: {size: 20},
                                },
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
                    label: 'danger theme with custom icon',
                    props: ((): SchemaFormProps => {
                        const base = createSchema('row');
                        const schema = {
                            ...base,
                            nodeParameters: {
                                ...base.nodeParameters,
                                entityProps: {
                                    ...base.nodeParameters?.entityProps,
                                    theme: 'danger',
                                    iconName: 'CircleExclamation',
                                    iconProps: {size: 20},
                                },
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
                    label: 'success theme with custom icon',
                    props: ((): SchemaFormProps => {
                        const base = createSchema('row');
                        const schema = {
                            ...base,
                            nodeParameters: {
                                ...base.nodeParameters,
                                entityProps: {
                                    ...base.nodeParameters?.entityProps,
                                    theme: 'success',
                                    iconName: 'CircleExclamation',
                                    iconProps: {size: 20},
                                },
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
                    label: 'title collapses and expands the message — Alert message collapsed',
                    props: ((): SchemaFormProps => {
                        const schema = createSchema('row');
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
                    label: 'title collapses and expands the message — Alert message expanded',
                    props: ((): SchemaFormProps => {
                        const schema = createSchema('row');
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
            ];
            const additionalCases = stateCases.filter(({props}) => props.mode === mode);

            const grid = await mount(
                <SchemaFormGrid
                    caseHeight={260}
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
                await expect(
                    component.getByText('Review the settings before saving.', {exact: true}),
                ).toBeVisible();
            }
            if (mode === SchemaRendererMode.Form) {
                const component = grid.getByRole('region', {
                    name: 'warning theme with custom icon',
                    exact: true,
                });

                await expect(component.getByText('Notice', {exact: true})).toBeVisible();
                await expect(
                    component.getByText('Review the settings before saving.', {exact: true}),
                ).toBeVisible();
            }
            if (mode === SchemaRendererMode.Form) {
                const component = grid.getByRole('region', {
                    name: 'danger theme with custom icon',
                    exact: true,
                });

                await expect(component.getByText('Notice', {exact: true})).toBeVisible();
                await expect(
                    component.getByText('Review the settings before saving.', {exact: true}),
                ).toBeVisible();
            }
            if (mode === SchemaRendererMode.Form) {
                const component = grid.getByRole('region', {
                    name: 'success theme with custom icon',
                    exact: true,
                });

                await expect(component.getByText('Notice', {exact: true})).toBeVisible();
                await expect(
                    component.getByText('Review the settings before saving.', {exact: true}),
                ).toBeVisible();
            }
            if (mode === SchemaRendererMode.Form) {
                const component = grid.getByRole('region', {
                    name: 'title collapses and expands the message — Alert message collapsed',
                    exact: true,
                });

                await component.getByText('Notice', {exact: true}).click();
                await expect(component.locator('.sr-alert__message')).toBeHidden();
            }
            if (mode === SchemaRendererMode.Form) {
                const component = grid.getByRole('region', {
                    name: 'title collapses and expands the message — Alert message expanded',
                    exact: true,
                });

                await component.getByText('Notice', {exact: true}).click();
                await expect(component.locator('.sr-alert__message')).toBeHidden();
                await component.getByText('Notice', {exact: true}).click();
                await expect(component.locator('.sr-alert__message')).toBeVisible();
            }
            await expectScreenshot({scale: 'css'});
        });
    }
});
