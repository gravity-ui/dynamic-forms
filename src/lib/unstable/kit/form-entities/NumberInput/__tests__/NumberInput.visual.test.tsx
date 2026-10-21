import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import {SchemaForm} from '~playwright/core/SchemaForm';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {SchemaRendererMode} from '../../../../core/constants';

import {schema, value} from './helpers';

test.describe('SchemaRenderer NumberInput', () => {
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
    test('decimal edit respects multipleOf', async ({mount, expectScreenshot}) => {
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
        await component.getByRole('spinbutton').fill('37.5');
        await component.getByRole('spinbutton').blur();
        await expect(component.getByTestId('form-value')).toHaveText('37.5');
        await expectScreenshot();
    });
    test('empty placeholder', async ({mount, expectScreenshot}) => {
        const component = await mount(
            <SchemaForm
                schema={schema}
                value={undefined}
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
        await expect(component.getByRole('spinbutton')).toHaveValue('');
        await expect(component.getByRole('spinbutton')).toHaveAttribute('placeholder', '10');
        await expectScreenshot();
    });
    test('numeric minimum validation', async ({mount, expectScreenshot}) => {
        const component = await mount(
            <SchemaForm
                schema={{
                    ...schema,
                    minimum: 10,
                    nodeParameters: {
                        ...schema.nodeParameters,
                        errorMessages: {minimum: 'Minimum is ten'},
                    },
                }}
                value={5}
                mode={SchemaRendererMode.Form}
                size={'m'}
                view={'stretch'}
                coerceInitialValues={true}
                jsonDefaultValues={false}
                validateOnBlur={false}
                userContext={{}}
                showSubmit={true}
                width={600}
            />,
        );
        await component.getByRole('button', {name: 'Submit', exact: true}).click();
        await expect(component.locator('[data-sr-error]')).toHaveText('Minimum is ten');
        await expectScreenshot();
    });
});
