import React from 'react';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';
import {DynamicView} from '~playwright/core/DynamicView';

import {
    NUMBER_VALUE,
    RANGE_INPUT_PICKER_NUMBER_SPEC,
    RANGE_INPUT_PICKER_SPEC,
    VALUE,
} from './helpers';

test.describe('RangeInputPicker', () => {
    test.describe('Object spec', () => {
        test('default', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={RANGE_INPUT_PICKER_SPEC.default} />);

            await expectScreenshot();
        });

        test('default value', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={RANGE_INPUT_PICKER_SPEC.defaultValue} />);

            await expectScreenshot();
        });

        test('required', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={RANGE_INPUT_PICKER_SPEC.required} />);

            await expectScreenshot();
        });

        test('disabled', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={RANGE_INPUT_PICKER_SPEC.disabled} />);

            await expectScreenshot();
        });

        test('description', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={RANGE_INPUT_PICKER_SPEC.description} />);

            await expectScreenshot();
        });

        test('view', async ({mount, expectScreenshot}) => {
            await mount(<DynamicView spec={RANGE_INPUT_PICKER_SPEC.default} value={VALUE} />);

            await expectScreenshot();
        });
    });

    test.describe('Number spec', () => {
        test('default', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={RANGE_INPUT_PICKER_NUMBER_SPEC.default} />);

            await expectScreenshot();
        });

        test('default value', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={RANGE_INPUT_PICKER_NUMBER_SPEC.defaultValue} />);

            await expectScreenshot();
        });

        test('disabled', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={RANGE_INPUT_PICKER_NUMBER_SPEC.disabled} />);

            await expectScreenshot();
        });

        test('view', async ({mount, expectScreenshot}) => {
            await mount(
                <DynamicView spec={RANGE_INPUT_PICKER_NUMBER_SPEC.default} value={NUMBER_VALUE} />,
            );

            await expectScreenshot();
        });
    });
});
