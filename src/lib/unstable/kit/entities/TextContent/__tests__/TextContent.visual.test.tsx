import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import type {SchemaFormProps} from '~playwright/core/SchemaForm';
import {SchemaFormGrid, type SchemaFormGridProps} from '~playwright/core/SchemaFormGrid';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {SchemaRendererMode} from '../../../../core/constants';

import {createSchema, value} from './helpers';

test.describe('SchemaRenderer TextContent', () => {
    for (const mode of [SchemaRendererMode.Form, SchemaRendererMode.Overview]) {
        test(`${mode} layouts sizes and views`, async ({mount, expectScreenshot}) => {
            const stateCases: SchemaFormGridProps['cases'] = [
                {
                    label: 'description fallback with empty input',
                    props: ((): SchemaFormProps => {
                        const base = createSchema('row');
                        const schema = {
                            ...base,
                            description: '<strong>Unspecified</strong> status',
                            nodeParameters: {
                                ...base.nodeParameters,
                                entityProps: {iconName: 'CircleInfo', iconProps: {size: 20}},
                            },
                        };
                        return {
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
                        };
                    })(),
                },
                {
                    label: 'custom title and long value',
                    props: ((): SchemaFormProps => {
                        const base = createSchema('column');
                        const schema = {
                            ...base,
                            nodeParameters: {
                                ...base.nodeParameters,
                                entityProps: {
                                    title: '<em>Build</em> status',
                                    theme: 'warning',
                                    iconName: 'Clock',
                                },
                            },
                        };
                        return {
                            schema: schema,
                            value: 'Waiting for the deployment approval from the maintenance team',
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
                <SchemaFormGrid
                    columns={4}
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
                await expect(component.getByText('Passed', {exact: true})).toBeVisible();
            }
            if (mode === SchemaRendererMode.Form) {
                const component = grid.getByRole('region', {
                    name: 'description fallback with empty input',
                    exact: true,
                });
                await expect(
                    component
                        .locator('.g-label.sr-text-content')
                        .getByText('Unspecified status', {exact: true}),
                ).toBeVisible();
            }
            if (mode === SchemaRendererMode.Overview) {
                const component = grid.getByRole('region', {
                    name: 'custom title and long value',
                    exact: true,
                });
                await expect(component.getByText('Build status', {exact: true})).toBeVisible();
                await expect(
                    component.getByText(
                        'Waiting for the deployment approval from the maintenance team',
                        {
                            exact: true,
                        },
                    ),
                ).toBeVisible();
            }
            await expectScreenshot({scale: 'css'});
        });
    }
});
