import React from 'react';

import {CHECKBOX, VALUE} from './helpers';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';
import {DynamicView} from '~playwright/core/DynamicView';

test.describe('Checkbox', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={CHECKBOX.default} />);

        await expectScreenshot();
    });

    test('full', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={CHECKBOX.full} />);

        await expectScreenshot();
    });

    test('default value', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={CHECKBOX.defaultValue} />);

        await expectScreenshot();
    });

    test('row verbose', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={CHECKBOX.row_verbose} />);

        await expectScreenshot();
    });
});

test.describe('Checkbox view', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={CHECKBOX.default} value={VALUE} />);

        await expectScreenshot();
    });
});
