import React from 'react';

import {beforeMount} from '@playwright/experimental-ct-react/hooks';
import {MobileProvider, ThemeProvider, ToasterComponent, ToasterProvider} from '@gravity-ui/uikit';

import './index.scss';

beforeMount(async ({App}) => {
    return (
        <ThemeProvider>
            <MobileProvider>
                <ToasterProvider>
                    <App />
                    <ToasterComponent />
                </ToasterProvider>
            </MobileProvider>
        </ThemeProvider>
    );
});
