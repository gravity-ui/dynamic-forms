import React from 'react';

import {TEXT_AREA_SPEC} from './helpers';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';

test.describe('Text Area', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={TEXT_AREA_SPEC.default} />);

        await expectScreenshot();
    });

    test('disabled', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={TEXT_AREA_SPEC.disabled} />);

        await expectScreenshot();
    });

    test('description', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={TEXT_AREA_SPEC.description} />);

        await expectScreenshot();
    });

    test('hidden', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={TEXT_AREA_SPEC.hidden} />);

        await expectScreenshot();
    });

    test('layout row verbose', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={TEXT_AREA_SPEC.layoutRowVerbose} />);

        await expectScreenshot();
    });

    test('layout table item', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={TEXT_AREA_SPEC.layoutTableItem} />);

        await expectScreenshot();
    });

    test('layout transperant', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={TEXT_AREA_SPEC.layoutTransparent} />);

        await expectScreenshot();
    });

    test('defaultv value', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={TEXT_AREA_SPEC.defaultValue} />);

        await expectScreenshot();
    });

    test('error min length', async ({mount, expectScreenshot}) => {
        const component = await mount(<DynamicForm spec={TEXT_AREA_SPEC.errorMinLength} />);

        await component.getByRole('textbox').fill('user value');
        await component.getByRole('button').click();

        await expectScreenshot();
    });

    test('error max length', async ({mount, expectScreenshot}) => {
        const component = await mount(<DynamicForm spec={TEXT_AREA_SPEC.errorMaxLength} />);

        await component.getByRole('textbox').fill('user value');

        await expectScreenshot();
    });

    test('error pattern error', async ({mount, expectScreenshot}) => {
        const component = await mount(<DynamicForm spec={TEXT_AREA_SPEC.errorPatternError} />);

        await component.getByRole('textbox').fill('user value');

        await expectScreenshot();
    });
});
