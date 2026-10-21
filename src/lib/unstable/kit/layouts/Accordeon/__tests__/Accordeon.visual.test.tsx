import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import {SchemaForm} from '~playwright/core/SchemaForm';
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

    test('closed layout expands and collapses without losing the value', async ({
        mount,
        expectScreenshot,
    }) => {
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
        await expectScreenshot({screenshotName: 'Collapsed'});
        await component.getByRole('button').first().click();
        await expect(component.getByRole('textbox')).toHaveValue(value);
        await expectScreenshot({screenshotName: 'Expanded'});
        await component.getByRole('button').first().click();
        await expect(component.getByRole('textbox')).not.toBeVisible();
        await expect(component.getByTestId('form-value')).toHaveText(JSON.stringify(value));
    });

    test('default summary and indent', async ({mount, expectScreenshot}) => {
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
        await expectScreenshot();
    });

    test('custom summary applies toggler props', async ({mount, expectScreenshot}) => {
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
        const component = await mount(
            <SchemaForm
                schema={schema}
                value="Visible in disabled summary"
                mode={SchemaRendererMode.Form}
                size="xl"
                view="stretch"
                coerceInitialValues={true}
                jsonDefaultValues={false}
                validateOnBlur={false}
                userContext={{}}
                showSubmit={false}
                width={600}
            />,
        );
        const toggler = component.getByRole('button', {name: 'Service name', exact: true});
        await expect(toggler).toBeDisabled();
        await expect(toggler).toHaveClass(/g-button_view_outlined/);
        await expect(component.getByRole('textbox')).toHaveValue('Visible in disabled summary');
        await expectScreenshot();
    });
});
