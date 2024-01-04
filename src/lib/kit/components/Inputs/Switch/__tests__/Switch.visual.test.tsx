import React from 'react';

import {SWITCH, VALUE} from './helpers';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';
import {DynamicView} from '~playwright/core/DynamicView';

test.describe('Switch', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={SWITCH.default} />);

        await expectScreenshot();
    });

    test('full', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={SWITCH.full} />);

        await expectScreenshot();
    });

    test('default value', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={SWITCH.defaultValue} />);

        await expectScreenshot();
    });

    test('row verbose', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={SWITCH.row_verbose} />);

        await expectScreenshot();
    });
});

test.describe('Switch view', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={SWITCH.default} value={VALUE} />);

        await expectScreenshot();
    });
});
