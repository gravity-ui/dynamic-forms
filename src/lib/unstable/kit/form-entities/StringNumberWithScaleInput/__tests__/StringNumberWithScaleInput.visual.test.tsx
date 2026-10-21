import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import {SchemaForm} from '~playwright/core/SchemaForm';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {SchemaRendererMode} from '../../../../core/constants';

import {schema, value} from './helpers';

test.describe('SchemaRenderer StringNumberWithScaleInput', () => {
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
            await expect(component.getByRole('textbox')).toBeVisible();
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
        await expect(component.getByRole('textbox')).toBeDisabled();
        await expect(component.getByTestId('form-value')).toHaveText(JSON.stringify(value) ?? '');
        await expectScreenshot();
    });
    test('converts an edited display value to base units', async ({mount, expectScreenshot}) => {
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
        await expect(component.getByRole('textbox')).toHaveValue('1.5');
        await component.getByRole('textbox').fill('2.125');
        await component.getByRole('textbox').blur();
        await expect(component.getByTestId('form-value')).toHaveText('"2125"');
        await expectScreenshot();
    });
    test('changing scale preserves the base value', async ({mount, page, expectScreenshot}) => {
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
        await component.locator('button[aria-haspopup="listbox"]').click();
        await page.getByRole('option', {name: 'm', exact: true}).click();
        await expect(component.getByRole('textbox')).toHaveValue('1500');
        await expect(component.getByTestId('form-value')).toHaveText(JSON.stringify(value));
        await expectScreenshot();
    });
    test('without scale renders just the input', async ({mount, expectScreenshot}) => {
        const component = await mount(
            <SchemaForm
                schema={{...schema, nodeParameters: {...schema.nodeParameters, entityProps: {}}}}
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
        await expect(component.getByRole('textbox')).toHaveValue('1500');
        await expect(component.locator('button[aria-haspopup="listbox"]')).toHaveCount(0);
        await expectScreenshot();
    });
    test('omitting viewType uses defaultType', async ({mount, expectScreenshot}) => {
        const component = await mount(
            <SchemaForm
                schema={{
                    ...schema,
                    nodeParameters: {
                        ...schema.nodeParameters,
                        entityProps: {...schema.nodeParameters?.entityProps, viewType: undefined},
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
        await expect(component.getByRole('textbox')).toHaveValue('1500');
        await expect(component.locator('button[aria-haspopup="listbox"]')).toHaveText('m');
        await expect(component.getByTestId('form-value')).toHaveText(JSON.stringify(value));
        await expectScreenshot();
    });
    test('large negative decimal strings keep precision during scaling', async ({
        mount,
        page,
        expectScreenshot,
    }) => {
        const component = await mount(
            <SchemaForm
                schema={{
                    ...schema,
                    stringNumber: {
                        ...schema.stringNumber,
                        minimum: '-999999999999999999',
                        maximum: '999999999999999999',
                        multipleOf: '0.001',
                    },
                }}
                value={'-123456789012345.125'}
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
        await expect(component.getByRole('textbox')).toHaveValue('-123456789012.345125');
        await component.getByRole('textbox').fill('-123456789012.345126');
        await component.getByRole('textbox').blur();
        await expect(component.getByTestId('form-value')).toHaveText('"-123456789012345.126"');
        await component.locator('button[aria-haspopup="listbox"]').click();
        await page.getByRole('option', {name: 'm', exact: true}).click();
        await expect(component.getByRole('textbox')).toHaveValue('-123456789012345.126');
        await expect(component.getByTestId('form-value')).toHaveText('"-123456789012345.126"');
        await expectScreenshot();
    });
});
