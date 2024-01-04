import React from 'react';

import {CARD_ONEOF, VALUE} from './helpers';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';
import {DynamicView} from '~playwright/core/DynamicView';

test.describe('Card OneOf', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={CARD_ONEOF.default} />);

        await expectScreenshot();
    });

    test('default value object', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={CARD_ONEOF.defaultValueObject} />);

        await expectScreenshot();
    });

    test('default value string', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={CARD_ONEOF.defaultValueString} />);

        await expectScreenshot();
    });

    test('required', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={CARD_ONEOF.required} />);

        await expectScreenshot();
    });

    test('description', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={CARD_ONEOF.desription} />);

        await expectScreenshot();
    });
});

test.describe('Card OneOf view', () => {
    test('object', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={CARD_ONEOF.default} value={VALUE.object} />);

        await expectScreenshot();
    });

    test('string', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={CARD_ONEOF.default} value={VALUE.string} />);

        await expectScreenshot();
    });
});
