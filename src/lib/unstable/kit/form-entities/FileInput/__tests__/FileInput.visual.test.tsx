import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import {SchemaForm} from '~playwright/core/SchemaForm';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {SchemaRendererMode} from '../../../../core/constants';

import {schema, value} from './helpers';

test.describe('SchemaRenderer FileInput', () => {
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
            await expect(component.locator('.g-file-drop-zone')).toBeVisible();
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
        const dropZone = component.locator('.g-file-drop-zone');
        await expect(dropZone).toHaveClass(/g-file-drop-zone_disabled/);
        await expect(dropZone).toHaveCSS('pointer-events', 'none');
        await expect(component.getByTestId('form-value')).toHaveText(JSON.stringify(value) ?? '');
        await expectScreenshot();
    });
    test('readAsText uploads file content and removes the file', async ({
        mount,
        expectScreenshot,
    }) => {
        const component = await mount(
            <SchemaForm
                schema={{
                    ...schema,
                    nodeParameters: {
                        ...schema.nodeParameters,
                        entityProps: {readAsMethod: 'readAsText', accept: ['text/plain']},
                    },
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
        const fileInput = component.locator('input[type="file"]');
        await expect(fileInput).toHaveAttribute('accept', 'text/plain');
        await fileInput.setInputFiles({
            name: 'config.txt',
            mimeType: 'text/plain',
            buffer: Buffer.from('service=gravity'),
        });
        await expect(component.getByText('config.txt', {exact: true})).toBeVisible();
        await expect(component.getByTestId('form-value')).toHaveText(
            JSON.stringify('service=gravity'),
        );
        await expectScreenshot({screenshotName: 'uploaded'});
        const preview = component.locator('.g-file-preview');
        await preview.hover();
        await preview.getByRole('button').click();
        await expect(component.locator('.g-file-drop-zone')).toBeVisible();
        await expect(component.getByTestId('form-value')).toHaveText('');
        await expectScreenshot({screenshotName: 'removed'});
    });
    test('readAsBinaryString uploads file content', async ({mount, expectScreenshot}) => {
        const component = await mount(
            <SchemaForm
                schema={{
                    ...schema,
                    nodeParameters: {
                        ...schema.nodeParameters,
                        entityProps: {readAsMethod: 'readAsBinaryString', accept: ['text/plain']},
                    },
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
        const fileInput = component.locator('input[type="file"]');
        const content = Buffer.from('Сервис Gravity 🌍', 'utf8');
        await fileInput.setInputFiles({
            name: 'config.txt',
            mimeType: 'text/plain',
            buffer: content,
        });
        await expect(component.getByText('config.txt', {exact: true})).toBeVisible();
        await expect(component.getByTestId('form-value')).toHaveText(
            JSON.stringify(content.toString('latin1')),
        );
        await expectScreenshot();
    });
    test('readAsDataURL uploads file content', async ({mount, expectScreenshot}) => {
        const component = await mount(
            <SchemaForm
                schema={{
                    ...schema,
                    nodeParameters: {
                        ...schema.nodeParameters,
                        entityProps: {readAsMethod: 'readAsDataURL', accept: ['text/plain']},
                    },
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
        const fileInput = component.locator('input[type="file"]');
        await fileInput.setInputFiles({
            name: 'config.txt',
            mimeType: 'text/plain',
            buffer: Buffer.from('service=gravity'),
        });
        await expect(component.getByText('config.txt', {exact: true})).toBeVisible();
        await expect(component.getByTestId('form-value')).toHaveText(
            JSON.stringify('data:text/plain;base64,c2VydmljZT1ncmF2aXR5'),
        );
        await expectScreenshot();
    });
});
