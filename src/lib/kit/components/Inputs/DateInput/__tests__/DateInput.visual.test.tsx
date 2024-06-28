import React from 'react';

import {DATE_INPUT, VALUE} from './helpers';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';
import {DynamicView} from '~playwright/core/DynamicView';

test.describe('DateInput', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={DATE_INPUT.default} />);

        await expectScreenshot();
    });

    test('full', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={DATE_INPUT.full} />);

        await expectScreenshot();
    });

    test('default value', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={DATE_INPUT.defaultValue} />);

        await expectScreenshot();
    });

    test('row verbose', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={DATE_INPUT.row_verbose} />);

        await expectScreenshot();
    });

    test('layout transparent', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={DATE_INPUT.layoutTransparent} />);

        await expectScreenshot();
    });
});

test.describe('DateInput view', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={DATE_INPUT.default} value={VALUE} />);

        await expectScreenshot();
    });
});
