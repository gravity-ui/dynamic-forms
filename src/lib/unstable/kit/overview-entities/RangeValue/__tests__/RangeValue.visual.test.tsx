import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import {SchemaForm} from '~playwright/core/SchemaForm';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {JsonSchemaType, SchemaRendererMode} from '../../../../core/constants';

import {createSchema, value} from './helpers';

test.describe('SchemaRenderer RangeValue', () => {
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
                await expect(component.getByTestId('input.from')).toHaveText('20');
                await expect(component.getByTestId('input.to')).toHaveText('80');
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

    test('custom property keys and separator preserve zero', async ({mount, expectScreenshot}) => {
        const base = createSchema('row');
        const schema = {
            ...base,
            properties: {start: {type: JsonSchemaType.Number}, end: {type: JsonSchemaType.Number}},
            nodeParameters: {
                ...base.nodeParameters,
                entityProps: {propertyKeys: ['start', 'end'], separator: 'until'},
            },
        };
        const component = await mount(
            <SchemaForm
                schema={schema}
                value={{start: 0, end: 100}}
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
        await expect(component.getByTestId('input.start')).toHaveText('0');
        await expect(component.getByTestId('input.end')).toHaveText('100');
        await expect(component.getByText('until', {exact: true})).toBeVisible();
        await expectScreenshot();
    });

    test('missing range endpoint uses the empty value marker', async ({
        mount,
        expectScreenshot,
    }) => {
        const schema = createSchema('cell');
        const component = await mount(
            <SchemaForm
                schema={schema}
                value={{from: 20}}
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
});
