import React from 'react';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';
import {DynamicView} from '~playwright/core/DynamicView';

import {CARD_ONEOF, VALUE} from './helpers';

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

    test('column layout', async ({mount, expectScreenshot}) => {
        const specWithColumnLayout = {
            ...CARD_ONEOF.default,
            viewSpec: {
                ...CARD_ONEOF.default.viewSpec,
                layout: 'column',
            },
        } as const;

        await mount(<DynamicForm spec={specWithColumnLayout} />);

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

    test('column layout', async ({mount, expectScreenshot}) => {
        const specWithColumnLayout = {
            ...CARD_ONEOF.default,
            viewSpec: {
                ...CARD_ONEOF.default.viewSpec,
                layout: 'column',
            },
        } as const;

        await mount(<DynamicView spec={specWithColumnLayout} value={VALUE.string} />);

        await expectScreenshot();
    });
});
