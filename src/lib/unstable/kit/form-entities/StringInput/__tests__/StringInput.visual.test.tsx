import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import {SchemaForm} from '~playwright/core/SchemaForm';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {SchemaRendererMode} from '../../../../core/constants';

import {schema, value} from './helpers';

test.describe('SchemaRenderer StringInput', () => {
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
    test('edits and clears the value', async ({mount, expectScreenshot}) => {
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
        await component.getByRole('textbox').fill('Updated service');
        await expect(component.getByTestId('form-value')).toHaveText(
            JSON.stringify('Updated service'),
        );
        await expectScreenshot({screenshotName: 'edited'});
        await component.getByRole('button', {name: 'Clear', exact: true}).click();
        await expect(component.getByRole('textbox')).toHaveValue('');
        await expect(component.getByTestId('form-value')).toHaveText(JSON.stringify(''));
        await expectScreenshot({screenshotName: 'cleared'});
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
        await expect(component.getByRole('textbox')).toHaveValue('');
        await expect(component.getByRole('textbox')).toHaveAttribute(
            'placeholder',
            schema.examples![0],
        );
        await expectScreenshot();
    });
    test('reports minimum length after submit', async ({mount, expectScreenshot}) => {
        const component = await mount(
            <SchemaForm
                schema={{
                    ...schema,
                    minLength: 5,
                    nodeParameters: {
                        ...schema.nodeParameters,
                        errorMessages: {minLength: 'At least five characters'},
                    },
                }}
                value={'ab'}
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
        await expect(component.locator('[data-sr-error]')).toHaveText('At least five characters');
        await expectScreenshot();
    });
});
