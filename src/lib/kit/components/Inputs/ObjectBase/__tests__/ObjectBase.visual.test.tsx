import React from 'react';

import {OBJECT_BASE, OBJECT_INLINE, VALUE, VALUE_INLINE} from './helpers';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';
import {DynamicView} from '~playwright/core/DynamicView';

test.describe('Object Base', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={OBJECT_BASE.default} />);

        await expectScreenshot();
    });

    test('default value', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={OBJECT_BASE.defaultValue} />);

        await expectScreenshot();
    });

    test('required', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={OBJECT_BASE.required} />);

        await expectScreenshot();
    });

    test('description', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={OBJECT_BASE.desription} />);

        await expectScreenshot();
    });

    test.describe('layouts', () => {
        test('section', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={OBJECT_BASE.section} />);

            await expectScreenshot();
        });

        test('section2', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={OBJECT_BASE.section2} />);

            await expectScreenshot();
        });

        test('group', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={OBJECT_BASE.group} />);

            await expectScreenshot();
        });
        test('group2', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={OBJECT_BASE.group2} />);

            await expectScreenshot();
        });

        test('transparent', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={OBJECT_BASE.transparent} />);

            await expectScreenshot();
        });

        test('card accordeon', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={OBJECT_BASE.card_accordeon} />);

            await expectScreenshot();
        });

        test('card section', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={OBJECT_BASE.card_section} />);

            await expectScreenshot();
        });
    });
});

test.describe('Object Inline', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={OBJECT_INLINE.default} />);

        await expectScreenshot();
    });

    test('delimiter', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={OBJECT_INLINE.delimiter} />);

        await expectScreenshot();
    });
});

test('Object Base view', async ({mount, expectScreenshot}) => {
    await mount(<DynamicView spec={OBJECT_BASE.default} value={VALUE} />);

    await expectScreenshot();
});

test.describe('Object Inline view', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={OBJECT_INLINE.default} value={VALUE_INLINE} />);

        await expectScreenshot();
    });

    test('delimiter', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={OBJECT_INLINE.delimiter} value={VALUE_INLINE} />);

        await expectScreenshot();
    });
});
