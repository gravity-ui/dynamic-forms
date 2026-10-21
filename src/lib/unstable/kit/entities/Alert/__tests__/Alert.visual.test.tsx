import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import {SchemaForm} from '~playwright/core/SchemaForm';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {SchemaRendererMode} from '../../../../core/constants';

import {createSchema, value} from './helpers';

test.describe('SchemaRenderer Alert', () => {
    for (const mode of [SchemaRendererMode.Form, SchemaRendererMode.Overview]) {
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
                await expect(
                    component.getByText('Review the settings before saving.', {exact: true}),
                ).toBeVisible();
                await expectScreenshot();
            });
        }
    }
    test('warning theme with custom icon', async ({mount, expectScreenshot}) => {
        const base = createSchema('row');
        const schema = {
            ...base,
            nodeParameters: {
                ...base.nodeParameters,
                entityProps: {
                    ...base.nodeParameters?.entityProps,
                    theme: 'warning',
                    iconName: 'CircleExclamation',
                    iconProps: {size: 20},
                },
            },
        };
        const component = await mount(
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
                width={600}
            />,
        );
        await expect(component.getByText('Notice', {exact: true})).toBeVisible();
        await expect(
            component.getByText('Review the settings before saving.', {exact: true}),
        ).toBeVisible();
        await expectScreenshot();
    });

    test('danger theme with custom icon', async ({mount, expectScreenshot}) => {
        const base = createSchema('row');
        const schema = {
            ...base,
            nodeParameters: {
                ...base.nodeParameters,
                entityProps: {
                    ...base.nodeParameters?.entityProps,
                    theme: 'danger',
                    iconName: 'CircleExclamation',
                    iconProps: {size: 20},
                },
            },
        };
        const component = await mount(
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
                width={600}
            />,
        );
        await expect(component.getByText('Notice', {exact: true})).toBeVisible();
        await expect(
            component.getByText('Review the settings before saving.', {exact: true}),
        ).toBeVisible();
        await expectScreenshot();
    });

    test('success theme with custom icon', async ({mount, expectScreenshot}) => {
        const base = createSchema('row');
        const schema = {
            ...base,
            nodeParameters: {
                ...base.nodeParameters,
                entityProps: {
                    ...base.nodeParameters?.entityProps,
                    theme: 'success',
                    iconName: 'CircleExclamation',
                    iconProps: {size: 20},
                },
            },
        };
        const component = await mount(
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
                width={600}
            />,
        );
        await expect(component.getByText('Notice', {exact: true})).toBeVisible();
        await expect(
            component.getByText('Review the settings before saving.', {exact: true}),
        ).toBeVisible();
        await expectScreenshot();
    });

    test('title collapses and expands the message', async ({mount, expectScreenshot}) => {
        const schema = createSchema('row');
        const component = await mount(
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
                width={600}
            />,
        );
        await component.getByText('Notice', {exact: true}).click();
        await expect(component.locator('.sr-alert__message')).toBeHidden();
        await expectScreenshot({screenshotName: 'Alert message collapsed'});
        await component.getByText('Notice', {exact: true}).click();
        await expect(component.locator('.sr-alert__message')).toBeVisible();
        await expectScreenshot({screenshotName: 'Alert message expanded'});
    });
});
