import React from 'react';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';

import {NUMBER_SPEC} from './helpers';

test.describe('Text Input', () => {
    test.describe('Number spec', () => {
        test('default', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={NUMBER_SPEC.default} />);

            await expectScreenshot();
        });

        test('required', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={NUMBER_SPEC.required} />);

            await expectScreenshot();
        });

        test('disabled', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={NUMBER_SPEC.disabled} />);

            await expectScreenshot();
        });

        test('description', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={NUMBER_SPEC.description} />);

            await expectScreenshot();
        });

        test('hidden', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={NUMBER_SPEC.hidden} />);

            await expectScreenshot();
        });

        test('layout row verbose', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={NUMBER_SPEC.layoutRowVerbose} />);

            await expectScreenshot();
        });

        test('layout table item', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={NUMBER_SPEC.layoutTableItem} />);

            await expectScreenshot();
        });

        test('layout transperant', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={NUMBER_SPEC.layoutTransparent} />);

            await expectScreenshot();
        });

        test('default value', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={NUMBER_SPEC.defaultValue} />);

            await expectScreenshot();
        });
    });
});
