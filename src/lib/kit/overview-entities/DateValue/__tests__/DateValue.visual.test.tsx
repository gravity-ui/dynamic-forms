import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {schemaTest as test} from '~playwright/core';
import type {SchemaFormProps} from '~playwright/core/SchemaForm';
import {SchemaFormGrid, type SchemaFormGridProps} from '~playwright/core/SchemaFormGrid';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {SchemaRendererMode} from '../../../../core/constants';

import {createSchema, value} from './helpers';

test.describe('SchemaRenderer DateValue', () => {
    for (const mode of [SchemaRendererMode.Overview]) {
        test(`${mode} layouts sizes and views`, async ({mount, expectScreenshot}) => {
            const stateCases: SchemaFormGridProps['cases'] = [
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
                {
                    label: 'explicit timezone converts the displayed time',
                    props: ((): SchemaFormProps => {
                        const base = createSchema('row');
                        const schema = {
                            ...base,
                            nodeParameters: {
                                ...base.nodeParameters,
                                entityProps: {
                                    format: 'YYYY-MM-DD HH:mm',
                                    timeZone: 'America/New_York',
                                },
                            },
                        };
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
                    label: 'custom input and output formats',
                    props: ((): SchemaFormProps => {
                        const base = createSchema('row');
                        const schema = {
                            ...base,
                            nodeParameters: {
                                ...base.nodeParameters,
                                entityProps: {
                                    format: 'DD MMM YYYY',
                                    outputFormat: 'YYYY/MM/DD',
                                    timeZone: 'UTC',
                                },
                            },
                        };
                        return {
                            schema: schema,
                            value: '2020/01/02',
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
                    label: 'seconds object is formatted as a date',
                    props: ((): SchemaFormProps => {
                        const schema = createSchema('row');
                        return {
                            schema: schema,
                            value: {seconds: 1577934240},
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
                    label: 'invalid value uses the empty value marker',
                    props: ((): SchemaFormProps => {
                        const schema = createSchema('cell');
                        return {
                            schema: schema,
                            value: 'not-a-valid-value',
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
                    caseHeight={200}
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
                await expect(component.getByTestId('input')).toHaveText('2020-01-02 03:04');
            }
            if (mode === SchemaRendererMode.Overview) {
                const component = grid.getByRole('region', {
                    name: 'empty overview uses the empty value marker',
                    exact: true,
                });
                await expect(component.getByText('—', {exact: true})).toBeVisible();
            }
            if (mode === SchemaRendererMode.Overview) {
                const component = grid.getByRole('region', {
                    name: 'explicit timezone converts the displayed time',
                    exact: true,
                });
                await expect(component.getByTestId('input')).toHaveText('2020-01-01 22:04');
            }
            if (mode === SchemaRendererMode.Overview) {
                const component = grid.getByRole('region', {
                    name: 'custom input and output formats',
                    exact: true,
                });
                await expect(component.getByTestId('input')).toHaveText('02 Jan 2020');
            }
            if (mode === SchemaRendererMode.Overview) {
                const component = grid.getByRole('region', {
                    name: 'seconds object is formatted as a date',
                    exact: true,
                });
                await expect(component.getByTestId('input')).toHaveText('2020-01-02 03:04');
            }
            if (mode === SchemaRendererMode.Overview) {
                const component = grid.getByRole('region', {
                    name: 'invalid value uses the empty value marker',
                    exact: true,
                });
                await expect(component.getByText('—', {exact: true})).toBeVisible();
            }
            await expectScreenshot({scale: 'css'});
        });
    }
});
