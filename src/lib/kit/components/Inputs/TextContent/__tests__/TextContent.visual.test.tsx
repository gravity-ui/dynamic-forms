import React from 'react';

import {TEXT_CONTENT_SPEC} from './helpers';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';

test.describe('Text Content', () => {
    test.describe('Text', () => {
        test('default', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={TEXT_CONTENT_SPEC.defaultText} />);

            await expectScreenshot();
        });

        test('layout row', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={TEXT_CONTENT_SPEC.textLayoutRow} />);

            await expectScreenshot();
        });

        test('layout row verbose', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={TEXT_CONTENT_SPEC.textLayoutRowVerbose} />);

            await expectScreenshot();
        });

        test('layout transparent', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={TEXT_CONTENT_SPEC.textLayoutTransparent} />);

            await expectScreenshot();
        });
    });

    test.describe('Label', () => {
        test('default', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={TEXT_CONTENT_SPEC.defaultLabel} />);

            await expectScreenshot();
        });

        test('layout row', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={TEXT_CONTENT_SPEC.labelLayoutRow} />);

            await expectScreenshot();
        });

        test('layout row verbose', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={TEXT_CONTENT_SPEC.labelLayoutRowVerbose} />);

            await expectScreenshot();
        });

        test('layout transparent', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={TEXT_CONTENT_SPEC.labelLayoutTransparent} />);

            await expectScreenshot();
        });

        test('no icon', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={TEXT_CONTENT_SPEC.labelNoIcon} />);

            await expectScreenshot();
        });

        test('default value', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={TEXT_CONTENT_SPEC.labelDefaultValue} />);

            await expectScreenshot();
        });
    });

    test.describe('Alert', () => {
        test('default', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={TEXT_CONTENT_SPEC.defaultAlert} />);

            await expectScreenshot();
        });

        test('layout row', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={TEXT_CONTENT_SPEC.alertLayoutRow} />);

            await expectScreenshot();
        });

        test('layout row verbose', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={TEXT_CONTENT_SPEC.alertLayoutRowVerbose} />);

            await expectScreenshot();
        });

        test('layout transparent', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={TEXT_CONTENT_SPEC.alertLayoutTransparent} />);

            await expectScreenshot();
        });

        test('without title', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={TEXT_CONTENT_SPEC.alertWithoutTitle} />);

            await expectScreenshot();
        });
    });
});
