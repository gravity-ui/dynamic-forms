import React from 'react';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';
import {DynamicView} from '~playwright/core/DynamicView';

import {MULTI_ONEOF, MULTI_ONEOF_FALT, VALUE} from './helpers';

test.describe('Multi OneOf', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={MULTI_ONEOF.default} />);

        await expectScreenshot();
    });

    test('default value person', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={MULTI_ONEOF.defaultValuePerson} />);

        await expectScreenshot();
    });

    test('default value full', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={MULTI_ONEOF.defaultValueFull} />);

        await expectScreenshot();
    });

    test('required', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={MULTI_ONEOF.required} />);

        await expectScreenshot();
    });

    test('description', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={MULTI_ONEOF.desription} />);

        await expectScreenshot();
    });

    test.describe('layouts', () => {
        test('row verbose', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={MULTI_ONEOF.row_verbose} />);

            await expectScreenshot();
        });

        test('transparent', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={MULTI_ONEOF.transparent} />);

            await expectScreenshot();
        });
    });
});

test.describe('Multi OneOf view', () => {
    test('person', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={MULTI_ONEOF.default} value={VALUE.person} />);

        await expectScreenshot();
    });

    test('full', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={MULTI_ONEOF.default} value={VALUE.full} />);

        await expectScreenshot();
    });

    test.describe('layouts', () => {
        test('row verbose', async ({mount, expectScreenshot}) => {
            await mount(<DynamicView spec={MULTI_ONEOF.row_verbose} value={VALUE.person} />);

            await expectScreenshot();
        });

        test('transparent', async ({mount, expectScreenshot}) => {
            await mount(<DynamicView spec={MULTI_ONEOF.transparent} value={VALUE.person} />);

            await expectScreenshot();
        });
    });
});

test.describe('Multi OneOf Flat', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={MULTI_ONEOF_FALT.default} />);

        await expectScreenshot();
    });

    test('default value person', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={MULTI_ONEOF_FALT.defaultValuePerson} />);

        await expectScreenshot();
    });

    test('default value full', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={MULTI_ONEOF_FALT.defaultValueFull} />);

        await expectScreenshot();
    });

    test('required', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={MULTI_ONEOF_FALT.required} />);

        await expectScreenshot();
    });

    test('description', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={MULTI_ONEOF_FALT.desription} />);

        await expectScreenshot();
    });

    test.describe('layouts', () => {
        test('row verbose', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={MULTI_ONEOF_FALT.row_verbose} />);

            await expectScreenshot();
        });

        test('transparent', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={MULTI_ONEOF_FALT.transparent} />);

            await expectScreenshot();
        });
    });
});

test.describe('Multi OneOf Flat view', () => {
    test('person', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={MULTI_ONEOF_FALT.default} value={VALUE.person} />);

        await expectScreenshot();
    });

    test('full', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={MULTI_ONEOF_FALT.default} value={VALUE.full} />);

        await expectScreenshot();
    });

    test.describe('layouts', () => {
        test('row verbose', async ({mount, expectScreenshot}) => {
            await mount(<DynamicView spec={MULTI_ONEOF_FALT.row_verbose} value={VALUE.person} />);

            await expectScreenshot();
        });

        test('transparent', async ({mount, expectScreenshot}) => {
            await mount(<DynamicView spec={MULTI_ONEOF_FALT.transparent} value={VALUE.person} />);

            await expectScreenshot();
        });
    });
});
