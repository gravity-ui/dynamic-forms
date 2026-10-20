import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import {SchemaForm} from '~playwright/core/SchemaForm';

import {JsonSchemaType, NodeType, SchemaRendererMode} from '../../core/constants';
import type {JsonSchemaObject} from '../../core/types';

import {
    INITIAL_DATE,
    INPUT_CASES,
    booleanSchema,
    dateSchema,
    numberScaleSchema,
    numberSchema,
    radioSchema,
    segmentedSchema,
    selectSchema,
    stringScaleSchema,
    stringSchema,
} from './SchemaRenderer.inputs.fixtures';

test.describe('SchemaRenderer inputs', () => {
    for (const inputCase of INPUT_CASES) {
        test(`${inputCase.name} form`, async ({mount, expectScreenshot}) => {
            const component = await mount(
                <SchemaForm schema={inputCase.schema} value={inputCase.value} />,
            );

            await expect(component.getByText(inputCase.schema.title!, {exact: true})).toBeVisible();
            await expect(component.getByTestId('form-value')).toHaveText(
                JSON.stringify(inputCase.value) ?? '',
            );
            await expectScreenshot();
        });

        test(`${inputCase.name} overview`, async ({mount, expectScreenshot}) => {
            const value = inputCase.overviewValue ?? inputCase.value;
            const component = await mount(
                <SchemaForm
                    schema={inputCase.schema}
                    value={value}
                    mode={SchemaRendererMode.Overview}
                />,
            );

            await expect(component.getByText(inputCase.schema.title!, {exact: true})).toBeVisible();
            await expect(component.getByTestId('form-value')).toHaveText(
                JSON.stringify(value) ?? '',
            );
            await expect(component.locator('input:not([type="hidden"]), textarea')).toHaveCount(0);
            await expectScreenshot();
        });
    }

    for (const name of ['text', 'textarea', 'password', 'number zero', 'date']) {
        const inputCase = INPUT_CASES.find((item) => item.name === name)!;

        test(`${name} readOnly`, async ({mount, expectScreenshot}) => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                nodeParameters: {type: NodeType.Object, entity: 'base', layout: 'transparent'},
                properties: {
                    locked: {...inputCase.schema, readOnly: true},
                    editable: stringSchema('base', {title: 'Editable field'}),
                },
            };
            const value = {locked: inputCase.value, editable: 'Visible in both modes'};
            const component = await mount(
                <div>
                    <section aria-label="Form mode">
                        <SchemaForm schema={schema} value={value} />
                    </section>
                    <section aria-label="Overview mode">
                        <SchemaForm
                            schema={schema}
                            value={value}
                            mode={SchemaRendererMode.Overview}
                        />
                    </section>
                </div>,
            );
            const form = component.getByRole('region', {name: 'Form mode', exact: true});
            const overview = component.getByRole('region', {name: 'Overview mode', exact: true});

            await expect(form.getByText(inputCase.schema.title!, {exact: true})).toHaveCount(0);
            await expect(form.getByRole('textbox')).toHaveValue(value.editable);
            await expect(overview.getByText(inputCase.schema.title!, {exact: true})).toBeVisible();
            await expect(overview.locator('input:not([type="hidden"]), textarea')).toHaveCount(0);
            await expect(form.getByTestId('form-value')).toHaveText(JSON.stringify(value));
            await expect(overview.getByTestId('form-value')).toHaveText(JSON.stringify(value));
            await expectScreenshot();
        });
    }

    for (const entity of ['base', 'switch']) {
        test(`${entity} disabled flag`, async ({mount, expectScreenshot}) => {
            const component = await mount(
                <SchemaForm
                    schema={booleanSchema(entity, {nodeParameters: {flags: {disabled: true}}})}
                    value
                />,
            );

            await expect(component.locator('input')).toBeDisabled();
            await expect(component.getByTestId('form-value')).toHaveText('true');
            await expectScreenshot();
        });
    }

    test('select disabled flag', async ({mount, expectScreenshot}) => {
        const component = await mount(
            <SchemaForm
                schema={{
                    ...selectSchema,
                    nodeParameters: {...selectSchema.nodeParameters, flags: {disabled: true}},
                }}
                value="draft"
            />,
        );

        await expect(component.getByTestId('input')).toBeDisabled();
        await expectScreenshot();
    });

    test('edits a string and clears it', async ({mount, expectScreenshot}) => {
        const component = await mount(<SchemaForm schema={stringSchema()} value="Old name" />);
        const input = component.getByRole('textbox');

        await input.fill('New name');
        await expect(component.getByTestId('form-value')).toHaveText('"New name"');
        await expectScreenshot({screenshotName: 'String after editing'});
        await input.fill('');
        await input.blur();
        await expect(input).toHaveValue('');
        await expectScreenshot({screenshotName: 'String after clearing'});
    });

    test('edits multiline text', async ({mount, expectScreenshot}) => {
        const component = await mount(
            <SchemaForm
                schema={stringSchema('textarea', {nodeParameters: {entityProps: {minRows: 3}}})}
            />,
        );
        const value = 'A description\nwith two lines';

        await component.getByRole('textbox').fill(value);
        await expect(component.getByTestId('form-value')).toHaveText(JSON.stringify(value));
        await expectScreenshot();
    });

    test('reveals and edits a password', async ({mount, expectScreenshot}) => {
        const component = await mount(
            <SchemaForm schema={stringSchema('password')} value="initial-secret" />,
        );

        await component.locator('input[type="password"]').fill('changed-secret');
        await component.getByRole('button', {name: 'Show password', exact: true}).click();
        await expect(component.getByRole('textbox')).toHaveValue('changed-secret');
        await expect(component.getByTestId('form-value')).toHaveText('"changed-secret"');
        await expectScreenshot();
    });

    test('selects an option with a description', async ({mount, page, expectScreenshot}) => {
        const component = await mount(<SchemaForm schema={selectSchema} value="draft" />);

        await component.getByTestId('input').click();
        await expect(page.getByRole('option', {name: /Published/})).toBeVisible();
        await expectScreenshot({fullPage: true, screenshotName: 'Select options'});
        await page.getByRole('option', {name: /Published/}).click();
        await expect(component.getByTestId('form-value')).toHaveText('"published"');
        await expectScreenshot({screenshotName: 'Select after selection'});
    });

    test('radio options preserve disabled state and update the value', async ({
        mount,
        expectScreenshot,
    }) => {
        const component = await mount(<SchemaForm schema={radioSchema} value="private" />);

        await expect(component.getByRole('radio', {name: 'Public', exact: true})).toBeDisabled();
        await component.getByRole('radio', {name: 'Team', exact: true}).check();
        await expect(component.getByTestId('form-value')).toHaveText('"team"');
        await expectScreenshot();
    });

    test('segmented radio changes the selected value', async ({mount, expectScreenshot}) => {
        const component = await mount(<SchemaForm schema={segmentedSchema} value="private" />);

        await component.getByRole('radio', {name: 'Team', exact: true}).check();
        await expect(component.getByTestId('form-value')).toHaveText('"team"');
        await expectScreenshot();
    });

    test('checkbox toggles a boolean', async ({mount, expectScreenshot}) => {
        const component = await mount(<SchemaForm schema={booleanSchema()} value={false} />);

        await component.getByRole('checkbox').check();
        await expect(component.getByTestId('form-value')).toHaveText('true');
        await expectScreenshot();
        await component.getByRole('checkbox').uncheck();
        await expect(component.getByTestId('form-value')).toHaveText('false');
    });

    test('switch toggles a boolean', async ({mount, expectScreenshot}) => {
        const component = await mount(<SchemaForm schema={booleanSchema('switch')} value />);

        await component.getByRole('switch').press('Space');
        await expect(component.getByTestId('form-value')).toHaveText('false');
        await expectScreenshot();
    });

    test('number editing preserves the numeric value type', async ({mount, expectScreenshot}) => {
        const component = await mount(
            <SchemaForm schema={numberSchema('base', {multipleOf: 0.5})} value={0} />,
        );

        await component.getByRole('spinbutton').fill('12.5');
        await component.getByRole('spinbutton').blur();
        await expect(component.getByTestId('form-value')).toHaveText('12.5');
        await expectScreenshot();
    });

    test('numeric scale converts a displayed value to base units', async ({
        mount,
        expectScreenshot,
    }) => {
        const component = await mount(<SchemaForm schema={numberScaleSchema} value={1500} />);
        const input = component.getByRole('spinbutton');

        await expect(input).toHaveValue('1.5');
        await input.fill('2');
        await input.blur();
        await expect(component.getByTestId('form-value')).toHaveText('2000');
        await expectScreenshot();
    });

    test('string scale preserves decimal precision and the string value type', async ({
        mount,
        expectScreenshot,
    }) => {
        const component = await mount(<SchemaForm schema={stringScaleSchema} value="1500" />);
        const input = component.getByRole('textbox');

        await expect(input).toHaveValue('1.5');
        await input.fill('2.125');
        await input.blur();
        await expect(component.getByTestId('form-value')).toHaveText('"2125"');
        await expectScreenshot();
    });

    test('slider supports keyboard input', async ({mount, expectScreenshot}) => {
        const component = await mount(
            <SchemaForm schema={numberSchema('slider', {minimum: 0, maximum: 100})} value={25} />,
        );
        const slider = component.getByRole('slider');

        await slider.focus();
        await slider.press('ArrowRight');
        await expect(component.getByTestId('form-value')).toHaveText('26');
        await expectScreenshot();
    });

    test('file upload reads text and updates the form', async ({mount, expectScreenshot}) => {
        const component = await mount(
            <SchemaForm
                schema={stringSchema('file_input', {
                    title: 'Configuration file',
                    nodeParameters: {entityProps: {readAsMethod: 'readAsText'}},
                })}
            />,
        );

        await component.locator('input[type="file"]').setInputFiles({
            name: 'config.txt',
            mimeType: 'text/plain',
            buffer: Buffer.from('service=gravity'),
        });
        await expect(component.getByText('config.txt', {exact: true})).toBeVisible();
        await expect(component.getByTestId('form-value')).toHaveText('"service=gravity"');
        await expectScreenshot();
    });

    test('date calendar selects a day in UTC', async ({mount, page, expectScreenshot}) => {
        await page.addInitScript(`{
            const NativeDate = Date;
            const now = NativeDate.parse('2024-02-20T12:00:00.000Z');
            window.Date = class extends NativeDate {
                constructor(...args) { super(...(args.length ? args : [now])); }
                static now() { return now; }
            };
        }`);
        await page.reload();
        expect(await page.evaluate(() => Date.now())).toBe(Date.parse('2024-02-20T12:00:00.000Z'));
        const component = await mount(<SchemaForm schema={dateSchema} value={INITIAL_DATE} />);

        await component.getByRole('button', {name: 'Calendar', exact: true}).click();
        await expect(page.getByRole('grid')).toBeVisible();
        await expectScreenshot({fullPage: true, screenshotName: 'Date calendar'});
        await page.getByRole('gridcell').filter({hasText: /^21$/}).getByRole('button').click();
        await expect
            .poll(async () =>
                (await component.getByRole('combobox').inputValue()).replace(
                    /[\u2066-\u2069]/g,
                    '',
                ),
            )
            .toBe('21.02.2024');
        await expect(component.getByTestId('form-value')).toContainText('2024-02-21');
        await expectScreenshot({screenshotName: 'Date after selection'});
    });

    for (const validation of [
        {
            name: 'minimum length',
            schema: {minLength: 3},
            value: 'ab',
            message: 'Enter at least 3 characters',
            key: 'minLength',
        },
        {
            name: 'pattern',
            schema: {pattern: '^[a-z]+$'},
            value: '123',
            message: 'Use lowercase letters',
            key: 'pattern',
        },
    ] as const) {
        test(`validates ${validation.name} on submit`, async ({mount, expectScreenshot}) => {
            const component = await mount(
                <SchemaForm
                    schema={stringSchema('base', {
                        ...validation.schema,
                        nodeParameters: {errorMessages: {[validation.key]: validation.message}},
                    })}
                    value={validation.value}
                    showSubmit
                />,
            );

            await component.getByRole('button', {name: 'Submit', exact: true}).click();
            await expect(component.locator('[data-sr-error]')).toHaveText(validation.message);
            await expectScreenshot();
        });
    }

    test('validates the numeric minimum on submit', async ({mount, expectScreenshot}) => {
        const component = await mount(
            <SchemaForm
                schema={numberSchema('base', {
                    minimum: 10,
                    nodeParameters: {errorMessages: {minimum: 'Capacity must be at least 10'}},
                })}
                value={5}
                showSubmit
            />,
        );

        await component.getByRole('button', {name: 'Submit', exact: true}).click();
        await expect(component.locator('[data-sr-error]')).toHaveText(
            'Capacity must be at least 10',
        );
        await expectScreenshot();
    });

    for (const size of ['s', 'xl'] as const) {
        test(`text input size ${size}`, async ({mount, expectScreenshot}) => {
            const component = await mount(
                <SchemaForm schema={stringSchema()} value="Gravity service" size={size} />,
            );

            await expect(component.getByRole('textbox')).toHaveValue('Gravity service');
            await expectScreenshot();
        });
    }
});
