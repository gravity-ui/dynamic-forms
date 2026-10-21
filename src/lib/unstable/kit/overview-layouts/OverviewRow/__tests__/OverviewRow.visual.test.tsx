import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import {SchemaForm} from '~playwright/core/SchemaForm';
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
        for (const size of rendererSizes) {
            for (const view of rendererViews) {
                test(`${mode} size=${size} view=${view}`, async ({mount, expectScreenshot}) => {
                    const schema = baseSchema;
                    const value = 'Gravity service';
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
                            width={600}
                        />,
                    );
                    if (mode === SchemaRendererMode.Form) {
                        await expect(component.getByRole('textbox')).toHaveValue(value);
                    } else {
                        await expect(component.getByText(value, {exact: true})).toBeVisible();
                    }
                    await expectScreenshot();
                });
            }
        }
    }

    test('long title and value with copy action', async ({mount, expectScreenshot}) => {
        const schema: JsonSchemaString = {
            ...baseSchema,
            title: 'A long service identifier that should wrap instead of covering the value',
            nodeParameters: {...baseSchema.nodeParameters, flags: {copy: true}},
        };
        const value = 'service-with-a-long-display-name-for-overview-layout-wrapping';
        const mode = SchemaRendererMode.Overview;
        const size = 'xl';
        const view = 'fit';
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
                width={600}
            />,
        );
        await expect(component.getByText(value, {exact: true})).toBeVisible();
        await expect(component.getByRole('button')).toBeVisible();
        await expectScreenshot();
    });
});
