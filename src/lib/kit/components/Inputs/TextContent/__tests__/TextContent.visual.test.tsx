import React from 'react';

import {expect} from '@playwright/experimental-ct-react';

import {TEXT_CONTENT_SPEC} from './helpers';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';

test.describe('Text Content', () => {
    test.describe('Text', () => {
        test('default', async ({mount}) => {
            const component = await mount(<DynamicForm spec={TEXT_CONTENT_SPEC.defaultText} />);

            await expect(component).toHaveScreenshot();
        });

        test('layoutRow', async ({mount}) => {
            const component = await mount(<DynamicForm spec={TEXT_CONTENT_SPEC.textLayoutRow} />);

            await expect(component).toHaveScreenshot();
        });

        test('layoutRowVerbose', async ({mount}) => {
            const component = await mount(
                <DynamicForm spec={TEXT_CONTENT_SPEC.textLayoutRowVerbose} />,
            );

            await expect(component).toHaveScreenshot();
        });

        test('layoutTransparent', async ({mount}) => {
            const component = await mount(
                <DynamicForm spec={TEXT_CONTENT_SPEC.textLayoutTransparent} />,
            );

            await expect(component).toHaveScreenshot();
        });
    });

    test.describe('Label', () => {
        test('default', async ({mount}) => {
            const component = await mount(<DynamicForm spec={TEXT_CONTENT_SPEC.defaultLabel} />);

            await expect(component).toHaveScreenshot();
        });

        test('layoutRow', async ({mount}) => {
            const component = await mount(<DynamicForm spec={TEXT_CONTENT_SPEC.labelLayoutRow} />);

            await expect(component).toHaveScreenshot();
        });

        test('layoutRowVerbose', async ({mount}) => {
            const component = await mount(
                <DynamicForm spec={TEXT_CONTENT_SPEC.labelLayoutRowVerbose} />,
            );

            await expect(component).toHaveScreenshot();
        });

        test('layoutTransparent', async ({mount}) => {
            const component = await mount(
                <DynamicForm spec={TEXT_CONTENT_SPEC.labelLayoutTransparent} />,
            );

            await expect(component).toHaveScreenshot();
        });

        test('no icon', async ({mount}) => {
            const component = await mount(<DynamicForm spec={TEXT_CONTENT_SPEC.labelNoIcon} />);

            await expect(component).toHaveScreenshot();
        });

        test('defaultValue', async ({mount}) => {
            const component = await mount(
                <DynamicForm spec={TEXT_CONTENT_SPEC.labelDefaultValue} />,
            );

            await expect(component).toHaveScreenshot();
        });
    });
});
