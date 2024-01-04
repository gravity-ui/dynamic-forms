import React from 'react';

import {SELECT, VALUE} from './helpers';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';
import {DynamicView} from '~playwright/core/DynamicView';

test.describe('Select', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={SELECT.default} />);

        await expectScreenshot();
    });

    test('default value', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={SELECT.defaultValue} />);

        await expectScreenshot();
    });

    test('required', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={SELECT.required} />);

        await expectScreenshot();
    });

    test('description', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={SELECT.description} />);

        await expectScreenshot();
    });
});

test('Select View', async ({mount, expectScreenshot}) => {
    await mount(<DynamicView spec={SELECT.default} value={VALUE} />);

    await expectScreenshot();
});
