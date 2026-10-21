import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import {SchemaForm} from '~playwright/core/SchemaForm';
import {rendererSizes, rendererViews} from '~playwright/core/schemaRendererVariants';

import {JsonSchemaType, NodeType, SchemaRendererMode} from '../../../../core/constants';
import type {JsonSchemaString} from '../../../../core/types';

const modes = [SchemaRendererMode.Form];
const baseSchema: JsonSchemaString = {
    type: JsonSchemaType.String,
    title: 'Service name',
    description: 'Name shown to other team members',
    nodeParameters: {type: NodeType.String, entity: 'base', layout: 'row', flags: {open: true}},
};

test.describe('FormRow', () => {
    for (const mode of modes) {
        for (const size of rendererSizes) {
            for (const view of rendererViews) {
                test(`${mode} size=${size} view=${view}`, async ({mount, expectScreenshot}) => {
                    const schema = baseSchema;
                    const value = 'Gravity service';
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
                    if (mode === SchemaRendererMode.Form) {
                        await expect(component.getByRole('textbox')).toHaveValue(value);
                    } else {
                        await expect(component.getByText(value, {exact: true})).toBeVisible();
                    }
                    await expectScreenshot();
                });
            }
        }
    }

    for (const descriptionType of ['tooltip', 'bottom'] as const) {
        test(`description ${descriptionType}`, async ({mount, page, expectScreenshot}) => {
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
            if (descriptionType === 'bottom') {
                await expect(component.getByText(schema.description!, {exact: true})).toBeVisible();
            } else {
                await component.locator('.g-help-mark').hover();
                await expect(page.getByText(schema.description!, {exact: true})).toBeVisible();
            }
            await expectScreenshot({fullPage: true});
        });
    }
});
