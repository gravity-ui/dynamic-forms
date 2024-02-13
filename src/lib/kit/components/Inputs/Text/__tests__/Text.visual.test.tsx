import React from 'react';

import {NUMBER_SPEC, PASSWORD_SPEC, STRING_SPEC} from './helpers';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';

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

    test.describe('Password spec', () => {
        test('default', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={PASSWORD_SPEC.default} />);

            await expectScreenshot();
        });

        test('generate random value button', async ({mount, expectScreenshot}) => {
            await mount(
                <div style={{minWidth: '700px'}}>
                    <DynamicForm spec={PASSWORD_SPEC.generateRandomValueButton} />
                </div>,
            );

            await expectScreenshot();
        });

        test('default value', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={PASSWORD_SPEC.defaultValue} />);

            await expectScreenshot();
        });
    });

    test.describe('String spec', () => {
        test('default', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={STRING_SPEC.default} />);

            await expectScreenshot();
        });

        test('error minLength', async ({mount, expectScreenshot}) => {
            const component = await mount(<DynamicForm spec={STRING_SPEC.errorMinLength} />);

            await component.getByRole('textbox').fill('user value');
            await component.getByRole('button').click();

            await expectScreenshot();
        });

        test('error max length', async ({mount, expectScreenshot}) => {
            const component = await mount(<DynamicForm spec={STRING_SPEC.errorMaxLength} />);

            await component.getByRole('textbox').fill('user value');

            await expectScreenshot();
        });

        test('error pattern error', async ({mount, expectScreenshot}) => {
            const component = await mount(<DynamicForm spec={STRING_SPEC.errorPatternError} />);

            await component.getByRole('textbox').fill('user value');

            await expectScreenshot();
        });
    });
});
