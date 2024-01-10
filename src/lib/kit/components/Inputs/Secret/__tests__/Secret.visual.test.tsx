import React from 'react';

import {SECRET} from './helpers';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';

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
