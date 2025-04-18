import React from 'react';

import {test} from '~playwright/core';
import {DynamicView} from '~playwright/core/DynamicView';

import {VALUE, VIEW_ROW} from './helpers';

test.describe('ViewRow View', () => {
    test('object spec', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={VIEW_ROW} value={VALUE} />);

        await expectScreenshot();
    });

    test('object spec with layoutDescription', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={VIEW_ROW} value={VALUE} showLayoutDescription />);

        await expectScreenshot();
    });
});
