import React from 'react';

import {test} from '~playwright/core';
import {DynamicView} from '~playwright/core/DynamicView';

import {ARRAY_BASE, DynamicForm, VALUE} from './helpers';

test.describe('Array Base', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={ARRAY_BASE.default} />);

        await expectScreenshot();
    });

    test('default value', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={ARRAY_BASE.defaultValue} />);

        await expectScreenshot();
    });

    test('required', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={ARRAY_BASE.required} />);

        await expectScreenshot();
    });

    test('error max length', async ({mount, expectScreenshot}) => {
        const component = await mount(<DynamicForm spec={ARRAY_BASE.errorMaxLength} />);

        await component.getByText('Add element').click();

        await expectScreenshot();
    });

    test('error min length', async ({mount, expectScreenshot}) => {
        const component = await mount(<DynamicForm spec={ARRAY_BASE.errorMinLength} />);

        await component.getByText('Add element').click();

        await expectScreenshot();
    });

    test('error remove button', async ({mount, expectScreenshot}) => {
        const component = await mount(<DynamicForm spec={ARRAY_BASE.errorRemoveButton} />);
        const input = component.getByRole('textbox').first();

        await input.focus();
        await input.blur();

        await expectScreenshot();
    });

    test('description', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={ARRAY_BASE.description} />);

        await expectScreenshot();
    });

    test('item prefix', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={ARRAY_BASE.itemPrefix} />);

        await expectScreenshot();
    });

    test('add button position', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={ARRAY_BASE.addButtonPosition} />);

        await expectScreenshot();
    });
});

test.describe('Array Base view', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={ARRAY_BASE.default} value={VALUE.array} />);

        await expectScreenshot();
    });
});
