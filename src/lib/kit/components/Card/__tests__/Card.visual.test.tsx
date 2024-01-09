import React from 'react';

import {ACCORDEON_CARD, SECTION_CARD, VALUE} from './helpers';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';
import {DynamicView} from '~playwright/core/DynamicView';

test.describe('Card', () => {
    test.describe('Accordeon Card', () => {
        test('array spec', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={ACCORDEON_CARD.arraySpec} />);

            await expectScreenshot();
        });

        test('object spec', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={ACCORDEON_CARD.objectSpec} />);

            await expectScreenshot();
        });
    });

    test.describe('Section Card', () => {
        test('array spec', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={SECTION_CARD.arraySpec} />);

            await expectScreenshot();
        });

        test('object spec', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={SECTION_CARD.objectSpec} />);

            await expectScreenshot();
        });
    });
});

test.describe('Card view', () => {
    test.describe('Accordeon Card', () => {
        test('array spec', async ({mount, expectScreenshot}) => {
            await mount(<DynamicView spec={ACCORDEON_CARD.arraySpec} value={VALUE.array} />);

            await expectScreenshot();
        });

        test('object spec', async ({mount, expectScreenshot}) => {
            await mount(<DynamicView spec={ACCORDEON_CARD.objectSpec} value={VALUE.object} />);

            await expectScreenshot();
        });
    });

    test.describe('Section Card', () => {
        test('array spec', async ({mount, expectScreenshot}) => {
            await mount(<DynamicView spec={SECTION_CARD.arraySpec} value={VALUE.array} />);

            await expectScreenshot();
        });

        test('object spec', async ({mount, expectScreenshot}) => {
            await mount(<DynamicView spec={SECTION_CARD.objectSpec} value={VALUE.object} />);

            await expectScreenshot();
        });
    });
});
