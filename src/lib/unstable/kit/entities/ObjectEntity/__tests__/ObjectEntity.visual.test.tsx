import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import {SchemaForm} from '~playwright/core/SchemaForm';
import {expectInsideScreenshot} from '~playwright/core/expectInsideScreenshot';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {JsonSchemaType, NodeType, SchemaRendererMode} from '../../../../core/constants';
import type {JsonSchema} from '../../../../core/types';

import {createSchema, value} from './helpers';

test.describe('SchemaRenderer ObjectEntity', () => {
    for (const mode of [SchemaRendererMode.Form, SchemaRendererMode.Overview]) {
        for (const {layout, layoutName, size, view} of rendererVariants) {
            test(`${mode} ${layoutName} ${size} ${view}`, async ({
                mount,
                page,
                expectScreenshot,
            }) => {
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
                        width={1000}
                    />,
                );
                if (mode === SchemaRendererMode.Form) {
                    await expect(component.getByTestId('input.name').locator('input')).toHaveValue(
                        'Ada',
                    );
                } else {
                    await expect(component.getByText('Ada', {exact: true})).toBeVisible();
                }
                const frame = page.locator('.playwright-wrapper-test');
                if (mode === SchemaRendererMode.Form) {
                    for (const qa of ['input.name', 'input.age']) {
                        await expectInsideScreenshot(
                            component.getByTestId(qa).locator('input'),
                            frame,
                        );
                    }
                } else {
                    for (const text of ['Ada', '37']) {
                        await expectInsideScreenshot(
                            component.getByText(text, {exact: true}),
                            frame,
                        );
                    }
                }
                await expectScreenshot();
            });
        }
    }
    test('explicit property order and editing preserve other values', async ({
        mount,
        expectScreenshot,
    }) => {
        const base = createSchema('section');
        const schema: JsonSchema = {
            ...base,
            nodeParameters: {...base.nodeParameters, entityProps: {order: ['age', 'name']}},
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
        await expect(component.locator('input').first()).toHaveValue('37');
        await expect(component.locator('input').nth(1)).toHaveValue('Ada');
        await component.getByTestId('input.name').locator('input').fill('Grace');
        await expect(component.getByTestId('form-value')).toHaveText('{"name":"Grace","age":37}');
        await expectScreenshot();
    });

    test('hidden child keeps its data without a visible control', async ({
        mount,
        expectScreenshot,
    }) => {
        const base = createSchema('section');
        const schema: JsonSchema = {
            ...base,
            properties: {
                ...base.properties,
                name: {
                    type: JsonSchemaType.String,
                    title: 'Private name',
                    nodeParameters: {
                        type: NodeType.String,
                        entity: 'base',
                        layout: 'row',
                        flags: {hidden: true},
                    },
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
        await expect(component.getByTestId('input.name')).not.toBeVisible();
        await expect(component.getByTestId('input.age').locator('input')).toHaveValue('37');
        await expect(component.getByTestId('form-value')).toHaveText('{"name":"Ada","age":37}');
        await expectScreenshot();
    });
});
