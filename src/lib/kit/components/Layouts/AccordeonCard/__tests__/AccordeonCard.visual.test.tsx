import React from 'react';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';
import {DynamicView} from '~playwright/core/DynamicView';

import {ACCORDEON_CARD, VALUE} from './helpers';

test.describe('Accordeon Card Form', () => {
    test.describe('test array specs', () => {
        test('array spec', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={ACCORDEON_CARD.arraySpec} />);

            await expectScreenshot();
        });

        test('required', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={ACCORDEON_CARD.required} />);

            await expectScreenshot();
        });

        test('error max length', async ({mount, expectScreenshot}) => {
            const component = await mount(<DynamicForm spec={ACCORDEON_CARD.errorMaxLength} />);

            await component.getByText('Add element').click();

            await expectScreenshot();
        });

        test('error min length', async ({mount, expectScreenshot}) => {
            const component = await mount(<DynamicForm spec={ACCORDEON_CARD.errorMinLength} />);

            await component.getByText('Add element').click();

            await expectScreenshot();
        });

        test('description', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={ACCORDEON_CARD.description} />);

            await expectScreenshot();
        });
    });

    test('object spec', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={ACCORDEON_CARD.objectSpec} />);

        await expectScreenshot();
    });
});

test.describe('Accordeon Card View', () => {
    test('array spec', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={ACCORDEON_CARD.arraySpec} value={VALUE.array} />);

        await expectScreenshot();
    });

    test('object spec', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={ACCORDEON_CARD.objectSpec} value={VALUE.object} />);

        await expectScreenshot();
    });
});
