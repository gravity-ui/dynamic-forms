import React from 'react';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';

import {SECRET} from './helpers';

test.describe('Secret', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={SECRET.default} />);

        await expectScreenshot();
    });

    test('full', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={SECRET.full} />);

        await expectScreenshot();
    });
});
