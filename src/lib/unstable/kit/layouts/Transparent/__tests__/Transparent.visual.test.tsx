import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import {SchemaForm} from '~playwright/core/SchemaForm';
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

    for (const [layout, hideEmpty] of [
        ['transparent', true],
        ['transparent', false],
        ['cell', false],
    ] as const) {
        test(`empty ${layout} hideEmpty=${hideEmpty}`, async ({mount, expectScreenshot}) => {
            const schema: JsonSchemaString = {
                ...baseSchema,
                nodeParameters: {
                    ...baseSchema.nodeParameters,
                    layout,
                    // For cell, exercise the actual config's hideEmpty:false, without overriding it.
                    layoutProps: layout === 'cell' ? {} : {hideEmpty},
                },
            };
            const value = undefined;
            const mode = SchemaRendererMode.Overview;
            const size = 'm';
            const view = 'stretch';
            const component = await mount(
                <div>
                    <p>Empty overview value below</p>
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
                    />
                </div>,
            );
            if (hideEmpty) {
                await expect(component.getByText('—', {exact: true})).not.toBeVisible();
            } else {
                await expect(component.getByText('—', {exact: true})).toBeVisible();
            }
            await expectScreenshot();
        });
    }
});
