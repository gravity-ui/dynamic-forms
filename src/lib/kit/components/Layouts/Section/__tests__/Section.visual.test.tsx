import React from 'react';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';
import {DynamicView} from '~playwright/core/DynamicView';

import {SECTION, VALUE} from './helpers';

test.describe('Section', () => {
    test('section array spec', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={SECTION.sectionArraySpec} />);

        await expectScreenshot();
    });

    test('section object spec', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={SECTION.sectionObjectSpec} />);

        await expectScreenshot();
    });

    test('section2 array spec', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={SECTION.section2ArraySpec} />);

        await expectScreenshot();
    });

    test('section2 object spec', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={SECTION.section2ObjectSpec} />);

        await expectScreenshot();
    });

    test('group array spec', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={SECTION.groupArraySpec} />);

        await expectScreenshot();
    });

    test('group object spec', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={SECTION.groupObjectSpec} />);

        await expectScreenshot();
    });

    test('group2 array spec', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={SECTION.group2ArraySpec} />);

        await expectScreenshot();
    });

    test('group2 object spec', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={SECTION.group2ObjectSpec} />);

        await expectScreenshot();
    });
});

test.describe('Section View', () => {
    test('section array spec', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={SECTION.sectionArraySpec} value={VALUE.array} />);

        await expectScreenshot();
    });

    test('section object spec', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={SECTION.sectionObjectSpec} value={VALUE.object} />);

        await expectScreenshot();
    });

    test('section2 array spec', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={SECTION.section2ArraySpec} value={VALUE.array} />);

        await expectScreenshot();
    });

    test('section2 object spec', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={SECTION.section2ObjectSpec} value={VALUE.object} />);

        await expectScreenshot();
    });

    test('group array spec', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={SECTION.groupArraySpec} value={VALUE.array} />);

        await expectScreenshot();
    });

    test('group object spec', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={SECTION.groupObjectSpec} value={VALUE.object} />);

        await expectScreenshot();
    });

    test('group2 array spec', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={SECTION.group2ArraySpec} value={VALUE.array} />);

        await expectScreenshot();
    });

    test('group2 object spec', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={SECTION.group2ObjectSpec} value={VALUE.object} />);

        await expectScreenshot();
    });
});
