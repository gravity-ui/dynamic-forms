import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {ARRAY_BASE, DynamicForm} from './helpers';

import {test} from '~playwright/core';

test.describe('Array Base', () => {
    test('default', async ({mount}) => {
        const component = await mount(<DynamicForm spec={ARRAY_BASE.default} />);

        await expect(component).toHaveScreenshot();
    });

    test('default value', async ({mount}) => {
        const component = await mount(<DynamicForm spec={ARRAY_BASE.defaultValue} />);

        await expect(component).toHaveScreenshot();
    });

    test('required', async ({mount}) => {
        const component = await mount(<DynamicForm spec={ARRAY_BASE.required} />);

        await expect(component).toHaveScreenshot();
    });

    test('error max length', async ({mount}) => {
        const component = await mount(<DynamicForm spec={ARRAY_BASE.errorMaxLength} />);

        await component.getByText('Add element').click();

        await expect(component).toHaveScreenshot();
    });

    test('error min length', async ({mount}) => {
        const component = await mount(<DynamicForm spec={ARRAY_BASE.errorMinLength} />);

        await component.getByText('Add element').click();

        await expect(component).toHaveScreenshot();
    });

    test('description', async ({mount}) => {
        const component = await mount(<DynamicForm spec={ARRAY_BASE.description} />);

        await expect(component).toHaveScreenshot();
    });

    test('item prefix', async ({mount}) => {
        const component = await mount(<DynamicForm spec={ARRAY_BASE.itemPrefix} />);

        await expect(component).toHaveScreenshot();
    });

    test('add button position', async ({mount}) => {
        const component = await mount(<DynamicForm spec={ARRAY_BASE.addButtonPosition} />);

        await expect(component).toHaveScreenshot();
    });
});
