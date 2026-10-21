import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import {SchemaForm} from '~playwright/core/SchemaForm';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {SchemaRendererMode} from '../../../../core/constants';

import {createSchema, value} from './helpers';

test.describe('SchemaRenderer TextContent', () => {
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
                await expect(component.getByText('Passed', {exact: true})).toBeVisible();
                await expectScreenshot();
            });
        }
    }
    test('description fallback with empty input', async ({mount, expectScreenshot}) => {
        const base = createSchema('row');
        const schema = {
            ...base,
            description: '<strong>Unspecified</strong> status',
            nodeParameters: {
                ...base.nodeParameters,
                entityProps: {iconName: 'CircleInfo', iconProps: {size: 20}},
            },
        };
        const component = await mount(
            <SchemaForm
                schema={schema}
                value={undefined}
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
        await expect(
            component
                .locator('.g-label.sr-text-content')
                .getByText('Unspecified status', {exact: true}),
        ).toBeVisible();
        await expectScreenshot();
    });

    test('custom title and long value', async ({mount, expectScreenshot}) => {
        const base = createSchema('column');
        const schema = {
            ...base,
            nodeParameters: {
                ...base.nodeParameters,
                entityProps: {title: '<em>Build</em> status', theme: 'warning', iconName: 'Clock'},
            },
        };
        const component = await mount(
            <SchemaForm
                schema={schema}
                value={'Waiting for the deployment approval from the maintenance team'}
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
        await expect(component.getByText('Build status', {exact: true})).toBeVisible();
        await expect(
            component.getByText('Waiting for the deployment approval from the maintenance team', {
                exact: true,
            }),
        ).toBeVisible();
        await expectScreenshot();
    });
});
