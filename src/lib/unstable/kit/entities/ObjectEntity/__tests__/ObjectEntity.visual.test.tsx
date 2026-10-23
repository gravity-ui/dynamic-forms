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

test.describe('SchemaRenderer ObjectEntity', () => {
    for (const mode of [SchemaRendererMode.Form, SchemaRendererMode.Overview]) {
        test(`${mode} layouts sizes and views`, async ({mount, expectScreenshot}) => {
            const stateCases: SchemaFormGridProps['cases'] = [
                {
                    label: 'explicit property order and editing preserve other values',
                    props: ((): SchemaFormProps => {
                        const base = createSchema('section');
                        const schema: JsonSchema = {
                            ...base,
                            nodeParameters: {
                                ...base.nodeParameters,
                                entityProps: {order: ['age', 'name']},
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
                    label: 'hidden child keeps its data without a visible control',
                    props: ((): SchemaFormProps => {
                        const base = createSchema('section');
                        const schema: JsonSchema = {
                            ...base,
                            properties: {
                                ...base.properties,
                                name: {
                                    type: JsonSchemaType.String,
                                    title: 'Private name',
                                    nodeParameters: {
                                        type: NodeType.String,
                                        entity: 'base',
                                        layout: 'row',
                                        flags: {hidden: true},
                                    },
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
                    for (const qa of ['input.name', 'input.age']) {
                        await expectInsideScreenshot(
                            component.getByTestId(qa).locator('input'),
                            frame,
                        );
                    }
                } else {
                    for (const text of ['Ada', '37']) {
                        await expectInsideScreenshot(
                            component.getByText(text, {exact: true}),
                            frame,
                        );
                    }
                }
            }
            if (mode === SchemaRendererMode.Form) {
                const component = grid.getByRole('region', {
                    name: 'explicit property order and editing preserve other values',
                    exact: true,
                });
                await expect(component.locator('input').first()).toHaveValue('37');
                await expect(component.locator('input').nth(1)).toHaveValue('Ada');
                await component.getByTestId('input.name').locator('input').fill('Grace');
                await expect(component.getByTestId('form-value')).toHaveText(
                    '{"name":"Grace","age":37}',
                );
            }
            if (mode === SchemaRendererMode.Form) {
                const component = grid.getByRole('region', {
                    name: 'hidden child keeps its data without a visible control',
                    exact: true,
                });
                await expect(component.getByTestId('input.name')).not.toBeVisible();
                await expect(component.getByTestId('input.age').locator('input')).toHaveValue('37');
                await expect(component.getByTestId('form-value')).toHaveText(
                    '{"name":"Ada","age":37}',
                );
            }
            await expectScreenshot({scale: 'css'});
        });
    }
});
