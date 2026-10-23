import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import type {SchemaFormProps} from '~playwright/core/SchemaForm';
import {SchemaFormGrid, type SchemaFormGridProps} from '~playwright/core/SchemaFormGrid';
import {expectInsideScreenshot} from '~playwright/core/expectInsideScreenshot';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {JsonSchemaType, NodeType, SchemaRendererMode} from '../../../../core/constants';
import type {JsonSchema} from '../../../../core/types';

import {createSchema, value} from './helpers';

test.describe('SchemaRenderer ArrayTable', () => {
    for (const mode of [SchemaRendererMode.Form, SchemaRendererMode.Overview]) {
        test(`${mode} layouts sizes and views`, async ({mount, expectScreenshot}) => {
            const stateCases: SchemaFormGridProps['cases'] = [
                {
                    label: 'add edit and remove a row',
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
                    label: 'column order follows the explicit order prop',
                    props: ((): SchemaFormProps => {
                        const base = createSchema('section');
                        const schema: JsonSchema = {
                            ...base,
                            nodeParameters: {
                                ...base.nodeParameters,
                                entityProps: {order: ['age', 'name'], addButtonText: 'Add person'},
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
                    label: 'primitive rows use a single data column',
                    props: ((): SchemaFormProps => {
                        const base = createSchema('section');
                        const schema: JsonSchema = {
                            ...base,
                            items: {
                                type: JsonSchemaType.String,
                                title: 'Name',
                                nodeParameters: {
                                    type: NodeType.String,
                                    entity: 'base',
                                    layout: 'cell',
                                },
                            },
                            nodeParameters: {
                                ...base.nodeParameters,
                                entityProps: {addButtonText: 'Add name'},
                            },
                        };
                        return {
                            schema: schema,
                            value: ['Ada', 'Grace'],
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
                    label: 'tuple rows cannot be added or removed',
                    props: ((): SchemaFormProps => {
                        const base = createSchema('section');
                        const schema: JsonSchema = {
                            ...base,
                            items: [base.items as JsonSchema, base.items as JsonSchema],
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
                    label: 'empty overview uses the empty value marker',
                    props: ((): SchemaFormProps => {
                        const schema = createSchema('cell');
                        return {
                            schema: schema,
                            value: [],
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
                    await expect(
                        component.getByTestId('input[0].name').locator('input'),
                    ).toHaveValue('Ada');
                } else {
                    await expect(component.getByText('Ada', {exact: true})).toBeVisible();
                }
                const frame = component;
                if (mode === SchemaRendererMode.Form) {
                    for (const qa of [
                        'input[0].name',
                        'input[0].age',
                        'input[1].name',
                        'input[1].age',
                    ]) {
                        await expectInsideScreenshot(
                            component.getByTestId(qa).locator('input'),
                            frame,
                        );
                    }
                } else {
                    for (const text of ['Ada', '37', 'Grace', '45']) {
                        await expectInsideScreenshot(
                            component.getByText(text, {exact: true}),
                            frame,
                        );
                    }
                }
            }
            if (mode === SchemaRendererMode.Form) {
                const component = grid.getByRole('region', {
                    name: 'add edit and remove a row',
                    exact: true,
                });
                await component.getByTestId('input-add-button').click();
                await component.getByTestId('input[2].name').locator('input').fill('Linus');
                await component.getByTestId('input[2].age').locator('input').fill('54');
                await component.getByTestId('input[2].age').locator('input').blur();
                await component.getByTestId('input[0]-remove-button').click();
                await expect(component.getByTestId('form-value')).toHaveText(
                    '[{"name":"Grace","age":45},{"name":"Linus","age":54}]',
                );
            }
            if (mode === SchemaRendererMode.Form) {
                const component = grid.getByRole('region', {
                    name: 'column order follows the explicit order prop',
                    exact: true,
                });
                await expect(component.locator('.sr-array-table__column-title')).toHaveText([
                    'Age',
                    'Name',
                ]);
                await expect(component.getByTestId('input[0].age').locator('input')).toHaveValue(
                    '37',
                );
            }
            if (mode === SchemaRendererMode.Form) {
                const component = grid.getByRole('region', {
                    name: 'primitive rows use a single data column',
                    exact: true,
                });
                await expect(component.getByRole('textbox')).toHaveCount(2);
                await expect(component.getByTestId('input[0]').locator('input')).toHaveValue('Ada');
            }
            if (mode === SchemaRendererMode.Form) {
                const component = grid.getByRole('region', {
                    name: 'tuple rows cannot be added or removed',
                    exact: true,
                });
                await expect(component.getByTestId('input-add-button')).toHaveCount(0);
                await expect(component.locator('[data-qa$="-remove-button"]')).toHaveCount(0);
                await expect(component.getByTestId('input[1].name').locator('input')).toHaveValue(
                    'Grace',
                );
            }
            if (mode === SchemaRendererMode.Overview) {
                const component = grid.getByRole('region', {
                    name: 'empty overview uses the empty value marker',
                    exact: true,
                });
                await expect(component.getByText('—', {exact: true})).toBeVisible();
            }
            await expectScreenshot({scale: 'css'});
        });
    }
});
