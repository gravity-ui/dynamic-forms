import React from 'react';

import type {DecoratorFn} from '@storybook/react';

import {Provider} from '@gravity-ui/uikit';

import '@gravity-ui/uikit/styles/styles.scss';
import './styles.scss';

export const withTheme: DecoratorFn = (Story, context) => (
    <Provider theme={context.globals.theme} lang={context.globals.lang}>
        <Story {...context} />
    </Provider>
);
