import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import {SchemaForm} from '~playwright/core/SchemaForm';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {SchemaRendererMode} from '../../../../core/constants';

import {schema, value} from './helpers';

test.describe('SchemaRenderer NumberWithScaleInput', () => {
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
            await expect(component.getByRole('spinbutton')).toBeVisible();
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
        await expect(component.getByRole('spinbutton')).toBeDisabled();
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
        await expect(component.getByRole('spinbutton')).toHaveValue('1.5');
        await component.getByRole('spinbutton').fill('2');
        await component.getByRole('spinbutton').blur();
        await expect(component.getByTestId('form-value')).toHaveText('2000');
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
        await expect(component.getByRole('spinbutton')).toHaveValue('1500');
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
        await expect(component.getByRole('spinbutton')).toHaveValue('1500');
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
        await expect(component.getByRole('spinbutton')).toHaveValue('1500');
        await expect(component.locator('button[aria-haspopup="listbox"]')).toHaveText('m');
        await expect(component.getByTestId('form-value')).toHaveText(JSON.stringify(value));
        await expectScreenshot();
    });
    test('negative scaled values preserve numeric payload', async ({mount, expectScreenshot}) => {
        const component = await mount(
            <SchemaForm
                schema={{...schema, minimum: -10000, multipleOf: 0.5}}
                value={-1500}
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
        await expect(component.getByRole('spinbutton')).toHaveValue('-1.5');
        await component.getByRole('spinbutton').fill('-2.5');
        await component.getByRole('spinbutton').blur();
        await expect(component.getByTestId('form-value')).toHaveText('-2500');
        await expectScreenshot();
    });
    test('disabled also prevents changing the scale', async ({mount}) => {
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
        await expect(component.getByRole('spinbutton')).toBeDisabled();
        await expect(component.getByTestId('form-value')).toHaveText(JSON.stringify(value));
        // NumberWithScaleInput passes disabled to the numeric control, but not to its scale Select.
        test.fail(true, 'The scale Select currently ignores the disabled field flag');
        await expect(component.locator('button[aria-haspopup="listbox"]')).toBeDisabled();
    });
});
