import React from 'react';

import type {DecoratorFn} from '@storybook/react';

import {ThemeProvider} from '@gravity-ui/uikit';

import '@gravity-ui/uikit/styles/styles.scss';
import './styles.scss';

export const withTheme: DecoratorFn = (Story, context) => (
    <React.StrictMode>
        <ThemeProvider theme={context.globals.theme}>
            <Story {...context} />
        </ThemeProvider>
    </React.StrictMode>
);
