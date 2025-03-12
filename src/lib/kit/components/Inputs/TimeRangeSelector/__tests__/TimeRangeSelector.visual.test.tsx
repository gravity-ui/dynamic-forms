import React from 'react';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';
import {DynamicView} from '~playwright/core/DynamicView';

import {TIME_RANGE_SELECTOR, VALUE} from './helpers';

test.describe('TimeRangeSelector', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={TIME_RANGE_SELECTOR.default} />);

        await expectScreenshot();
    });

    test('default value', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={TIME_RANGE_SELECTOR.defaultValue} />);

        await expectScreenshot();
    });

    test('required', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={TIME_RANGE_SELECTOR.required} />);

        await expectScreenshot();
    });

    test('description', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={TIME_RANGE_SELECTOR.desription} />);

        await expectScreenshot();
    });
});

test('TimeRangeSelector View', async ({mount, expectScreenshot}) => {
    await mount(<DynamicView spec={TIME_RANGE_SELECTOR.default} value={VALUE} />);

    await expectScreenshot();
});
