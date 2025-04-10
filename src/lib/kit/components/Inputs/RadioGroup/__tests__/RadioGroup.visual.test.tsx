import React from 'react';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';
import {DynamicView} from '~playwright/core/DynamicView';

import {RADIO_GROUP, VALUE} from './helpers';

test.describe('Radio group', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={RADIO_GROUP.default} />);

        await expectScreenshot();
    });

    test('default value', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={RADIO_GROUP.defaultValue} />);

        await expectScreenshot();
    });

    test('required', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={RADIO_GROUP.required} />);

        await expectScreenshot();
    });

    test('description', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={RADIO_GROUP.description} />);

        await expectScreenshot();
    });

    test('disabled', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={RADIO_GROUP.disabled} />);

        await expectScreenshot();
    });

    test('disabledOptions', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={RADIO_GROUP.disabledOptions} />);

        await expectScreenshot();
    });

    test('directionVertical', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={RADIO_GROUP.directionVertical} />);

        await expectScreenshot();
    });
});

test('Radio group View', async ({mount, expectScreenshot}) => {
    await mount(<DynamicView spec={RADIO_GROUP.default} value={VALUE} />);

    await expectScreenshot();
});
