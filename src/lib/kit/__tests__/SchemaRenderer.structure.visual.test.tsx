import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import {SchemaForm} from '~playwright/core/SchemaForm';

import {JsonSchemaType, NodeType, SchemaRendererMode} from '../../core/constants';
import type {JsonSchemaObject} from '../../core/types';

import {
    arraySchema,
    checkboxSchema,
    fewOfSchema,
    inlineSchema,
    objectSchema,
    oneOfSchema,
    selectionSchema,
    structureCases,
    tableSchema,
} from './SchemaRenderer.structure.helpers';

test.describe('SchemaRenderer structure', () => {
    for (const mode of [SchemaRendererMode.Form, SchemaRendererMode.Overview]) {
        test.describe(mode, () => {
            for (const {name, schema, value} of structureCases) {
                test(name, async ({mount, expectScreenshot}) => {
                    const component = await mount(
                        <SchemaForm schema={schema} value={value} mode={mode} />,
                    );

                    await expect(component.getByTestId('form-value')).toHaveText(
                        JSON.stringify(value),
                    );
                    await expect(component.locator('.sr-entity-container').first()).toBeVisible();
                    await expectScreenshot({fullPage: name.includes('nested')});
                });
            }

            for (const layout of ['row', 'column', 'section', 'card', 'accordeon', 'transparent']) {
                test(`layout ${layout}`, async ({mount, expectScreenshot}) => {
                    const schema: JsonSchemaObject = {
                        ...objectSchema,
                        nodeParameters: {
                            ...objectSchema.nodeParameters,
                            layout,
                            layoutProps: {descriptionType: 'bottom'},
                            flags: {open: true},
                        },
                    };
                    const component = await mount(
                        <SchemaForm
                            schema={schema}
                            value={{name: 'Ada', age: 37}}
                            mode={mode}
                            width={900}
                        />,
                    );

                    await expect(component.getByTestId('form-value')).toHaveText(
                        '{"name":"Ada","age":37}',
                    );
                    await expectScreenshot();
                });
            }
        });
    }

    for (const size of ['s', 'm', 'l', 'xl'] as const) {
        test(`inline controls size ${size}`, async ({mount, expectScreenshot}) => {
            await mount(
                <SchemaForm schema={inlineSchema} value={{name: 'Ada', age: 37}} size={size} />,
            );

            await expectScreenshot();
        });
    }

    test('disabled array cannot add items', async ({mount, expectScreenshot}) => {
        const component = await mount(
            <SchemaForm
                schema={{
                    ...arraySchema,
                    nodeParameters: {...arraySchema.nodeParameters, flags: {disabled: true}},
                }}
                value={['Ada']}
            />,
        );

        await expect(component.getByRole('button', {name: 'Add member'})).toBeDisabled();
        await expectScreenshot();
    });

    test('read only array is omitted in form and displayed in overview', async ({
        mount,
        expectScreenshot,
    }) => {
        const schema: JsonSchemaObject = {
            ...objectSchema,
            properties: {
                name: {
                    type: JsonSchemaType.String,
                    title: 'Team name',
                    nodeParameters: {type: NodeType.String, entity: 'base', layout: 'row'},
                },
                members: {...arraySchema, readOnly: true},
            },
        };
        const value = {name: 'Maintainers', members: ['Ada', 'Grace']};
        const component = await mount(
            <div>
                <section data-qa="form-mode">
                    <h3>Form</h3>
                    <SchemaForm schema={schema} value={value} />
                </section>
                <section data-qa="overview-mode">
                    <h3>Overview</h3>
                    <SchemaForm schema={schema} value={value} mode={SchemaRendererMode.Overview} />
                </section>
            </div>,
        );
        const form = component.getByTestId('form-mode');
        const overview = component.getByTestId('overview-mode');

        await expect(form.getByRole('textbox')).toHaveCount(1);
        await expect(form.getByRole('textbox')).toHaveValue('Maintainers');
        await expect(form.getByTestId('input.members-add-button')).toHaveCount(0);
        await expect(form.getByTestId('form-value')).toHaveText(JSON.stringify(value));
        await expect(overview.getByText('Ada', {exact: true})).toBeVisible();
        await expect(overview.getByText('Grace', {exact: true})).toBeVisible();
        await expect(overview.getByRole('textbox')).toHaveCount(0);
        await expect(overview.getByTestId('form-value')).toHaveText(JSON.stringify(value));
        await expectScreenshot();
    });

    test('hidden field retains its value without rendering', async ({mount, expectScreenshot}) => {
        const schema: JsonSchemaObject = {
            ...objectSchema,
            properties: {
                ...objectSchema.properties,
                name: {
                    type: JsonSchemaType.String,
                    title: 'Hidden name',
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
            <SchemaForm schema={schema} value={{name: 'Ada', age: 37}} />,
        );

        await expect(component.getByText('Hidden name', {exact: true})).not.toBeVisible();
        await expect(component.getByTestId('form-value')).toHaveText('{"name":"Ada","age":37}');
        await expectScreenshot();
    });

    test('required and copy flags with description', async ({mount, expectScreenshot}) => {
        await mount(
            <SchemaForm
                schema={{
                    type: JsonSchemaType.String,
                    title: 'Account identifier',
                    description: 'Use this identifier when contacting support',
                    nodeParameters: {
                        type: NodeType.String,
                        entity: 'base',
                        layout: 'row',
                        layoutProps: {descriptionType: 'bottom'},
                        flags: {required: true, copy: true},
                    },
                }}
                value="account-42"
            />,
        );

        await expectScreenshot();
    });

    test('array adds edits and removes an item', async ({mount, expectScreenshot}) => {
        const component = await mount(<SchemaForm schema={arraySchema} value={['Ada', 'Grace']} />);

        await component.getByTestId('input-add-button').click();
        await component.getByTestId('input[2]').locator('input').fill('Linus');
        await component.getByTestId('input[0]-remove-button').click();

        await expect(component.getByTestId('form-value')).toHaveText('["Grace","Linus"]');
        await expect(component.getByRole('textbox')).toHaveCount(2);
        await expectScreenshot();
    });

    test('table adds edits and removes a row', async ({mount, expectScreenshot}) => {
        const component = await mount(
            <SchemaForm schema={tableSchema} value={[{name: 'Ada', age: 37}]} />,
        );

        await component.getByTestId('input-add-button').click();
        await component.getByTestId('input[1].name').locator('input').fill('Grace');
        await component.getByTestId('input[1].age').locator('input').fill('45');
        await component.getByTestId('input[1].age').locator('input').blur();
        await component.getByTestId('input[0]-remove-button').click();

        await expect(component.getByTestId('form-value')).toHaveText('[{"name":"Grace","age":45}]');
        await expectScreenshot();
    });

    test('multi select adds a selected value', async ({mount, page, expectScreenshot}) => {
        const component = await mount(<SchemaForm schema={selectionSchema} value={['draft']} />);

        await component.getByRole('combobox').click();
        await page.getByRole('option', {name: 'Published', exact: true}).click();
        await page.keyboard.press('Escape');

        await expect(component.getByTestId('form-value')).toHaveText('["draft","published"]');
        await expectScreenshot();
    });

    test('checkbox group toggles selected values', async ({mount, expectScreenshot}) => {
        const component = await mount(<SchemaForm schema={checkboxSchema} value={['draft']} />);

        await component.getByRole('checkbox', {name: 'Published', exact: true}).check();
        await component.getByRole('checkbox', {name: 'Draft', exact: true}).uncheck();

        await expect(component.getByTestId('form-value')).toHaveText('["published"]');
        await expectScreenshot();
    });

    test('one of switches branches and discards the old value', async ({
        mount,
        expectScreenshot,
    }) => {
        const component = await mount(<SchemaForm schema={oneOfSchema} value={{name: 'Ada'}} />);

        await component.getByRole('switch').press('Space');
        await component.getByTestId('input.age').locator('input').fill('37');
        await component.getByTestId('input.age').locator('input').blur();

        await expect(component.getByTestId('input.name')).toHaveCount(0);
        await expect(component.getByTestId('form-value')).toHaveText('{"age":37}');
        await expectScreenshot({fullPage: true});
    });

    test('few of hides a branch and preserves the other value', async ({
        mount,
        page,
        expectScreenshot,
    }) => {
        const component = await mount(
            <SchemaForm schema={fewOfSchema} value={{name: 'Ada', age: 37}} />,
        );

        await component.getByRole('combobox').click();
        await page.getByRole('option', {name: 'Age', exact: true}).click();
        await page.keyboard.press('Escape');

        await expect(component.getByTestId('input.age')).toHaveCount(0);
        await expect(component.getByTestId('form-value')).toHaveText('{"name":"Ada"}');
        await expectScreenshot({fullPage: true});
    });

    test('collapsed accordion expands without resetting values', async ({
        mount,
        expectScreenshot,
    }) => {
        const component = await mount(
            <SchemaForm
                schema={{
                    ...objectSchema,
                    nodeParameters: {
                        ...objectSchema.nodeParameters,
                        layout: 'accordeon',
                        flags: {open: false},
                    },
                }}
                value={{name: 'Ada', age: 37}}
            />,
        );

        await expect(component.getByTestId('input.name')).not.toBeVisible();
        await expectScreenshot({screenshotName: 'SchemaRenderer structure accordion collapsed'});
        await component.getByRole('button', {name: 'Profile', exact: true}).click();
        await expect(component.getByTestId('input.name')).toBeVisible();
        await expect(component.getByTestId('form-value')).toHaveText('{"name":"Ada","age":37}');
        await expectScreenshot({screenshotName: 'SchemaRenderer structure accordion expanded'});
    });
});
