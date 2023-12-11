import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {NUMBER_SPEC, PASSWORD_SPEC, STRING_SPEC} from './helpers';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';

test.describe('Text Input', () => {
    test.describe('Number spec', () => {
        test('default', async ({mount}) => {
            const component = await mount(<DynamicForm spec={NUMBER_SPEC.default} />);

            await expect(component).toHaveScreenshot();
        });

        test('required', async ({mount}) => {
            const component = await mount(<DynamicForm spec={NUMBER_SPEC.required} />);

            await expect(component).toHaveScreenshot();
        });

        test('disabled', async ({mount}) => {
            const component = await mount(<DynamicForm spec={NUMBER_SPEC.disabled} />);

            await expect(component).toHaveScreenshot();
        });

        test('description', async ({mount}) => {
            const component = await mount(<DynamicForm spec={NUMBER_SPEC.description} />);

            await expect(component).toHaveScreenshot();
        });

        test('hidden', async ({mount}) => {
            const component = await mount(<DynamicForm spec={NUMBER_SPEC.hidden} />);

            await expect(component).toHaveScreenshot();
        });

        test('layout row verbose', async ({mount}) => {
            const component = await mount(<DynamicForm spec={NUMBER_SPEC.layoutRowVerbose} />);

            await expect(component).toHaveScreenshot();
        });

        test('layout table item', async ({mount}) => {
            const component = await mount(<DynamicForm spec={NUMBER_SPEC.layoutTableItem} />);

            await expect(component).toHaveScreenshot();
        });

        test('layout transperant', async ({mount}) => {
            const component = await mount(<DynamicForm spec={NUMBER_SPEC.layoutTransperant} />);

            await expect(component).toHaveScreenshot();
        });

        test('default value', async ({mount}) => {
            const component = await mount(<DynamicForm spec={NUMBER_SPEC.defaultValue} />);

            await expect(component).toHaveScreenshot();
        });
    });

    test.describe('Password spec', () => {
        test('default', async ({mount}) => {
            const component = await mount(<DynamicForm spec={PASSWORD_SPEC.default} />);

            await expect(component).toHaveScreenshot();
        });

        test('generate random value button', async ({mount}) => {
            const component = await mount(
                <div style={{minWidth: '700px'}}>
                    <DynamicForm spec={PASSWORD_SPEC.generateRandomValueButton} />
                </div>,
            );

            await expect(component).toHaveScreenshot();
        });

        test('default value', async ({mount}) => {
            const component = await mount(<DynamicForm spec={PASSWORD_SPEC.defaultValue} />);

            await expect(component).toHaveScreenshot();
        });
    });

    test.describe('String spec', () => {
        test('default', async ({mount}) => {
            const component = await mount(<DynamicForm spec={STRING_SPEC.default} />);

            await expect(component).toHaveScreenshot();
        });

        test('error minLength', async ({mount}) => {
            const component = await mount(<DynamicForm spec={STRING_SPEC.errorMinLength} />);

            await component.getByRole('textbox').fill('user value');
            await component.getByRole('button').click();

            await expect(component).toHaveScreenshot();
        });

        test('error max length', async ({mount}) => {
            const component = await mount(<DynamicForm spec={STRING_SPEC.errorMaxLength} />);

            await component.getByRole('textbox').fill('user value');

            await expect(component).toHaveScreenshot();
        });

        test('error pattern error', async ({mount}) => {
            const component = await mount(<DynamicForm spec={STRING_SPEC.errorPatternError} />);

            await component.getByRole('textbox').fill('user value');

            await expect(component).toHaveScreenshot();
        });
    });
});
