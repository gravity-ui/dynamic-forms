import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import {SchemaForm} from '~playwright/core/SchemaForm';
import {expectInsideScreenshot} from '~playwright/core/expectInsideScreenshot';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {JsonSchemaType, NodeType, SchemaRendererMode} from '../../../../core/constants';
import type {JsonSchema} from '../../../../core/types';

import {createSchema, value} from './helpers';

test.describe('SchemaRenderer ArrayTable', () => {
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
                    await expect(
                        component.getByTestId('input[0].name').locator('input'),
                    ).toHaveValue('Ada');
                } else {
                    await expect(component.getByText('Ada', {exact: true})).toBeVisible();
                }
                const frame = page.locator('.playwright-wrapper-test');
                if (mode === SchemaRendererMode.Form) {
                    for (const qa of [
                        'input[0].name',
                        'input[0].age',
                        'input[1].name',
                        'input[1].age',
                    ]) {
                        await expectInsideScreenshot(
                            component.getByTestId(qa).locator('input'),
                            frame,
                        );
                    }
                } else {
                    for (const text of ['Ada', '37', 'Grace', '45']) {
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
    test('add edit and remove a row', async ({mount, expectScreenshot}) => {
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
        await component.getByTestId('input-add-button').click();
        await component.getByTestId('input[2].name').locator('input').fill('Linus');
        await component.getByTestId('input[2].age').locator('input').fill('54');
        await component.getByTestId('input[2].age').locator('input').blur();
        await component.getByTestId('input[0]-remove-button').click();
        await expect(component.getByTestId('form-value')).toHaveText(
            '[{"name":"Grace","age":45},{"name":"Linus","age":54}]',
        );
        await expectScreenshot();
    });

    test('column order follows the explicit order prop', async ({mount, expectScreenshot}) => {
        const base = createSchema('section');
        const schema: JsonSchema = {
            ...base,
            nodeParameters: {
                ...base.nodeParameters,
                entityProps: {order: ['age', 'name'], addButtonText: 'Add person'},
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
        await expect(component.locator('.sr-array-table__column-title')).toHaveText([
            'Age',
            'Name',
        ]);
        await expect(component.getByTestId('input[0].age').locator('input')).toHaveValue('37');
        await expectScreenshot();
    });

    test('primitive rows use a single data column', async ({mount, expectScreenshot}) => {
        const base = createSchema('section');
        const schema: JsonSchema = {
            ...base,
            items: {
                type: JsonSchemaType.String,
                title: 'Name',
                nodeParameters: {type: NodeType.String, entity: 'base', layout: 'cell'},
            },
            nodeParameters: {...base.nodeParameters, entityProps: {addButtonText: 'Add name'}},
        };
        const component = await mount(
            <SchemaForm
                schema={schema}
                value={['Ada', 'Grace']}
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
        await expect(component.getByRole('textbox')).toHaveCount(2);
        await expect(component.getByTestId('input[0]').locator('input')).toHaveValue('Ada');
        await expectScreenshot();
    });

    test('tuple rows cannot be added or removed', async ({mount, expectScreenshot}) => {
        const base = createSchema('section');
        const schema: JsonSchema = {
            ...base,
            items: [base.items as JsonSchema, base.items as JsonSchema],
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
        await expect(component.getByTestId('input-add-button')).toHaveCount(0);
        await expect(component.locator('[data-qa$="-remove-button"]')).toHaveCount(0);
        await expect(component.getByTestId('input[1].name').locator('input')).toHaveValue('Grace');
        await expectScreenshot();
    });

    test('empty overview uses the empty value marker', async ({mount, expectScreenshot}) => {
        const schema = createSchema('cell');
        const component = await mount(
            <SchemaForm
                schema={schema}
                value={[]}
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
