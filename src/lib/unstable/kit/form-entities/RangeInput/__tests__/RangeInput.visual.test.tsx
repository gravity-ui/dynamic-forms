import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {test} from '~playwright/core';
import {SchemaForm} from '~playwright/core/SchemaForm';
import {rendererVariants} from '~playwright/core/schemaRendererVariants';

import {SchemaRendererMode} from '../../../../core/constants';

import {fromSchema, schema, toSchema, value} from './helpers';

test.describe('SchemaRenderer RangeInput', () => {
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
            await expect(component.getByRole('spinbutton').first()).toBeVisible();
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
                    properties: {
                        from: {
                            ...fromSchema,
                            nodeParameters: {...fromSchema.nodeParameters, flags: {disabled: true}},
                        },
                        to: {
                            ...toSchema,
                            nodeParameters: {...toSchema.nodeParameters, flags: {disabled: true}},
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
        await expect(component.getByRole('spinbutton').first()).toBeDisabled();
        await expect(component.getByTestId('form-value')).toHaveText(JSON.stringify(value) ?? '');
        await expectScreenshot();
    });
    test('editing lower bound updates the upper minimum', async ({mount, expectScreenshot}) => {
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
        await component.getByRole('spinbutton').first().fill('30');
        await component.getByRole('spinbutton').first().blur();
        await expect(component.getByTestId('form-value')).toHaveText('{"from":30,"to":70}');
        await expect(component.getByRole('spinbutton').last()).toHaveAttribute(
            'aria-valuemin',
            '30',
        );
        await expectScreenshot();
    });
    test('custom keys and separator', async ({mount, expectScreenshot}) => {
        const component = await mount(
            <SchemaForm
                schema={{
                    ...schema,
                    properties: {start: schema.properties!.from, end: schema.properties!.to},
                    nodeParameters: {
                        ...schema.nodeParameters,
                        entityProps: {propertyKeys: ['start', 'end'], separator: 'through'},
                    },
                }}
                value={{start: 20, end: 70}}
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
        await expect(component.getByText('through', {exact: true})).toBeVisible();
        await component.getByRole('spinbutton').last().fill('80');
        await component.getByRole('spinbutton').last().blur();
        await expect(component.getByTestId('form-value')).toHaveText('{"start":20,"end":80}');
        await expectScreenshot();
    });
});
