import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import type {SchemaFormProps} from '~playwright/core/SchemaForm';
import {SchemaFormGrid, type SchemaFormGridProps} from '~playwright/core/SchemaFormGrid';
import {expectInsideScreenshot} from '~playwright/core/expectInsideScreenshot';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {JsonSchemaType, NodeType, SchemaRendererMode} from '../../../../core/constants';

import {createSchema, value} from './helpers';

test.describe('SchemaRenderer OneOfNested', () => {
    for (const mode of [SchemaRendererMode.Form, SchemaRendererMode.Overview]) {
        test(`${mode} layouts sizes and views`, async ({mount, page, expectScreenshot}) => {
            const stateCases: SchemaFormGridProps['cases'] = [
                {
                    label: 'switching branches discards the previous branch value',
                    props: ((): SchemaFormProps => {
                        const schema = createSchema('section');
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
                    label: 'select toggler and order can start from a different branch',
                    props: ((): SchemaFormProps => {
                        const base = createSchema('section');
                        const schema = {
                            ...base,
                            nodeParameters: {
                                ...base.nodeParameters,
                                entityProps: {
                                    order: ['age', 'name'],
                                    withIndent: false,
                                    toggler: {
                                        type: JsonSchemaType.String,
                                        title: 'Field',
                                        enum: ['name', 'age'],
                                        nodeParameters: {
                                            type: NodeType.String,
                                            entity: 'select',
                                            layout: 'row',
                                            entityProps: {
                                                enumDescriptions: {name: 'Name', age: 'Age'},
                                            },
                                        },
                                    },
                                },
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
                                    width: 1000,
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
                if (mode === SchemaRendererMode.Form) {
                    await expect(component.getByTestId('input.name').locator('input')).toHaveValue(
                        'Ada',
                    );
                } else {
                    await expect(component.getByText('Ada', {exact: true})).toBeVisible();
                }
                const frame = component;
                if (mode === SchemaRendererMode.Form) {
                    for (const qa of ['input.name']) {
                        await expectInsideScreenshot(
                            component.getByTestId(qa).locator('input'),
                            frame,
                        );
                    }
                } else {
                    for (const text of ['Ada']) {
                        await expectInsideScreenshot(
                            component.getByText(text, {exact: true}),
                            frame,
                        );
                    }
                }
            }
            if (mode === SchemaRendererMode.Form) {
                const component = grid.getByRole('region', {
                    name: 'switching branches discards the previous branch value',
                    exact: true,
                });

                await component.getByRole('switch').press('Space');
                await component.getByTestId('input.age').locator('input').fill('37');
                await component.getByTestId('input.age').locator('input').blur();
                await expect(component.getByTestId('input.name')).toHaveCount(0);
                await expect(component.getByTestId('form-value')).toHaveText('{"age":37}');
            }
            if (mode === SchemaRendererMode.Form) {
                const component = grid.getByRole('region', {
                    name: 'select toggler and order can start from a different branch',
                    exact: true,
                });

                await expect(component.getByTestId('input.age').locator('input')).toBeVisible();
                await component.getByRole('combobox').click();
                await page.getByRole('option', {name: 'Name', exact: true}).click();
                await component.getByTestId('input.name').locator('input').fill('Grace');
                await expect(component.getByTestId('form-value')).toHaveText('{"name":"Grace"}');
            }
            await expectScreenshot({scale: 'css'});
        });
    }
});
