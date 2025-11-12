import React from 'react';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';

import {TEXT_CONTENT_SPEC} from './helpers';

test.describe('Text Content', () => {
    test.describe('Text', () => {
        test('default', async ({mount, expectScreenshot}) => {
            const component = await mount(<DynamicForm spec={TEXT_CONTENT_SPEC.defaultText} />);

            await component
                .locator(
                    '.g-text.g-text_variant_body-1.g-color-text.g-color-text_color_warning.df-text-content__icon',
                )
                .waitFor();

            await expectScreenshot();
        });

        test('layout row', async ({mount, expectScreenshot}) => {
            const component = await mount(<DynamicForm spec={TEXT_CONTENT_SPEC.textLayoutRow} />);

            await component
                .locator(
                    '.g-text.g-text_variant_body-1.g-color-text.g-color-text_color_warning.df-text-content__icon',
                )
                .waitFor();

            await expectScreenshot();
        });

        test('layout row verbose', async ({mount, expectScreenshot}) => {
            const component = await mount(
                <DynamicForm spec={TEXT_CONTENT_SPEC.textLayoutRowVerbose} />,
            );

            await component
                .locator(
                    '.g-text.g-text_variant_body-1.g-color-text.g-color-text_color_warning.df-text-content__icon',
                )
                .waitFor();

            await expectScreenshot();
        });

        test('layout transparent', async ({mount, expectScreenshot}) => {
            const component = await mount(
                <DynamicForm spec={TEXT_CONTENT_SPEC.textLayoutTransparent} />,
            );

            await component
                .locator(
                    '.g-text.g-text_variant_body-1.g-color-text.g-color-text_color_warning.df-text-content__icon',
                )
                .waitFor();

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
