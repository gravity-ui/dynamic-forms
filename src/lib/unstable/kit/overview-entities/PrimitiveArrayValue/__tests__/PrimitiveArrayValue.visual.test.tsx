import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import {SchemaForm} from '~playwright/core/SchemaForm';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {SchemaRendererMode} from '../../../../core/constants';

import {createSchema, value} from './helpers';

test.describe('SchemaRenderer PrimitiveArrayValue', () => {
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
                await expect(component.getByTestId('input')).toHaveText('Draft, Published');
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

    test('column direction renders each described item separately', async ({
        mount,
        expectScreenshot,
    }) => {
        const base = createSchema('row');
        const schema = {
            ...base,
            nodeParameters: {
                ...base.nodeParameters,
                entityProps: {...base.nodeParameters?.entityProps, direction: 'column'},
            },
        };
        const component = await mount(
            <SchemaForm
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
        await expect(component.getByTestId('input[0]')).toHaveText('Draft');
        await expect(component.getByTestId('input[1]')).toHaveText('Published');
        await expectScreenshot();
    });

    test('unknown enum values remain visible', async ({mount, expectScreenshot}) => {
        const schema = createSchema('row');
        const component = await mount(
            <SchemaForm
                schema={schema}
                value={['draft', 'unknown']}
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
        await expect(component.getByTestId('input')).toHaveText('Draft, unknown');
        await expectScreenshot();
    });
});
