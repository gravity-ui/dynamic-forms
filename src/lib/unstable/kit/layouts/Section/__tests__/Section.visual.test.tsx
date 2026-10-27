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
    nodeParameters: {type: NodeType.String, entity: 'base', layout: 'section', flags: {open: true}},
};

test.describe('Section', () => {
    for (const mode of modes) {
        test(`${mode} sizes and views`, async ({mount, expectScreenshot}) => {
            const stateCases: SchemaFormGridProps['cases'] = [
                {
                    label: 'indented section',
                    height: 200,
                    props: ((): SchemaFormProps => {
                        const schema: JsonSchemaString = {
                            ...baseSchema,
                            nodeParameters: {
                                ...baseSchema.nodeParameters,
                                layoutProps: {
                                    withIndent: true,
                                    descriptionType: 'bottom',
                                    color: 'secondary',
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
                    label: 'description bottom',
                    props: ((): SchemaFormProps => {
                        const descriptionType = 'bottom' as const;
                        const schema: JsonSchemaString = {
                            ...baseSchema,
                            nodeParameters: {
                                ...baseSchema.nodeParameters,
                                layoutProps: {descriptionType},
                                flags: {open: true, required: true},
                            },
                        };
                        const value = 'Gravity service';
                        const mode = SchemaRendererMode.Form;
                        const size = 'm';
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
                const component = grid.getByRole('region', {name: 'indented section', exact: true});
                const value = 'Gravity service';
                await expect(component.getByRole('textbox')).toHaveValue(value);
            }
            if (mode === SchemaRendererMode.Form) {
                const descriptionType = 'bottom' as const;
                const schema: JsonSchemaString = {
                    ...baseSchema,
                    nodeParameters: {
                        ...baseSchema.nodeParameters,
                        layoutProps: {descriptionType},
                        flags: {open: true, required: true},
                    },
                };
                const value = 'Gravity service';
                const component = grid.getByRole('region', {
                    name: 'description bottom',
                    exact: true,
                });
                await expect(component.getByRole('textbox')).toHaveValue(value);
                await expect(component.getByText(schema.description!, {exact: true})).toBeVisible();
            }
            await expectScreenshot({scale: 'css'});
        });
    }

    test('description tooltip', async ({mount, page, expectScreenshot}) => {
        const descriptionType = 'tooltip' as const;
        const schema: JsonSchemaString = {
            ...baseSchema,
            nodeParameters: {
                ...baseSchema.nodeParameters,
                layoutProps: {descriptionType},
                flags: {open: true, required: true},
            },
        };
        const value = 'Gravity service';
        const mode = SchemaRendererMode.Form;
        const size = 'm';
        const view = 'stretch';
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
        await expect(component.getByRole('textbox')).toHaveValue(value);
        await component.locator('.g-help-mark').hover();
        await expect(page.getByText(schema.description!, {exact: true})).toBeVisible();
        await expectScreenshot({fullPage: true});
    });
});
