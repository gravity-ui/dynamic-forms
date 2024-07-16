import React from 'react';

import {TABLE_ARRAY_INPUT, VALUE} from './helpers';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';
import {DynamicView} from '~playwright/core/DynamicView';

test.describe('Table Array Input', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={TABLE_ARRAY_INPUT.default} />);

        await expectScreenshot();
    });

    test('default value', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={TABLE_ARRAY_INPUT.defaultValue} />);

        await expectScreenshot();
    });

    test('required', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={TABLE_ARRAY_INPUT.required} />);

        await expectScreenshot();
    });

    test('error max length', async ({mount, expectScreenshot}) => {
        const component = await mount(<DynamicForm spec={TABLE_ARRAY_INPUT.errorMaxLength} />);

        await component.getByText('Candidate').click();

        await expectScreenshot();
    });

    test('error min length', async ({mount, expectScreenshot}) => {
        const component = await mount(<DynamicForm spec={TABLE_ARRAY_INPUT.errorMinLength} />);

        await component.getByText('Candidate').click();

        await expectScreenshot();
    });

    test('table property description', async ({mount, expectScreenshot}) => {
        const component = await mount(<DynamicForm spec={TABLE_ARRAY_INPUT.propertyDescription} />);

        await component.getByText('Candidate').click();

        await expectScreenshot();
    });
});

test.describe('Table Array Input view', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={TABLE_ARRAY_INPUT.default} value={VALUE.array} />);

        await expectScreenshot();
    });
});
