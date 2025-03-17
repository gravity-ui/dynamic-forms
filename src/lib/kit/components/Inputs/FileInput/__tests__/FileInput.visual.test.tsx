import React from 'react';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';
import {DynamicView} from '~playwright/core/DynamicView';

import {FILE_INPUT, VALUE} from './helpers';

test.describe('File Input', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={FILE_INPUT.default} />);

        await expectScreenshot();
    });

    test('full', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={FILE_INPUT.full} />);

        await expectScreenshot();
    });

    test('default value', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={FILE_INPUT.defaultValue} />);

        await expectScreenshot();
    });

    test('ignore text', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={FILE_INPUT.ignoreText} />);

        await expectScreenshot();
    });

    test('ignore text with default value', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={FILE_INPUT.ignoreTextWithDefaultValue} />);

        await expectScreenshot();
    });
});

test.describe('File Input view', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={FILE_INPUT.default} value={VALUE} />);

        await expectScreenshot();
    });

    test('ignoreText', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={FILE_INPUT.ignoreText} value={VALUE} />);

        await expectScreenshot();
    });
});
