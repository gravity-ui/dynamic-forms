import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import {SchemaForm} from '~playwright/core/SchemaForm';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {SchemaRendererMode} from '../../../../core/constants';

import {createSchema, value} from './helpers';

test.describe('SchemaRenderer BooleanValue', () => {
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
                await expect(component.getByTestId('input')).toHaveText('Enabled');
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

    test('false uses its description and color', async ({mount, expectScreenshot}) => {
        const schema = createSchema('row');
        const component = await mount(
            <SchemaForm
                schema={schema}
                value={false}
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
        await expect(component.getByTestId('input')).toHaveText('Disabled');
        await expectScreenshot();
    });

    test('raw boolean text without descriptions', async ({mount, expectScreenshot}) => {
        const base = createSchema('row');
        const schema = {...base, nodeParameters: {...base.nodeParameters, entityProps: {}}};
        const component = await mount(
            <SchemaForm
                schema={schema}
                value={false}
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
        await expect(component.getByTestId('input')).toHaveText('false');
        await expectScreenshot();
    });
});
