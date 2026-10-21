import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import {SchemaForm} from '~playwright/core/SchemaForm';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {SchemaRendererMode} from '../../../../core/constants';

import {schema, value} from './helpers';

test.describe('SchemaRenderer DateInput', () => {
    for (const variant of rendererVariants) {
        test(`${variant.layoutName} size ${variant.size} view ${variant.view}`, async ({
            mount,
            expectScreenshot,
        }) => {
            const component = await mount(
                <SchemaForm
                    schema={{
                        ...schema,
                        nodeParameters: {
                            ...schema.nodeParameters,
                            layout: variant.layout,
                            flags: {open: true},
                        },
                    }}
                    value={value}
                    mode={SchemaRendererMode.Form}
                    size={variant.size}
                    view={variant.view}
                    coerceInitialValues={true}
                    jsonDefaultValues={false}
                    validateOnBlur={false}
                    userContext={{}}
                    showSubmit={false}
                    width={600}
                />,
            );
            await expect(component.getByRole('combobox')).toBeVisible();
            await expect
                .poll(async () =>
                    (await component.getByRole('combobox').inputValue()).replace(
                        /[\u2066-\u2069]/g,
                        '',
                    ),
                )
                .toBe('20.02.2024');
            await expect(component.getByTestId('form-value')).toHaveText(
                JSON.stringify(value) ?? '',
            );
            await expectScreenshot();
        });
    }
    test('disabled preserves the value', async ({mount, expectScreenshot}) => {
        const component = await mount(
            <SchemaForm
                schema={{
                    ...schema,
                    nodeParameters: {...schema.nodeParameters, flags: {open: true, disabled: true}},
                }}
                value={value}
                mode={SchemaRendererMode.Form}
                size={'m'}
                view={'stretch'}
                coerceInitialValues={true}
                jsonDefaultValues={false}
                validateOnBlur={false}
                userContext={{}}
                showSubmit={false}
                width={600}
            />,
        );
        await expect(component.getByRole('combobox')).toBeDisabled();
        await expect(component.getByTestId('form-value')).toHaveText(JSON.stringify(value) ?? '');
        await expectScreenshot();
    });
    test('calendar selection default ISO string', async ({mount, page, expectScreenshot}) => {
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
        const component = await mount(
            <SchemaForm
                schema={{
                    ...schema,
                    nodeParameters: {
                        ...schema.nodeParameters,
                        entityProps: {
                            format: 'DD.MM.YYYY',
                            timeZone: 'UTC',
                            hasClear: true,
                        },
                    },
                }}
                value={'2024-02-20T00:00:00.000Z'}
                mode={SchemaRendererMode.Form}
                size={'m'}
                view={'stretch'}
                coerceInitialValues={true}
                jsonDefaultValues={false}
                validateOnBlur={false}
                userContext={{}}
                showSubmit={false}
                width={600}
            />,
        );
        await component.getByRole('button', {name: 'Calendar', exact: true}).click();
        await expect(page.getByRole('grid')).toBeVisible();
        await expectScreenshot({fullPage: true, screenshotName: 'Calendar popup'});
        await page.getByRole('gridcell').filter({hasText: /^21$/}).getByRole('button').click();
        await expect(component.getByTestId('form-value')).toHaveText('"2024-02-21T00:00:00.000Z"');
        await expect(component.getByTestId('form-value-type')).toHaveText('string');
        await expect
            .poll(async () =>
                (await component.getByRole('combobox').inputValue()).replace(
                    /[\u2066-\u2069]/g,
                    '',
                ),
            )
            .toBe('21.02.2024');
        await expectScreenshot();
    });
    test('calendar selection output string', async ({mount, page}) => {
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
        const component = await mount(
            <SchemaForm
                schema={{
                    ...schema,
                    nodeParameters: {
                        ...schema.nodeParameters,
                        entityProps: {
                            format: 'DD.MM.YYYY',
                            outputFormat: 'string',
                            timeZone: 'UTC',
                            hasClear: true,
                        },
                    },
                }}
                value={'2024-02-20T00:00:00.000Z'}
                mode={SchemaRendererMode.Form}
                size={'m'}
                view={'stretch'}
                coerceInitialValues={true}
                jsonDefaultValues={false}
                validateOnBlur={false}
                userContext={{}}
                showSubmit={false}
                width={600}
            />,
        );
        await component.getByRole('button', {name: 'Calendar', exact: true}).click();
        await expect(page.getByRole('grid')).toBeVisible();
        await page.getByRole('gridcell').filter({hasText: /^21$/}).getByRole('button').click();
        await expect(component.getByTestId('form-value')).toHaveText('"2024-02-21T00:00:00.000Z"');
        await expect(component.getByTestId('form-value-type')).toHaveText('string');
        // parseDate forwards the semantic outputFormat to date-utils as a parsing pattern.
        // The ISO string reaches the form correctly, but cannot currently be rendered back.
        test.fail(true, 'Explicit outputFormat string cannot parse its own ISO output');
        await expect
            .poll(async () =>
                (await component.getByRole('combobox').inputValue()).replace(
                    /[\u2066-\u2069]/g,
                    '',
                ),
            )
            .toBe('21.02.2024');
    });
    test('calendar selection output YYYY-MM-DD', async ({mount, page, expectScreenshot}) => {
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
        const component = await mount(
            <SchemaForm
                schema={{
                    ...schema,
                    nodeParameters: {
                        ...schema.nodeParameters,
                        entityProps: {
                            format: 'DD.MM.YYYY',
                            outputFormat: 'YYYY-MM-DD',
                            timeZone: 'UTC',
                            hasClear: true,
                        },
                    },
                }}
                value={'2024-02-20'}
                mode={SchemaRendererMode.Form}
                size={'m'}
                view={'stretch'}
                coerceInitialValues={true}
                jsonDefaultValues={false}
                validateOnBlur={false}
                userContext={{}}
                showSubmit={false}
                width={600}
            />,
        );
        await component.getByRole('button', {name: 'Calendar', exact: true}).click();
        await expect(page.getByRole('grid')).toBeVisible();
        await page.getByRole('gridcell').filter({hasText: /^21$/}).getByRole('button').click();
        await expect(component.getByTestId('form-value')).toHaveText('"2024-02-21"');
        await expect(component.getByTestId('form-value-type')).toHaveText('string');
        await expect
            .poll(async () =>
                (await component.getByRole('combobox').inputValue()).replace(
                    /[\u2066-\u2069]/g,
                    '',
                ),
            )
            .toBe('21.02.2024');
        await expectScreenshot();
    });
    test('calendar selection output timestamp', async ({mount, page, expectScreenshot}) => {
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
        const component = await mount(
            <SchemaForm
                schema={{
                    ...schema,
                    nodeParameters: {
                        ...schema.nodeParameters,
                        entityProps: {
                            format: 'DD.MM.YYYY',
                            outputFormat: 'timestamp',
                            timeZone: 'UTC',
                            hasClear: true,
                        },
                    },
                }}
                value={{seconds: 1708387200, nanos: 0}}
                mode={SchemaRendererMode.Form}
                size={'m'}
                view={'stretch'}
                coerceInitialValues={true}
                jsonDefaultValues={false}
                validateOnBlur={false}
                userContext={{}}
                showSubmit={false}
                width={600}
            />,
        );
        await component.getByRole('button', {name: 'Calendar', exact: true}).click();
        await expect(page.getByRole('grid')).toBeVisible();
        await page.getByRole('gridcell').filter({hasText: /^21$/}).getByRole('button').click();
        await expect(component.getByTestId('form-value')).toHaveText(
            '{"seconds":1708473600,"nanos":0}',
        );
        await expect(component.getByTestId('form-value-type')).toHaveText('object');
        await expect
            .poll(async () =>
                (await component.getByRole('combobox').inputValue()).replace(
                    /[\u2066-\u2069]/g,
                    '',
                ),
            )
            .toBe('21.02.2024');
        await expectScreenshot();
    });
    test('calendar selection output date', async ({mount, page, expectScreenshot}) => {
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
        const component = await mount(
            <SchemaForm
                schema={{
                    ...schema,
                    nodeParameters: {
                        ...schema.nodeParameters,
                        entityProps: {
                            format: 'DD.MM.YYYY',
                            outputFormat: 'date',
                            timeZone: 'UTC',
                            hasClear: true,
                        },
                    },
                }}
                value={undefined}
                mode={SchemaRendererMode.Form}
                size={'m'}
                view={'stretch'}
                coerceInitialValues={true}
                jsonDefaultValues={false}
                validateOnBlur={false}
                userContext={{}}
                showSubmit={false}
                width={600}
            />,
        );
        await component.getByRole('button', {name: 'Calendar', exact: true}).click();
        await expect(page.getByRole('grid')).toBeVisible();
        await page.getByRole('gridcell').filter({hasText: /^21$/}).getByRole('button').click();
        await expect(component.getByTestId('form-value')).toHaveText('"2024-02-21T00:00:00.000Z"');
        await expect(component.getByTestId('form-value-type')).toHaveText('date');
        await expect
            .poll(async () =>
                (await component.getByRole('combobox').inputValue()).replace(
                    /[\u2066-\u2069]/g,
                    '',
                ),
            )
            .toBe('21.02.2024');
        await expectScreenshot();
    });
    test('calendar selection output date_time', async ({mount, page, expectScreenshot}) => {
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
        const component = await mount(
            <SchemaForm
                schema={{
                    ...schema,
                    nodeParameters: {
                        ...schema.nodeParameters,
                        entityProps: {
                            format: 'DD.MM.YYYY',
                            outputFormat: 'date_time',
                            timeZone: 'UTC',
                            hasClear: true,
                        },
                    },
                }}
                value={undefined}
                mode={SchemaRendererMode.Form}
                size={'m'}
                view={'stretch'}
                coerceInitialValues={true}
                jsonDefaultValues={false}
                validateOnBlur={false}
                userContext={{}}
                showSubmit={false}
                width={600}
            />,
        );
        await component.getByRole('button', {name: 'Calendar', exact: true}).click();
        await expect(page.getByRole('grid')).toBeVisible();
        await page.getByRole('gridcell').filter({hasText: /^21$/}).getByRole('button').click();
        await expect(component.getByTestId('form-value')).toHaveText('"2024-02-21T00:00:00.000Z"');
        await expect(component.getByTestId('form-value-type')).toHaveText('date_time');
        await expect
            .poll(async () =>
                (await component.getByRole('combobox').inputValue()).replace(
                    /[\u2066-\u2069]/g,
                    '',
                ),
            )
            .toBe('21.02.2024');
        await expectScreenshot();
    });
    test('display format uses the selected time zone', async ({mount, expectScreenshot}) => {
        const component = await mount(
            <SchemaForm
                schema={{
                    ...schema,
                    nodeParameters: {
                        ...schema.nodeParameters,
                        entityProps: {
                            format: 'DD.MM.YYYY HH:mm',
                            timeZone: 'America/New_York',
                            hasClear: true,
                        },
                    },
                }}
                value={value}
                mode={SchemaRendererMode.Form}
                size={'m'}
                view={'stretch'}
                coerceInitialValues={true}
                jsonDefaultValues={false}
                validateOnBlur={false}
                userContext={{}}
                showSubmit={false}
                width={600}
            />,
        );
        await expect
            .poll(async () =>
                (await component.getByRole('combobox').inputValue()).replace(
                    /[\u2066-\u2069]/g,
                    '',
                ),
            )
            .toBe('19.02.2024 19:00');
        await expect(component.getByTestId('form-value')).toHaveText(JSON.stringify(value));
        await expectScreenshot();
    });
    test('clear removes the stored date', async ({mount, expectScreenshot}) => {
        const component = await mount(
            <SchemaForm
                schema={schema}
                value={value}
                mode={SchemaRendererMode.Form}
                size={'m'}
                view={'stretch'}
                coerceInitialValues={true}
                jsonDefaultValues={false}
                validateOnBlur={false}
                userContext={{}}
                showSubmit={false}
                width={600}
            />,
        );
        await component.getByRole('button', {name: 'Clear', exact: true}).click();
        await expect(component.getByTestId('form-value')).toHaveText('');
        await expectScreenshot();
    });
});
