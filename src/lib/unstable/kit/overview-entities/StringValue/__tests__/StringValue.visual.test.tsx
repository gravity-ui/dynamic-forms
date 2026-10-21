import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import {SchemaForm} from '~playwright/core/SchemaForm';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {SchemaRendererMode} from '../../../../core/constants';

import {createSchema, value} from './helpers';

test.describe('SchemaRenderer StringValue', () => {
    for (const mode of [SchemaRendererMode.Overview]) {
        for (const {layout, layoutName, size, view} of rendererVariants) {
            test(`${mode} ${layoutName} ${size} ${view}`, async ({mount, expectScreenshot}) => {
                const schema = createSchema(layout);
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
                await expect(component.getByTestId('input')).toHaveText(value);
                await expectScreenshot();
            });
        }
    }
    test('empty overview uses the empty value marker', async ({mount, expectScreenshot}) => {
        const schema = createSchema('cell');
        const component = await mount(
            <SchemaForm
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

    test('long text expands on click', async ({mount, expectScreenshot}) => {
        const schema = createSchema('row');
        const longValue =
            'A long account description that must not be cut off when expanded. '.repeat(20);
        const component = await mount(
            <SchemaForm
                schema={schema}
                value={longValue}
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
        const text = component.getByTestId('input');
        await expect(text).toHaveClass(/sr-long-value_long/);
        await text.click();
        await expect(text).toHaveClass(/sr-long-value_open/);
        await expect(text).toHaveText(longValue.trim());
        await expectScreenshot();
    });
});
