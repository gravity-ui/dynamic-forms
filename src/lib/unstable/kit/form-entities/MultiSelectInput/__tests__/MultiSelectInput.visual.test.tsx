import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import {SchemaForm} from '~playwright/core/SchemaForm';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {JsonSchemaType, SchemaRendererMode} from '../../../../core/constants';

import {schema, value} from './helpers';

test.describe('SchemaRenderer MultiSelectInput', () => {
    for (const variant of rendererVariants) {
        test(`${variant.layoutName} size ${variant.size} view ${variant.view}`, async ({
            mount,
            expectScreenshot,
        }) => {
            const component = await mount(
                <SchemaForm
                    schema={{
                        ...schema,
                        nodeParameters: {
                            ...schema.nodeParameters,
                            layout: variant.layout,
                            flags: {open: true},
                        },
                    }}
                    value={value}
                    mode={SchemaRendererMode.Form}
                    size={variant.size}
                    view={variant.view}
                    coerceInitialValues={true}
                    jsonDefaultValues={false}
                    validateOnBlur={false}
                    userContext={{}}
                    showSubmit={false}
                    width={600}
                />,
            );
            await expect(component.getByTestId('input')).toBeVisible();
            await expect(component.getByTestId('form-value')).toHaveText(
                JSON.stringify(value) ?? '',
            );
            await expectScreenshot();
        });
    }
    test('disabled preserves the value', async ({mount, expectScreenshot}) => {
        const component = await mount(
            <SchemaForm
                schema={{
                    ...schema,
                    nodeParameters: {...schema.nodeParameters, flags: {open: true, disabled: true}},
                }}
                value={value}
                mode={SchemaRendererMode.Form}
                size={'m'}
                view={'stretch'}
                coerceInitialValues={true}
                jsonDefaultValues={false}
                validateOnBlur={false}
                userContext={{}}
                showSubmit={false}
                width={600}
            />,
        );
        await expect(component.getByTestId('input')).toBeDisabled();
        await expect(component.getByTestId('form-value')).toHaveText(JSON.stringify(value) ?? '');
        await expectScreenshot();
    });
    test('open options with metadata size s', async ({mount, page, expectScreenshot}) => {
        const component = await mount(
            <SchemaForm
                schema={schema}
                value={value}
                mode={SchemaRendererMode.Form}
                size={'s'}
                view={'stretch'}
                coerceInitialValues={true}
                jsonDefaultValues={false}
                validateOnBlur={false}
                userContext={{}}
                showSubmit={false}
                width={600}
            />,
        );
        await component.getByTestId('input').click();
        await expect(page.getByRole('option', {name: /Beta/})).toBeVisible();
        await expect(page.getByText('The second team', {exact: true})).toBeVisible();
        await expectScreenshot({fullPage: true});
    });
    test('open options with metadata size m', async ({mount, page, expectScreenshot}) => {
        const component = await mount(
            <SchemaForm
                schema={schema}
                value={value}
                mode={SchemaRendererMode.Form}
                size={'m'}
                view={'stretch'}
                coerceInitialValues={true}
                jsonDefaultValues={false}
                validateOnBlur={false}
                userContext={{}}
                showSubmit={false}
                width={600}
            />,
        );
        await component.getByTestId('input').click();
        await expect(page.getByRole('option', {name: /Beta/})).toBeVisible();
        await expect(page.getByText('The second team', {exact: true})).toBeVisible();
        await expectScreenshot({fullPage: true});
    });
    test('open options with metadata size l', async ({mount, page, expectScreenshot}) => {
        const component = await mount(
            <SchemaForm
                schema={schema}
                value={value}
                mode={SchemaRendererMode.Form}
                size={'l'}
                view={'stretch'}
                coerceInitialValues={true}
                jsonDefaultValues={false}
                validateOnBlur={false}
                userContext={{}}
                showSubmit={false}
                width={600}
            />,
        );
        await component.getByTestId('input').click();
        await expect(page.getByRole('option', {name: /Beta/})).toBeVisible();
        await expect(page.getByText('The second team', {exact: true})).toBeVisible();
        await expectScreenshot({fullPage: true});
    });
    test('open options with metadata size xl', async ({mount, page, expectScreenshot}) => {
        const component = await mount(
            <SchemaForm
                schema={schema}
                value={value}
                mode={SchemaRendererMode.Form}
                size={'xl'}
                view={'stretch'}
                coerceInitialValues={true}
                jsonDefaultValues={false}
                validateOnBlur={false}
                userContext={{}}
                showSubmit={false}
                width={600}
            />,
        );
        await component.getByTestId('input').click();
        await expect(page.getByRole('option', {name: /Beta/})).toBeVisible();
        await expect(page.getByText('The second team', {exact: true})).toBeVisible();
        await expectScreenshot({fullPage: true});
    });
    test('selection updates the form and clear removes it', async ({
        mount,
        page,
        expectScreenshot,
    }) => {
        const component = await mount(
            <SchemaForm
                schema={schema}
                value={value}
                mode={SchemaRendererMode.Form}
                size={'m'}
                view={'stretch'}
                coerceInitialValues={true}
                jsonDefaultValues={false}
                validateOnBlur={false}
                userContext={{}}
                showSubmit={false}
                width={600}
            />,
        );
        await component.getByTestId('input').click();
        await page.getByRole('option', {name: /Beta/}).click();
        await page.keyboard.press('Escape');
        await expect(component.getByTestId('form-value')).toHaveText('["alpha","beta"]');
        await expectScreenshot({screenshotName: 'selected'});
        await component.getByRole('button', {name: 'Clear', exact: true}).click();
        await expect(component.getByTestId('form-value')).toHaveText('[]');
        await expectScreenshot({screenshotName: 'cleared'});
    });
    test('filtering more than nine options selects the matching value', async ({
        mount,
        page,
        expectScreenshot,
    }) => {
        const options = Array.from({length: 12}, (_, index) => `choice-${index + 1}`);
        const component = await mount(
            <SchemaForm
                schema={{...schema, items: {type: JsonSchemaType.String, enum: options}}}
                value={['choice-1']}
                mode={SchemaRendererMode.Form}
                size={'m'}
                view={'stretch'}
                coerceInitialValues={true}
                jsonDefaultValues={false}
                validateOnBlur={false}
                userContext={{}}
                showSubmit={false}
                width={600}
            />,
        );
        await component.getByTestId('input').click();
        await page.getByRole('textbox', {name: 'Filter', exact: true}).fill('choice-10');
        await expect(page.getByRole('option')).toHaveCount(1);
        await expect(page.getByRole('option', {name: 'choice-10', exact: true})).toBeVisible();
        await expectScreenshot({fullPage: true, screenshotName: 'filtered-options'});
        await page.getByRole('option', {name: 'choice-10', exact: true}).click();
        await page.keyboard.press('Escape');
        await expect(component.getByTestId('form-value')).toHaveText('["choice-1","choice-10"]');
        await expectScreenshot({screenshotName: 'filtered-selection'});
    });
});
