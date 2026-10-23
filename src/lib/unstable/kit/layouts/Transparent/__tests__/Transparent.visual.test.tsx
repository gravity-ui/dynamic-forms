import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import {SchemaFormGrid, type SchemaFormGridProps} from '~playwright/core/SchemaFormGrid';
import {rendererSizes, rendererViews} from '~playwright/core/schemaRendererVariants';

import {JsonSchemaType, NodeType, SchemaRendererMode} from '../../../../core/constants';
import type {JsonSchemaString} from '../../../../core/types';

const modes = [SchemaRendererMode.Form, SchemaRendererMode.Overview];
const baseSchema: JsonSchemaString = {
    type: JsonSchemaType.String,
    title: 'Service name',
    description: 'Name shown to other team members',
    nodeParameters: {
        type: NodeType.String,
        entity: 'base',
        layout: 'transparent',
        flags: {open: true},
    },
};

test.describe('Transparent', () => {
    for (const mode of modes) {
        test(`${mode} sizes and views`, async ({mount, expectScreenshot}) => {
            const emptyStates = [
                ['transparent', true],
                ['transparent', false],
                ['cell', false],
            ] as const;
            const additionalCases: SchemaFormGridProps['cases'] =
                mode === SchemaRendererMode.Overview
                    ? emptyStates.map(([layout, hideEmpty]) => ({
                          label: `empty ${layout} hideEmpty=${hideEmpty}`,
                          props: {
                              schema: {
                                  ...baseSchema,
                                  nodeParameters: {
                                      ...baseSchema.nodeParameters,
                                      layout,
                                      layoutProps: layout === 'cell' ? {} : {hideEmpty},
                                  },
                              },
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
                          },
                      }))
                    : [];

            const schema = baseSchema;
            const value = 'Gravity service';
            const variants = rendererSizes.flatMap((size) =>
                rendererViews.map((view) => ({size, view})),
            );
            const grid = await mount(
                <SchemaFormGrid
                    columns={4}
                    cases={[
                        ...variants.map(({size, view}) => {
                            const label = `size=${size} / view=${view}`;
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
            await expect(cases).toHaveCount(variants.length + additionalCases.length);
            for (let index = 0; index < variants.length; index++) {
                const component = cases.nth(index);
                if (mode === SchemaRendererMode.Form) {
                    await expect(component.getByRole('textbox')).toHaveValue(value);
                } else {
                    await expect(component.getByText(value, {exact: true})).toBeVisible();
                }
            }
            if (mode === SchemaRendererMode.Overview) {
                for (const [layout, hideEmpty] of emptyStates) {
                    const component = grid.getByRole('region', {
                        name: `empty ${layout} hideEmpty=${hideEmpty}`,
                        exact: true,
                    });
                    if (hideEmpty) {
                        await expect(component.getByText('—', {exact: true})).not.toBeVisible();
                    } else {
                        await expect(component.getByText('—', {exact: true})).toBeVisible();
                    }
                }
            }
            await expectScreenshot({scale: 'css'});
        });
    }
});
