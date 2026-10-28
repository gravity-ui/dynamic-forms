import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {schemaTest as test} from '~playwright/core';
import type {SchemaFormProps} from '~playwright/core/SchemaForm';
import {SchemaFormGrid, type SchemaFormGridProps} from '~playwright/core/SchemaFormGrid';
import {expectInsideScreenshot} from '~playwright/core/expectInsideScreenshot';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {SchemaRendererMode} from '../../../../core/constants';
import type {JsonSchema} from '../../../../core/types';

import {createSchema, value} from './helpers';

test.describe('SchemaRenderer ArrayEntity', () => {
    for (const mode of [SchemaRendererMode.Form, SchemaRendererMode.Overview]) {
        test(`${mode} layouts sizes and views`, async ({mount, expectScreenshot}) => {
            const stateCases: SchemaFormGridProps['cases'] = [
                {
                    label: 'add edit and remove an item',
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
                    label: 'tuple keeps fixed fields without add or remove controls',
                    props: ((): SchemaFormProps => {
                        const base = createSchema('section');
                        const schema = {
                            ...base,
                            items: [
                                base.items as JsonSchema,
                                {...(base.items as JsonSchema), title: 'Second name'},
                            ],
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
                    label: 'disabled array cannot add items',
                    props: ((): SchemaFormProps => {
                        const base = createSchema('section');
                        const schema = {
                            ...base,
                            nodeParameters: {
                                ...base.nodeParameters,
                                flags: {open: true, disabled: true},
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
                    caseHeight={mode === SchemaRendererMode.Form ? 380 : 240}
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
                    await expect(component.getByRole('textbox').first()).toHaveValue('Ada');
                } else {
                    await expect(component.getByText('Ada', {exact: true})).toBeVisible();
                }
                const frame = component;
                if (mode === SchemaRendererMode.Form) {
                    for (const qa of ['input[0]', 'input[1]']) {
                        await expectInsideScreenshot(
                            component.getByTestId(qa).locator('input'),
                            frame,
                        );
                    }
                } else {
                    for (const text of ['Ada', 'Grace']) {
                        await expectInsideScreenshot(
                            component.getByText(text, {exact: true}),
                            frame,
                        );
                    }
                }
            }
            if (mode === SchemaRendererMode.Form) {
                const component = grid.getByRole('region', {
                    name: 'add edit and remove an item',
                    exact: true,
                });
                await component.getByTestId('input-add-button').click();
                await component.getByTestId('input[2]').locator('input').fill('Linus');
                await component.getByTestId('input[0]-remove-button').click();
                await expect(component.getByTestId('form-value')).toHaveText('["Grace","Linus"]');
                await expect(component.getByRole('textbox')).toHaveCount(2);
            }
            if (mode === SchemaRendererMode.Form) {
                const component = grid.getByRole('region', {
                    name: 'tuple keeps fixed fields without add or remove controls',
                    exact: true,
                });
                await expect(component.getByRole('textbox')).toHaveCount(2);
                await expect(component.getByTestId('input-add-button')).toHaveCount(0);
                await expect(component.locator('[data-qa$="-remove-button"]')).toHaveCount(0);
            }
            if (mode === SchemaRendererMode.Form) {
                const component = grid.getByRole('region', {
                    name: 'disabled array cannot add items',
                    exact: true,
                });
                await expect(component.getByTestId('input-add-button')).toBeDisabled();
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
