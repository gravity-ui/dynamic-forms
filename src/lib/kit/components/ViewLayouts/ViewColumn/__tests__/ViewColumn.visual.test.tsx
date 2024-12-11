import React from 'react';

import {VALUE, VIEW_COLUMN} from './helpers';

import {test} from '~playwright/core';
import {DynamicView} from '~playwright/core/DynamicView';

test.describe('ViewRow View', () => {
    test('object spec', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={VIEW_COLUMN} value={VALUE} />);

        await expectScreenshot();
    });

    test('object spec with layoutDescription', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={VIEW_COLUMN} value={VALUE} showLayoutDescription />);

        await expectScreenshot();
    });
});
