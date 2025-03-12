import React from 'react';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';
import {DynamicView} from '~playwright/core/DynamicView';

import {ACCORDEON, VALUE} from './helpers';

test.describe('Accordeon', () => {
    test('array spec', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={ACCORDEON.arraySpec} />);

        await expectScreenshot();
    });

    test('object spec', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={ACCORDEON.objectSpec} />);

        await expectScreenshot();
    });
});

test.describe('Accordeon View', () => {
    test('array spec', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={ACCORDEON.arraySpec} value={VALUE.array} />);

        await expectScreenshot();
    });

    test('object spec', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={ACCORDEON.objectSpec} value={VALUE.object} />);

        await expectScreenshot();
    });
});
