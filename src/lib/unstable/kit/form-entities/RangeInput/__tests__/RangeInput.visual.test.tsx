import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {schemaTest as test} from '~playwright/core';
import {SchemaFormGrid, type SchemaFormGridProps} from '~playwright/core/SchemaFormGrid';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {SchemaRendererMode} from '../../../../core/constants';

import {fromSchema, schema, toSchema, value} from './helpers';

test.describe('SchemaRenderer RangeInput', () => {
    test('layouts sizes and views', async ({mount, expectScreenshot}) => {
        const stateCases: SchemaFormGridProps['cases'] = [
            {
                label: 'disabled preserves the value',
                props: {
                    schema: {
                        ...schema,
                        properties: {
                            from: {
                                ...fromSchema,
                                nodeParameters: {
                                    ...fromSchema.nodeParameters,
                                    flags: {disabled: true},
                                },
                            },
                            to: {
                                ...toSchema,
                                nodeParameters: {
                                    ...toSchema.nodeParameters,
                                    flags: {disabled: true},
                                },
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
                label: 'editing lower bound updates the upper minimum',
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
                label: 'custom keys and separator',
                props: {
                    schema: {
                        ...schema,
                        properties: {start: schema.properties!.from, end: schema.properties!.to},
                        nodeParameters: {
                            ...schema.nodeParameters,
                            entityProps: {propertyKeys: ['start', 'end'], separator: 'through'},
                        },
                    },
                    value: {start: 20, end: 70},
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
            await expect(component.getByRole('spinbutton').first()).toBeVisible();
            await expect(component.getByTestId('form-value')).toHaveText(
                JSON.stringify(value) ?? '',
            );
        }
        {
            const component = grid.getByRole('region', {
                name: 'disabled preserves the value',
                exact: true,
            });
            await expect(component.getByRole('spinbutton').first()).toBeDisabled();
            await expect(component.getByTestId('form-value')).toHaveText(
                JSON.stringify(value) ?? '',
            );
        }
        {
            const component = grid.getByRole('region', {
                name: 'editing lower bound updates the upper minimum',
                exact: true,
            });
            await component.getByRole('spinbutton').first().fill('30');
            await component.getByRole('spinbutton').first().blur();
            await expect(component.getByTestId('form-value')).toHaveText('{"from":30,"to":70}');
            await expect(component.getByRole('spinbutton').last()).toHaveAttribute(
                'aria-valuemin',
                '30',
            );
        }
        {
            const component = grid.getByRole('region', {
                name: 'custom keys and separator',
                exact: true,
            });
            await expect(component.getByText('through', {exact: true})).toBeVisible();
            await component.getByRole('spinbutton').last().fill('80');
            await component.getByRole('spinbutton').last().blur();
            await expect(component.getByTestId('form-value')).toHaveText('{"start":20,"end":80}');
        }
        await expectScreenshot({scale: 'css'});
    });
});
