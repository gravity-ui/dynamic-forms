import React from 'react';

import {NUMBER_WITH_SCALE, VALUE} from './helpers';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';
import {DynamicView} from '~playwright/core/DynamicView';

test.describe('Number With Scale', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={NUMBER_WITH_SCALE.default} />);

        await expectScreenshot();
    });

    test('default value', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={NUMBER_WITH_SCALE.defaultValue} />);

        await expectScreenshot();
    });

    test('required', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={NUMBER_WITH_SCALE.required} />);

        await expectScreenshot();
    });

    test('description', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={NUMBER_WITH_SCALE.description} />);

        await expectScreenshot();
    });
});

test('Number With Scale View', async ({mount, expectScreenshot}) => {
    await mount(<DynamicView spec={NUMBER_WITH_SCALE.default} value={VALUE} />);

    await expectScreenshot();
});
