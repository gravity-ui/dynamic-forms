import React from 'react';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';
import {DynamicView} from '~playwright/core/DynamicView';

import {COLOR_PICKER, VALUE} from './helpers';

test.describe('Color Picker', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={COLOR_PICKER.default} />);

        await expectScreenshot();
    });

    test('full', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={COLOR_PICKER.full} />);

        await expectScreenshot();
    });

    test('default value', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={COLOR_PICKER.defaultValue} />);

        await expectScreenshot();
    });

    test('row verbose', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={COLOR_PICKER.row_verbose} />);

        await expectScreenshot();
    });

    test('layout transparent', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={COLOR_PICKER.layoutTransparent} />);

        await expectScreenshot();
    });
});

test.describe('Color Picker view', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={COLOR_PICKER.default} value={VALUE} />);

        await expectScreenshot();
    });
});
