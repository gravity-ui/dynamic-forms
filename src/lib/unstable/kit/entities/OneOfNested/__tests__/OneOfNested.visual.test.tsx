import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import {SchemaForm} from '~playwright/core/SchemaForm';
import {expectInsideScreenshot} from '~playwright/core/expectInsideScreenshot';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {JsonSchemaType, NodeType, SchemaRendererMode} from '../../../../core/constants';

import {createSchema, value} from './helpers';

test.describe('SchemaRenderer OneOfNested', () => {
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
                    for (const qa of ['input.name']) {
                        await expectInsideScreenshot(
                            component.getByTestId(qa).locator('input'),
                            frame,
                        );
                    }
                } else {
                    for (const text of ['Ada']) {
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
    test('switching branches discards the previous branch value', async ({
        mount,
        expectScreenshot,
    }) => {
        const schema = createSchema('section');
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
        await component.getByRole('switch').press('Space');
        await component.getByTestId('input.age').locator('input').fill('37');
        await component.getByTestId('input.age').locator('input').blur();
        await expect(component.getByTestId('input.name')).toHaveCount(0);
        await expect(component.getByTestId('form-value')).toHaveText('{"age":37}');
        await expectScreenshot();
    });

    test('select toggler and order can start from a different branch', async ({
        mount,
        page,
        expectScreenshot,
    }) => {
        const base = createSchema('section');
        const schema = {
            ...base,
            nodeParameters: {
                ...base.nodeParameters,
                entityProps: {
                    order: ['age', 'name'],
                    withIndent: false,
                    toggler: {
                        type: JsonSchemaType.String,
                        title: 'Field',
                        enum: ['name', 'age'],
                        nodeParameters: {
                            type: NodeType.String,
                            entity: 'select',
                            layout: 'row',
                            entityProps: {enumDescriptions: {name: 'Name', age: 'Age'}},
                        },
                    },
                },
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
        await expect(component.getByTestId('input.age').locator('input')).toBeVisible();
        await component.getByRole('combobox').click();
        await page.getByRole('option', {name: 'Name', exact: true}).click();
        await component.getByTestId('input.name').locator('input').fill('Grace');
        await expect(component.getByTestId('form-value')).toHaveText('{"name":"Grace"}');
        await expectScreenshot();
    });
});
