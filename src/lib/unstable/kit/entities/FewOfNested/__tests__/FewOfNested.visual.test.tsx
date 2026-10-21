import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import {SchemaForm} from '~playwright/core/SchemaForm';
import {expectInsideScreenshot} from '~playwright/core/expectInsideScreenshot';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {JsonSchemaType, NodeType, SchemaRendererMode} from '../../../../core/constants';

import {createSchema, value} from './helpers';

test.describe('SchemaRenderer FewOfNested', () => {
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
    test('deselecting a branch preserves the other value', async ({
        mount,
        page,
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
        await component.getByRole('combobox').click();
        await page.getByRole('option', {name: 'Age', exact: true}).click();
        await page.keyboard.press('Escape');
        await expect(component.getByTestId('input.age')).toHaveCount(0);
        await expect(component.getByTestId('form-value')).toHaveText('{"name":"Ada"}');
        await expectScreenshot();
    });

    test('configured order selects the initial branch before adding another', async ({
        mount,
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
                        type: JsonSchemaType.Array,
                        title: 'Fields',
                        items: {type: JsonSchemaType.String, enum: ['name', 'age']},
                        nodeParameters: {
                            type: NodeType.Array,
                            entity: 'checkbox_group',
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
        await expect(component.getByRole('checkbox', {name: 'Age', exact: true})).toBeChecked();
        await expect(component.getByTestId('input.age').locator('input')).toBeVisible();
        await expect(component.getByTestId('input.name')).toHaveCount(0);
        await component.getByTestId('input.age').locator('input').fill('37');
        await component.getByTestId('input.age').locator('input').blur();
        await component.getByRole('checkbox', {name: 'Name', exact: true}).check();
        await component.getByTestId('input.name').locator('input').fill('Ada');
        const fields = component.locator('[data-qa="input.age"], [data-qa="input.name"]');
        await expect(fields).toHaveCount(2);
        expect(
            await fields.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-qa'))),
        ).toEqual(['input.age', 'input.name']);
        await expect(component.getByTestId('form-value')).toHaveText('{"age":37,"name":"Ada"}');
        await expectScreenshot();
    });
});
