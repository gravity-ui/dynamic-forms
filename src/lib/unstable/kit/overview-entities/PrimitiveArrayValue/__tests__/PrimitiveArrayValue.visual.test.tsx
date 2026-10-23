import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import type {SchemaFormProps} from '~playwright/core/SchemaForm';
import {SchemaFormGrid, type SchemaFormGridProps} from '~playwright/core/SchemaFormGrid';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {SchemaRendererMode} from '../../../../core/constants';

import {createSchema, value} from './helpers';

test.describe('SchemaRenderer PrimitiveArrayValue', () => {
    for (const mode of [SchemaRendererMode.Overview]) {
        test(`${mode} layouts sizes and views`, async ({mount, expectScreenshot}) => {
            const stateCases: SchemaFormGridProps['cases'] = [
                {
                    label: 'empty overview uses the empty value marker',
                    props: ((): SchemaFormProps => {
                        const schema = createSchema('cell');
                        return {
                            schema: schema,
                            value: undefined,
                            mode: SchemaRendererMode.Overview,
                            size: 'm',
                            view: 'stretch',
                            coerceInitialValues: true,
                            jsonDefaultValues: false,
                            validateOnBlur: false,
                            userContext: {},
                            showSubmit: false,
                            width: 600,
                        };
                    })(),
                },
                {
                    label: 'column direction renders each described item separately',
                    props: ((): SchemaFormProps => {
                        const base = createSchema('row');
                        const schema = {
                            ...base,
                            nodeParameters: {
                                ...base.nodeParameters,
                                entityProps: {
                                    ...base.nodeParameters?.entityProps,
                                    direction: 'column',
                                },
                            },
                        };
                        return {
                            schema: schema,
                            value: value,
                            mode: SchemaRendererMode.Overview,
                            size: 'm',
                            view: 'stretch',
                            coerceInitialValues: true,
                            jsonDefaultValues: false,
                            validateOnBlur: false,
                            userContext: {},
                            showSubmit: false,
                            width: 600,
                        };
                    })(),
                },
                {
                    label: 'unknown enum values remain visible',
                    props: ((): SchemaFormProps => {
                        const schema = createSchema('row');
                        return {
                            schema: schema,
                            value: ['draft', 'unknown'],
                            mode: SchemaRendererMode.Overview,
                            size: 'm',
                            view: 'stretch',
                            coerceInitialValues: true,
                            jsonDefaultValues: false,
                            validateOnBlur: false,
                            userContext: {},
                            showSubmit: false,
                            width: 600,
                        };
                    })(),
                },
            ];
            const additionalCases = stateCases.filter(({props}) => props.mode === mode);

            const grid = await mount(
                <SchemaFormGrid
                    columns={4}
                    cases={[
                        ...rendererVariants.map(({layout, layoutName, size, view}) => {
                            const schema = createSchema(layout);
                            const label = `layout=${layoutName} / size=${size} / view=${view}`;
                            return {
                                label,
                                props: {
                                    schema: schema,
                                    value: value,
                                    mode: mode,
                                    size: size,
                                    view: view,
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
                await expect(component.getByTestId('input')).toHaveText('Draft, Published');
            }
            if (mode === SchemaRendererMode.Overview) {
                const component = grid.getByRole('region', {
                    name: 'empty overview uses the empty value marker',
                    exact: true,
                });
                await expect(component.getByText('—', {exact: true})).toBeVisible();
            }
            if (mode === SchemaRendererMode.Overview) {
                const component = grid.getByRole('region', {
                    name: 'column direction renders each described item separately',
                    exact: true,
                });
                await expect(component.getByTestId('input[0]')).toHaveText('Draft');
                await expect(component.getByTestId('input[1]')).toHaveText('Published');
            }
            if (mode === SchemaRendererMode.Overview) {
                const component = grid.getByRole('region', {
                    name: 'unknown enum values remain visible',
                    exact: true,
                });
                await expect(component.getByTestId('input')).toHaveText('Draft, unknown');
            }
            await expectScreenshot({scale: 'css'});
        });
    }
});
