import React from 'react';

import {test} from '~playwright/core';
import {DynamicView} from '~playwright/core/DynamicView';

import {VALUE, VIEW_COLUMN} from './helpers';

test.describe('ViewColumn View', () => {
    test('object spec', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={VIEW_COLUMN} value={VALUE} />);

        await expectScreenshot();
    });

    test('object spec with layoutDescription', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={VIEW_COLUMN} value={VALUE} showLayoutDescription />);

        await expectScreenshot();
    });
});
