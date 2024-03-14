import React from 'react';

import {ONEOF, ONEOF_FALT, VALUE} from './helpers';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';
import {DynamicView} from '~playwright/core/DynamicView';

test.describe('OneOf', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={ONEOF.default} />);

        await expectScreenshot();
    });

    test('default value object', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={ONEOF.defaultValueObject} />);

        await expectScreenshot();
    });

    test('default value string', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={ONEOF.defaultValueString} />);

        await expectScreenshot();
    });

    test('required', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={ONEOF.required} />);

        await expectScreenshot();
    });

    test('description', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={ONEOF.desription} />);

        await expectScreenshot();
    });

    test.describe('layouts', () => {
        test('row verbose', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={ONEOF.row_verbose} />);

            await expectScreenshot();
        });

        test('transparent', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={ONEOF.transparent} />);

            await expectScreenshot();
        });
    });

    test('toggler checkbox default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={ONEOF.defaultCheckbox} />);

        await expectScreenshot();
    });
});

test.describe('OneOf view', () => {
    test('object', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={ONEOF.default} value={VALUE.object} />);

        await expectScreenshot();
    });

    test('string', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={ONEOF.default} value={VALUE.string} />);

        await expectScreenshot();
    });

    test.describe('layouts', () => {
        test('row verbose', async ({mount, expectScreenshot}) => {
            await mount(<DynamicView spec={ONEOF.row_verbose} value={VALUE.object} />);

            await expectScreenshot();
        });

        test('transparent', async ({mount, expectScreenshot}) => {
            await mount(<DynamicView spec={ONEOF.transparent} value={VALUE.object} />);

            await expectScreenshot();
        });
    });

    test('toggler checkbox default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={ONEOF.defaultCheckbox} value={VALUE.object} />);

        await expectScreenshot();
    });
});

test.describe('OneOf Flat', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={ONEOF_FALT.default} />);

        await expectScreenshot();
    });

    test('required', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={ONEOF_FALT.required} />);

        await expectScreenshot();
    });

    test('description', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={ONEOF_FALT.desription} />);

        await expectScreenshot();
    });

    test.describe('layouts', () => {
        test('row verbose', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={ONEOF_FALT.row_verbose} />);

            await expectScreenshot();
        });

        test('transparent', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={ONEOF_FALT.transparent} />);

            await expectScreenshot();
        });
    });

    test('toggler checkbox default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={ONEOF_FALT.defaultCheckbox} />);

        await expectScreenshot();
    });
});

test.describe('OneOf Flat view', () => {
    test('object', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={ONEOF_FALT.default} value={VALUE.object} />);

        await expectScreenshot();
    });

    test('string', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={ONEOF_FALT.default} value={VALUE.string} />);

        await expectScreenshot();
    });

    test.describe('layouts', () => {
        test('row verbose', async ({mount, expectScreenshot}) => {
            await mount(<DynamicView spec={ONEOF_FALT.row_verbose} value={VALUE.object} />);

            await expectScreenshot();
        });

        test('transparent', async ({mount, expectScreenshot}) => {
            await mount(<DynamicView spec={ONEOF_FALT.transparent} value={VALUE.object} />);

            await expectScreenshot();
        });
    });

    test('toggler checkbox default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={ONEOF_FALT.defaultCheckbox} value={VALUE.string} />);

        await expectScreenshot();
    });
});
