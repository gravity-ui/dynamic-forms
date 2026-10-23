import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {schemaTest as test} from '~playwright/core';
import {SchemaFormGrid, type SchemaFormGridProps} from '~playwright/core/SchemaFormGrid';
import {expectPopupInCell, fitGridInViewport} from '~playwright/core/popupGrid';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {SchemaRendererMode} from '../../../../core/constants';

import {schema, value} from './helpers';

test.describe('SchemaRenderer DateInput', () => {
    test('layouts sizes and views', async ({mount, page, expectScreenshot}) => {
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

        const stateCases: SchemaFormGridProps['cases'] = [
            {
                label: 'disabled preserves the value',
                props: {
                    schema: {
                        ...schema,
                        nodeParameters: {
                            ...schema.nodeParameters,
                            flags: {open: true, disabled: true},
                        },
                    },
                    value: value,
                    mode: SchemaRendererMode.Form,
                    size: 'm',
                    view: 'stretch',
                    coerceInitialValues: true,
                    jsonDefaultValues: false,
                    validateOnBlur: false,
                    userContext: {},
                    showSubmit: false,
                    width: 600,
                },
            },
            {
                label: 'display format uses the selected time zone',
                props: {
                    schema: {
                        ...schema,
                        nodeParameters: {
                            ...schema.nodeParameters,
                            entityProps: {
                                format: 'DD.MM.YYYY HH:mm',
                                timeZone: 'America/New_York',
                                hasClear: true,
                            },
                        },
                    },
                    value: value,
                    mode: SchemaRendererMode.Form,
                    size: 'm',
                    view: 'stretch',
                    coerceInitialValues: true,
                    jsonDefaultValues: false,
                    validateOnBlur: false,
                    userContext: {},
                    showSubmit: false,
                    width: 600,
                },
            },
            {
                label: 'clear removes the stored date',
                props: {
                    schema: schema,
                    value: value,
                    mode: SchemaRendererMode.Form,
                    size: 'm',
                    view: 'stretch',
                    coerceInitialValues: true,
                    jsonDefaultValues: false,
                    validateOnBlur: false,
                    userContext: {},
                    showSubmit: false,
                    width: 600,
                },
            },
            {
                label: 'calendar selection default ISO string',
                props: {
                    schema: {
                        ...schema,
                        nodeParameters: {
                            ...schema.nodeParameters,
                            entityProps: {
                                format: 'DD.MM.YYYY',
                                timeZone: 'UTC',
                                hasClear: true,
                            },
                        },
                    },
                    value: '2024-02-20T00:00:00.000Z',
                    mode: SchemaRendererMode.Form,
                    size: 'm',
                    view: 'stretch',
                    coerceInitialValues: true,
                    jsonDefaultValues: false,
                    validateOnBlur: false,
                    userContext: {},
                    showSubmit: false,
                    width: 600,
                },
            },
            {
                label: 'calendar selection output YYYY-MM-DD',
                props: {
                    schema: {
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
                    },
                    value: '2024-02-20',
                    mode: SchemaRendererMode.Form,
                    size: 'm',
                    view: 'stretch',
                    coerceInitialValues: true,
                    jsonDefaultValues: false,
                    validateOnBlur: false,
                    userContext: {},
                    showSubmit: false,
                    width: 600,
                },
            },
            {
                label: 'calendar selection output timestamp',
                props: {
                    schema: {
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
                    },
                    value: {seconds: 1708387200, nanos: 0},
                    mode: SchemaRendererMode.Form,
                    size: 'm',
                    view: 'stretch',
                    coerceInitialValues: true,
                    jsonDefaultValues: false,
                    validateOnBlur: false,
                    userContext: {},
                    showSubmit: false,
                    width: 600,
                },
            },
            {
                label: 'calendar selection output date',
                props: {
                    schema: {
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
                    },
                    value: undefined,
                    mode: SchemaRendererMode.Form,
                    size: 'm',
                    view: 'stretch',
                    coerceInitialValues: true,
                    jsonDefaultValues: false,
                    validateOnBlur: false,
                    userContext: {},
                    showSubmit: false,
                    width: 600,
                },
            },
            {
                label: 'calendar selection output date_time',
                props: {
                    schema: {
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
                    },
                    value: undefined,
                    mode: SchemaRendererMode.Form,
                    size: 'm',
                    view: 'stretch',
                    coerceInitialValues: true,
                    jsonDefaultValues: false,
                    validateOnBlur: false,
                    userContext: {},
                    showSubmit: false,
                    width: 600,
                },
            },
            {
                label: 'open calendar',
                height: 360,
                props: {
                    schema: {
                        ...schema,
                        nodeParameters: {
                            ...schema.nodeParameters,
                            entityProps: {
                                format: 'DD.MM.YYYY',
                                timeZone: 'UTC',
                                hasClear: true,
                                popupPlacement: 'bottom-start',
                            },
                        },
                    },
                    value: '2024-02-20T00:00:00.000Z',
                    mode: SchemaRendererMode.Form,
                    size: 'm',
                    view: 'stretch',
                    coerceInitialValues: true,
                    jsonDefaultValues: false,
                    validateOnBlur: false,
                    userContext: {},
                    showSubmit: false,
                    width: 600,
                },
            },
        ];
        const additionalCases = stateCases;

        const grid = await mount(
            <SchemaFormGrid
                caseHeight={220}
                cases={[
                    ...rendererVariants.map((variant) => {
                        const label = `layout=${variant.layoutName} / size=${variant.size} / view=${variant.view}`;
                        return {
                            label,
                            props: {
                                schema: {
                                    ...schema,
                                    nodeParameters: {
                                        ...schema.nodeParameters,
                                        layout: variant.layout,
                                        flags: {open: true},
                                    },
                                },
                                value: value,
                                mode: SchemaRendererMode.Form,
                                size: variant.size,
                                view: variant.view,
                                coerceInitialValues: true,
                                jsonDefaultValues: false,
                                validateOnBlur: false,
                                userContext: {},
                                showSubmit: false,
                                width: 600,
                            },
                        };
                    }),
                    ...additionalCases,
                ]}
            />,
        );
        const cases = grid.getByTestId('schema-variant');
        await expect(cases).toHaveCount(rendererVariants.length + additionalCases.length);
        for (let index = 0; index < rendererVariants.length; index++) {
            const component = cases.nth(index);
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
        }
        {
            const component = grid.getByRole('region', {
                name: 'disabled preserves the value',
                exact: true,
            });

            await expect(component.getByRole('combobox')).toBeDisabled();
            await expect(component.getByTestId('form-value')).toHaveText(
                JSON.stringify(value) ?? '',
            );
        }
        {
            const component = grid.getByRole('region', {
                name: 'display format uses the selected time zone',
                exact: true,
            });

            await expect
                .poll(async () =>
                    (await component.getByRole('combobox').inputValue()).replace(
                        /[\u2066-\u2069]/g,
                        '',
                    ),
                )
                .toBe('19.02.2024 19:00');
            await expect(component.getByTestId('form-value')).toHaveText(JSON.stringify(value));
        }
        {
            const component = grid.getByRole('region', {
                name: 'clear removes the stored date',
                exact: true,
            });

            await component.getByRole('button', {name: 'Clear', exact: true}).click();
            await expect(component.getByTestId('form-value')).toHaveText('');
        }
        {
            const component = grid.getByRole('region', {
                name: 'calendar selection default ISO string',
                exact: true,
            });
            await component.getByRole('button', {name: 'Calendar', exact: true}).click();
            await expect(page.getByRole('grid')).toBeVisible();
            await page.getByRole('gridcell').filter({hasText: /^21$/}).getByRole('button').click();
            await expect(component.getByTestId('form-value')).toHaveText(
                '"2024-02-21T00:00:00.000Z"',
            );
            await expect(component.getByTestId('form-value-type')).toHaveText('string');
            await expect
                .poll(async () =>
                    (await component.getByRole('combobox').inputValue()).replace(
                        /[\u2066-\u2069]/g,
                        '',
                    ),
                )
                .toBe('21.02.2024');
        }
        {
            const component = grid.getByRole('region', {
                name: 'calendar selection output YYYY-MM-DD',
                exact: true,
            });
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
        }
        {
            const component = grid.getByRole('region', {
                name: 'calendar selection output timestamp',
                exact: true,
            });
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
        }
        {
            const component = grid.getByRole('region', {
                name: 'calendar selection output date',
                exact: true,
            });
            await component.getByRole('button', {name: 'Calendar', exact: true}).click();
            await expect(page.getByRole('grid')).toBeVisible();
            await page.getByRole('gridcell').filter({hasText: /^21$/}).getByRole('button').click();
            await expect(component.getByTestId('form-value')).toHaveText(
                '"2024-02-21T00:00:00.000Z"',
            );
            await expect(component.getByTestId('form-value-type')).toHaveText('date');
            await expect
                .poll(async () =>
                    (await component.getByRole('combobox').inputValue()).replace(
                        /[\u2066-\u2069]/g,
                        '',
                    ),
                )
                .toBe('21.02.2024');
        }
        {
            const component = grid.getByRole('region', {
                name: 'calendar selection output date_time',
                exact: true,
            });
            await component.getByRole('button', {name: 'Calendar', exact: true}).click();
            await expect(page.getByRole('grid')).toBeVisible();
            await page.getByRole('gridcell').filter({hasText: /^21$/}).getByRole('button').click();
            await expect(component.getByTestId('form-value')).toHaveText(
                '"2024-02-21T00:00:00.000Z"',
            );
            await expect(component.getByTestId('form-value-type')).toHaveText('date_time');
            await expect
                .poll(async () =>
                    (await component.getByRole('combobox').inputValue()).replace(
                        /[\u2066-\u2069]/g,
                        '',
                    ),
                )
                .toBe('21.02.2024');
        }
        await fitGridInViewport(page, grid);
        const component = grid.getByRole('region', {
            name: 'open calendar',
            exact: true,
            includeHidden: true,
        });
        const control = component.getByRole('button', {
            name: 'Calendar',
            exact: true,
            includeHidden: true,
        });
        await control.click();
        await expect(page.getByRole('grid')).toBeVisible();
        await expectPopupInCell(
            page.locator('.g-popup').filter({has: page.getByRole('grid')}),
            component,
            control,
        );
        await page.mouse.move(0, 0);
        await expectScreenshot({scale: 'css'});
    });
});
