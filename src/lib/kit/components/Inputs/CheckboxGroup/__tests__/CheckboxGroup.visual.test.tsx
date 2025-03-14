import React from 'react';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';
import {DynamicView} from '~playwright/core/DynamicView';

import {CHECKBOX_GROUP, VALUE} from './helpers';

test.describe('CheckboxGroup', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={CHECKBOX_GROUP.default} />, undefined, {
            width: '660px',
            padding: 20,
        });

        await expectScreenshot();
    });

    test('default value', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={CHECKBOX_GROUP.defaultValue} />, undefined, {
            width: '660px',
            padding: 20,
        });

        await expectScreenshot();
    });

    test('placement vertical', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={CHECKBOX_GROUP.placementVertical} />);

        await expectScreenshot();
    });

    test('disabled', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={CHECKBOX_GROUP.disabled} />, undefined, {
            width: '660px',
            padding: 20,
        });

        await expectScreenshot();
    });
});

test.describe('CheckboxGroup view', () => {
    test('vertical', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={CHECKBOX_GROUP.placementVertical} value={VALUE.vertical} />);

        await expectScreenshot();
    });

    test('horizontal', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={CHECKBOX_GROUP.default} value={VALUE.horizontal} />);

        await expectScreenshot();
    });
});
