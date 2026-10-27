import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {schemaTest as test} from '~playwright/core';
import type {SchemaFormProps} from '~playwright/core/SchemaForm';
import {SchemaFormGrid, type SchemaFormGridProps} from '~playwright/core/SchemaFormGrid';
import {rendererSizes, rendererViews} from '~playwright/core/schemaRendererVariants';

import {JsonSchemaType, NodeType, SchemaRendererMode} from '../../../../core/constants';
import type {JsonSchemaString} from '../../../../core/types';

const modes = [SchemaRendererMode.Overview];
const baseSchema: JsonSchemaString = {
    type: JsonSchemaType.String,
    title: 'Service name',
    description: 'Name shown to other team members',
    nodeParameters: {type: NodeType.String, entity: 'base', layout: 'row', flags: {open: true}},
};

test.describe('OverviewRow', () => {
    for (const mode of modes) {
        test(`${mode} sizes and views`, async ({mount, expectScreenshot}) => {
            const stateCases: SchemaFormGridProps['cases'] = [
                {
                    label: 'long title and value with copy action',
                    height: 140,
                    props: ((): SchemaFormProps => {
                        const schema: JsonSchemaString = {
                            ...baseSchema,
                            title: 'A long service identifier that should wrap instead of covering the value',
                            nodeParameters: {...baseSchema.nodeParameters, flags: {copy: true}},
                        };
                        const value =
                            'service-with-a-long-display-name-for-overview-layout-wrapping';
                        const mode = SchemaRendererMode.Overview;
                        const size = 'xl';
                        const view = 'fit';
                        return {
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
                        };
                    })(),
                },
            ];
            const additionalCases = stateCases.filter(({props}) => props.mode === mode);

            const schema = baseSchema;
            const value = 'Gravity service';
            const variants = rendererSizes.flatMap((size) =>
                rendererViews.map((view) => ({size, view})),
            );
            const grid = await mount(
                <SchemaFormGrid
                    caseHeight={100}
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
                const component = grid.getByRole('region', {
                    name: 'long title and value with copy action',
                    exact: true,
                });
                const value = 'service-with-a-long-display-name-for-overview-layout-wrapping';
                await expect(component.getByText(value, {exact: true})).toBeVisible();
                await expect(component.getByRole('button')).toBeVisible();
            }
            await expectScreenshot({scale: 'css'});
        });
    }
});
