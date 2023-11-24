import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {TEXT_AREA_SPEC} from './helpers';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';

test.describe('Text Area', () => {
    test('default', async ({mount}) => {
        const component = await mount(<DynamicForm spec={TEXT_AREA_SPEC.default} />);

        await expect(component).toHaveScreenshot();
    });

    test('disabled', async ({mount}) => {
        const component = await mount(<DynamicForm spec={TEXT_AREA_SPEC.disabled} />);

        await expect(component).toHaveScreenshot();
    });

    test('description', async ({mount}) => {
        const component = await mount(<DynamicForm spec={TEXT_AREA_SPEC.description} />);

        await expect(component).toHaveScreenshot();
    });

    test('hidden', async ({mount}) => {
        const component = await mount(<DynamicForm spec={TEXT_AREA_SPEC.hidden} />);

        await expect(component).toHaveScreenshot();
    });

    test('layoutRowVerbose', async ({mount}) => {
        const component = await mount(<DynamicForm spec={TEXT_AREA_SPEC.layoutRowVerbose} />);

        await expect(component).toHaveScreenshot();
    });

    test('layoutTableItem', async ({mount}) => {
        const component = await mount(<DynamicForm spec={TEXT_AREA_SPEC.layoutTableItem} />);

        await expect(component).toHaveScreenshot();
    });

    test('layoutTransperant', async ({mount}) => {
        const component = await mount(<DynamicForm spec={TEXT_AREA_SPEC.layoutTransperant} />);

        await expect(component).toHaveScreenshot();
    });

    test('defaultValue', async ({mount}) => {
        const component = await mount(<DynamicForm spec={TEXT_AREA_SPEC.defaultValue} />);

        await expect(component).toHaveScreenshot();
    });

    test('errorMinLength', async ({mount}) => {
        const component = await mount(<DynamicForm spec={TEXT_AREA_SPEC.errorMinLength} />);

        await component.getByRole('textbox').fill('user value');
        await component.getByRole('button').click();

        await expect(component).toHaveScreenshot();
    });

    test('errorMaxLength', async ({mount}) => {
        const component = await mount(<DynamicForm spec={TEXT_AREA_SPEC.errorMaxLength} />);

        await component.getByRole('textbox').fill('user value');

        await expect(component).toHaveScreenshot();
    });

    test('errorPatternError', async ({mount}) => {
        const component = await mount(<DynamicForm spec={TEXT_AREA_SPEC.errorPatternError} />);

        await component.getByRole('textbox').fill('user value');

        await expect(component).toHaveScreenshot();
    });
});
