import React from 'react';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';

import {PASSWORD_SPEC, STRING_SPEC} from './helpers';

test.describe('Text Input', () => {
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
