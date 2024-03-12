import React from 'react';

import {BOOLEAN_ONEOF, BOOLEAN_ONEOF_FALT, VALUE} from './helpers';

import {test} from '~playwright/core';
import {DynamicForm} from '~playwright/core/DynamicForm';
import {DynamicView} from '~playwright/core/DynamicView';

test.describe('BooleanOneOf', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={BOOLEAN_ONEOF.default} />);

        await expectScreenshot();
    });

    test('default value object', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={BOOLEAN_ONEOF.defaultValueObject} />);

        await expectScreenshot();
    });

    test('default value string', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={BOOLEAN_ONEOF.defaultValueString} />);

        await expectScreenshot();
    });

    test('description', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={BOOLEAN_ONEOF.desription} />);

        await expectScreenshot();
    });

    test.describe('layouts', () => {
        test('row verbose', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={BOOLEAN_ONEOF.row_verbose} />);

            await expectScreenshot();
        });

        test('transparent', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={BOOLEAN_ONEOF.transparent} />);

            await expectScreenshot();
        });
    });
});

test.describe('BooleanOneOf view', () => {
    test('true', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={BOOLEAN_ONEOF.default} value={VALUE.true} />);

        await expectScreenshot();
    });

    test('false', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={BOOLEAN_ONEOF.default} value={VALUE.false} />);

        await expectScreenshot();
    });

    test.describe('layouts', () => {
        test('row verbose', async ({mount, expectScreenshot}) => {
            await mount(<DynamicView spec={BOOLEAN_ONEOF.row_verbose} value={VALUE.true} />);

            await expectScreenshot();
        });

        test('transparent', async ({mount, expectScreenshot}) => {
            await mount(<DynamicView spec={BOOLEAN_ONEOF.transparent} value={VALUE.true} />);

            await expectScreenshot();
        });
    });
});

test.describe('BooleanOneOf Flat', () => {
    test('default', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={BOOLEAN_ONEOF_FALT.default} />);

        await expectScreenshot();
    });

    test('description', async ({mount, expectScreenshot}) => {
        await mount(<DynamicForm spec={BOOLEAN_ONEOF_FALT.desription} />);

        await expectScreenshot();
    });

    test.describe('layouts', () => {
        test('row verbose', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={BOOLEAN_ONEOF_FALT.row_verbose} />);

            await expectScreenshot();
        });

        test('transparent', async ({mount, expectScreenshot}) => {
            await mount(<DynamicForm spec={BOOLEAN_ONEOF_FALT.transparent} />);

            await expectScreenshot();
        });
    });
});

test.describe('BooleanOneOf Flat view', () => {
    test('true', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={BOOLEAN_ONEOF_FALT.default} value={VALUE.true} />);

        await expectScreenshot();
    });

    test('false', async ({mount, expectScreenshot}) => {
        await mount(<DynamicView spec={BOOLEAN_ONEOF_FALT.default} value={VALUE.false} />);

        await expectScreenshot();
    });

    test.describe('layouts', () => {
        test('row verbose', async ({mount, expectScreenshot}) => {
            await mount(<DynamicView spec={BOOLEAN_ONEOF_FALT.row_verbose} value={VALUE.true} />);

            await expectScreenshot();
        });

        test('transparent', async ({mount, expectScreenshot}) => {
            await mount(<DynamicView spec={BOOLEAN_ONEOF_FALT.transparent} value={VALUE.true} />);

            await expectScreenshot();
        });
    });
});
