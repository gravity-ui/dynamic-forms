import React from 'react';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';
import {DynamicView} from '~playwright/core/DynamicView';

import {OBJECT_VALUE_INPUT, VALUE} from './helpers';

test.describe('Object Value Input', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={OBJECT_VALUE_INPUT.default} />);

        await expectScreenshot();
    });

    test('default value', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={OBJECT_VALUE_INPUT.defaultValue} />);

        await expectScreenshot();
    });

    test('required', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={OBJECT_VALUE_INPUT.required} />);

        await expectScreenshot();
    });

    test('description', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={OBJECT_VALUE_INPUT.desription} />);

        await expectScreenshot();
    });

    test('row verbose', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={OBJECT_VALUE_INPUT.row_verbose} />);

        await expectScreenshot();
    });
});

test.describe('Object value input view', () => {
    test('string', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={OBJECT_VALUE_INPUT.default} value={VALUE.string} />);

        await expectScreenshot();
    });

    test('boolean', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={OBJECT_VALUE_INPUT.default} value={VALUE.boolean} />);

        await expectScreenshot();
    });
});
