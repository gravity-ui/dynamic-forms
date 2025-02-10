import React from 'react';

import {beforeMount} from '@playwright/experimental-ct-react/hooks';
import {
    MobileProvider,
    ThemeProvider,
    Toaster,
    ToasterComponent,
    ToasterProvider,
} from '@gravity-ui/uikit';

import './index.scss';

const toaster = new Toaster();

beforeMount(async ({App}) => {
    return (
        <ThemeProvider>
            <MobileProvider>
                <ToasterProvider toaster={toaster}>
                    <App />
                    <ToasterComponent />
                </ToasterProvider>
            </MobileProvider>
        </ThemeProvider>
    );
});
