import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {SchemaRendererMode} from '../../../../core/constants';

import {MonacoSchemaForm} from './MonacoSchemaForm';
import {createSchema, value} from './helpers';

test.describe('SchemaRenderer Monaco', () => {
    for (const mode of [SchemaRendererMode.Form, SchemaRendererMode.Overview]) {
        for (const {layout, layoutName, size, view} of rendererVariants) {
            test(`${mode} ${layoutName} ${size} ${view}`, async ({mount, expectScreenshot}) => {
                const schema = createSchema(layout);
                const component = await mount(
                    <MonacoSchemaForm
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
                await expect(component.locator('.monaco-editor')).toBeVisible();
                await expect(component.locator('.view-lines')).toContainText('enabled');
                await expectScreenshot();
            });
        }
    }
    test('editing JSON updates the form value', async ({mount, page, expectScreenshot}) => {
        const schema = createSchema('column');
        const component = await mount(
            <MonacoSchemaForm
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
                width={600}
            />,
        );
        const editor = component.locator('.monaco-editor textarea.inputarea');
        await expect(component.locator('.view-lines')).toContainText('enabled');
        await editor.click();
        // Monaco selects keybindings from the browser user agent, not the test runner's OS.
        const selectAll = await page.evaluate(() =>
            navigator.userAgent.includes('Macintosh') ? 'Meta+A' : 'Control+A',
        );
        await editor.press(selectAll);
        await editor.press('Backspace');
        await expect(component.getByTestId('form-value')).toHaveText(JSON.stringify(''));
        await page.keyboard.type('{"enabled":false}');
        await expect(component.getByTestId('form-value')).toHaveText(
            JSON.stringify('{"enabled":false}'),
        );
        await editor.blur();
        await expectScreenshot();
    });

    test('disabled editor preserves its value', async ({mount, page, expectScreenshot}) => {
        const base = createSchema('column');
        const schema = {
            ...base,
            nodeParameters: {...base.nodeParameters, flags: {open: true, disabled: true}},
        };
        const component = await mount(
            <MonacoSchemaForm
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
                width={600}
            />,
        );
        await expect(component.locator('.monaco-editor')).toBeVisible();
        await component.locator('.monaco-editor textarea.inputarea').press('End');
        await page.keyboard.insertText('changed');
        await expect(component.getByTestId('form-value')).toHaveText(JSON.stringify(value));
        await expectScreenshot();
    });

    test('overview editor is read only', async ({mount, page, expectScreenshot}) => {
        const schema = createSchema('column');
        const component = await mount(
            <MonacoSchemaForm
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
                width={600}
            />,
        );
        await expect(component.locator('.view-lines')).toContainText('enabled');
        await component.locator('.monaco-editor textarea.inputarea').press('End');
        await page.keyboard.insertText('changed');
        await expect(component.getByTestId('form-value')).toHaveText(JSON.stringify(value));
        await expectScreenshot();
    });

    test('dialog opens the actual editor and closes again', async ({
        mount,
        page,
        expectScreenshot,
    }) => {
        const schema = createSchema('column');
        const component = await mount(
            <MonacoSchemaForm
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
                width={600}
            />,
        );
        await component.getByTestId('input-dialog-toggler').click();
        const dialog = page.getByRole('dialog');
        await expect(dialog.locator('.monaco-editor')).toBeVisible();
        await expect(dialog.locator('.view-lines')).toContainText('enabled');
        await expectScreenshot({component: dialog, screenshotName: 'Monaco expanded dialog'});
        await dialog.getByTestId('input-dialog-toggler').click();
        await expect(dialog).toBeHidden();
        await expect(component.locator('.monaco-editor')).toBeVisible();
    });

    test('invalid JSON can ignore editor validation without replacing the editor', async ({
        mount,
        expectScreenshot,
    }) => {
        const base = createSchema('column');
        const schema = {
            ...base,
            nodeParameters: {
                ...base.nodeParameters,
                entityProps: {
                    ...base.nodeParameters?.entityProps,
                    withDialog: false,
                    ignoreMonacoErrors: true,
                },
            },
        };
        const component = await mount(
            <MonacoSchemaForm
                schema={schema}
                value={'{broken json}'}
                mode={SchemaRendererMode.Form}
                size="m"
                view="stretch"
                coerceInitialValues={true}
                jsonDefaultValues={false}
                validateOnBlur={false}
                userContext={{}}
                showSubmit={true}
                width={600}
            />,
        );
        await expect(component.locator('.monaco-editor')).toBeVisible();
        await expect(component.locator('.view-lines')).toContainText('broken');
        await expect(component.getByTestId('input-dialog-toggler')).toHaveCount(0);
        await expect(component.getByTestId('form-value')).toHaveText(
            JSON.stringify('{broken json}'),
        );
        await expect(component.locator('.squiggly-error').first()).toBeVisible();
        await component.getByRole('button', {name: 'Submit', exact: true}).click();
        await expect(component.locator('[data-sr-error="true"]')).toHaveCount(0);
        await expectScreenshot();
    });

    test('editor diagnostics reach the form validation', async ({mount, expectScreenshot}) => {
        const schema = createSchema('column');
        const component = await mount(
            <MonacoSchemaForm
                schema={schema}
                value={'{broken json}'}
                mode={SchemaRendererMode.Form}
                size="m"
                view="stretch"
                coerceInitialValues={true}
                jsonDefaultValues={false}
                validateOnBlur={false}
                userContext={{}}
                showSubmit={true}
                width={600}
            />,
        );
        await expect(component.locator('.squiggly-error').first()).toBeVisible();
        await component.getByRole('button', {name: 'Submit', exact: true}).click();
        await expect(component.locator('[data-sr-error="true"]')).toContainText('Line 1');
        await expectScreenshot();
    });

    test('empty overview uses the empty value marker', async ({mount, expectScreenshot}) => {
        const schema = createSchema('cell');
        const component = await mount(
            <MonacoSchemaForm
                schema={schema}
                value={undefined}
                mode={SchemaRendererMode.Overview}
                size="m"
                view="stretch"
                coerceInitialValues={true}
                jsonDefaultValues={false}
                validateOnBlur={false}
                userContext={{}}
                showSubmit={false}
                width={600}
            />,
        );
        await expect(component.getByText('—', {exact: true})).toBeVisible();
        await expectScreenshot();
    });
});
