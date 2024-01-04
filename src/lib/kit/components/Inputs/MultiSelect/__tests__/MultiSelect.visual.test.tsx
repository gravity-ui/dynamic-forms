import React from 'react';

import {MULTI_SELECT, VALUE} from './helpers';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';
import {DynamicView} from '~playwright/core/DynamicView';

test.describe('Multi Select', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={MULTI_SELECT.default} />);

        await expectScreenshot();
    });

    test('default value', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={MULTI_SELECT.defaultValue} />);

        await expectScreenshot();
    });

    test('required', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={MULTI_SELECT.required} />);

        await expectScreenshot();
    });

    test('description', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={MULTI_SELECT.desription} />);

        await expectScreenshot();
    });

    test('row verbose', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={MULTI_SELECT.row_verbose} />);

        await expectScreenshot();
    });
});

test('Multi Select view', async ({mount, expectScreenshot}) => {
    await mount(<DynamicView spec={MULTI_SELECT.default} value={VALUE} />);

    await expectScreenshot();
});
