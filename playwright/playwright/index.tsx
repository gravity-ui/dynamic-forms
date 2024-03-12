import React from 'react';

import {beforeMount} from '@playwright/experimental-ct-react/hooks';
import {MobileProvider, ThemeProvider} from '@gravity-ui/uikit';

import './index.scss';

beforeMount(async ({App}) => {
    return (
        <ThemeProvider theme="light">
            <MobileProvider>
                <App />
            </MobileProvider>
        </ThemeProvider>
    );
});
