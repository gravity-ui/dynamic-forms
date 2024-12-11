import React from 'react';

import {COLUMN_CARD} from './helpers';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';

test.describe('Column Form', () => {
    test('object spec', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={COLUMN_CARD} />);

        await expectScreenshot();
    });
});
