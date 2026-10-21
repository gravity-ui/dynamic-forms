import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import {SchemaForm} from '~playwright/core/SchemaForm';

import {JsonSchemaType, NodeType, SchemaRendererMode} from '../../constants';
import type {JsonSchemaNumber, JsonSchemaObject, JsonSchemaString} from '../../types';

import {SchemaFormWithContentRenderer} from './SchemaFormWithContentRenderer';

test.describe('SchemaRenderer settings', () => {
    for (const coerceInitialValues of [false, true]) {
        test(`coerceInitialValues=${coerceInitialValues}`, async ({mount, expectScreenshot}) => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                title: 'Capacity',
                nodeParameters: {type: NodeType.Number, entity: 'base', layout: 'row'},
            };
            const component = await mount(
                <SchemaForm
                    schema={schema}
                    value="12"
                    mode={SchemaRendererMode.Form}
                    size="m"
                    view="stretch"
                    coerceInitialValues={coerceInitialValues}
                    jsonDefaultValues={false}
                    validateOnBlur={false}
                    userContext={{}}
                    showSubmit={false}
                    width={600}
                />,
            );
            await expect(component.getByRole('spinbutton')).toHaveValue('12');
            await expect(component.getByTestId('form-value')).toHaveText(
                coerceInitialValues ? '12' : '"12"',
            );
            await expectScreenshot();
        });
    }

    for (const jsonDefaultValues of [false, true]) {
        test(`jsonDefaultValues=${jsonDefaultValues}`, async ({mount, expectScreenshot}) => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                title: 'Service name',
                default: '"Default name"',
                nodeParameters: {type: NodeType.String, entity: 'base', layout: 'column'},
            };
            const component = await mount(
                <SchemaForm
                    schema={schema}
                    value={undefined}
                    mode={SchemaRendererMode.Form}
                    size="l"
                    view="fit"
                    coerceInitialValues={false}
                    jsonDefaultValues={jsonDefaultValues}
                    validateOnBlur={false}
                    userContext={{}}
                    showSubmit={false}
                    width={600}
                />,
            );
            const expected = jsonDefaultValues ? 'Default name' : '"Default name"';
            await expect(component.getByRole('textbox')).toHaveValue(expected);
            await expect(component.getByTestId('form-value')).toHaveText(JSON.stringify(expected));
            await expectScreenshot();
        });
    }

    for (const validateOnBlur of [false, true]) {
        test(`validateOnBlur=${validateOnBlur}`, async ({mount, expectScreenshot}) => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                title: 'Service name',
                minLength: 5,
                nodeParameters: {type: NodeType.String, entity: 'base', layout: 'column'},
            };
            const component = await mount(
                <SchemaForm
                    schema={schema}
                    value="Valid name"
                    mode={SchemaRendererMode.Form}
                    size="m"
                    view="stretch"
                    coerceInitialValues={true}
                    jsonDefaultValues={false}
                    validateOnBlur={validateOnBlur}
                    userContext={{}}
                    showSubmit={true}
                    width={600}
                />,
            );
            const input = component.getByRole('textbox');
            // Touch the field while it is valid, then change it without blurring.
            await input.focus();
            await input.blur();
            await input.fill('Bad');
            const error = component.locator('[data-sr-error]');
            if (validateOnBlur) {
                await expect(error).toHaveCount(0);
            } else {
                await expect(error).toBeVisible();
            }
            await expectScreenshot({
                screenshotName: `validateOnBlur=${validateOnBlur} before blur`,
            });
            await input.blur();
            await expect(error).toBeVisible();
            await expectScreenshot({screenshotName: `validateOnBlur=${validateOnBlur} after blur`});
            await input.fill('Valid again');
            await input.blur();
            await expect(error).toHaveCount(0);
            await expect(component.getByTestId('form-value')).toHaveText('"Valid again"');
        });
    }

    test('readOnly hides a field only in Form and preserves its value', async ({
        mount,
        expectScreenshot,
    }) => {
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            nodeParameters: {type: NodeType.Object, entity: 'base', layout: 'transparent'},
            properties: {
                locked: {
                    type: JsonSchemaType.String,
                    title: 'Locked field',
                    readOnly: true,
                    nodeParameters: {type: NodeType.String, entity: 'base', layout: 'row'},
                },
                editable: {
                    type: JsonSchemaType.String,
                    title: 'Editable field',
                    nodeParameters: {type: NodeType.String, entity: 'base', layout: 'row'},
                },
            },
        };
        const value = {locked: 'Preserved secret', editable: 'Editable value'};
        const component = await mount(
            <div>
                <section aria-label="Form mode">
                    <SchemaForm
                        schema={schema}
                        value={value}
                        mode={SchemaRendererMode.Form}
                        size="m"
                        view="stretch"
                        coerceInitialValues={true}
                        jsonDefaultValues={false}
                        validateOnBlur={false}
                        userContext={{}}
                        showSubmit={false}
                        width={900}
                    />
                </section>
                <section aria-label="Overview mode">
                    <SchemaForm
                        schema={schema}
                        value={value}
                        mode={SchemaRendererMode.Overview}
                        size="m"
                        view="stretch"
                        coerceInitialValues={true}
                        jsonDefaultValues={false}
                        validateOnBlur={false}
                        userContext={{}}
                        showSubmit={false}
                        width={900}
                    />
                </section>
            </div>,
        );
        const form = component.getByRole('region', {name: 'Form mode', exact: true});
        const overview = component.getByRole('region', {name: 'Overview mode', exact: true});
        await expect(form.getByText('Locked field', {exact: true})).toHaveCount(0);
        await expect(form.getByRole('textbox')).toHaveValue('Editable value');
        await expect(overview.getByText('Preserved secret', {exact: true})).toBeVisible();
        await expect(overview.getByRole('textbox')).toHaveCount(0);
        for (const section of [form, overview]) {
            await expect(section.getByTestId('form-value')).toHaveText(JSON.stringify(value));
        }
        await expectScreenshot();
    });

    test('userContext supplies and updates the description renderer', async ({
        mount,
        expectScreenshot,
    }) => {
        const schema: JsonSchemaString = {
            type: JsonSchemaType.String,
            title: 'Service',
            description: 'About this service',
            nodeParameters: {
                type: NodeType.String,
                entity: 'base',
                layout: 'column',
                layoutProps: {descriptionType: 'bottom'},
            },
        };
        const component = await mount(
            <SchemaFormWithContentRenderer
                schema={schema}
                value="Gravity"
                mode={SchemaRendererMode.Form}
                size="s"
                view="fit"
                coerceInitialValues={true}
                jsonDefaultValues={false}
                validateOnBlur={false}
                userContext={{prefix: 'Custom: '}}
                updatedSettings={{size: 'xl', view: 'stretch', userContext: {prefix: 'Updated: '}}}
                showSubmit={false}
                width={600}
            />,
        );
        await expect(component.getByTestId('custom-description')).toHaveText(
            'Custom: About this service',
        );
        await expect(component.getByRole('textbox')).toHaveValue('Gravity');
        await expectScreenshot({screenshotName: 'Custom renderer small fit'});
        await component.getByRole('button', {name: 'Update renderer settings'}).click();
        await expect(component.getByTestId('custom-description')).toHaveText(
            'Updated: About this service',
        );
        await expect(component.locator('.sr-form-column')).toHaveClass(/sr-form-column_size_xl/);
        await expect(component.getByRole('textbox')).toHaveValue('Gravity');
        await expectScreenshot({screenshotName: 'Custom renderer updated xl stretch'});
    });
});
