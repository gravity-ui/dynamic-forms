import React from 'react';

import {Provider, Toaster, ToasterComponent, ToasterProvider} from '@gravity-ui/uikit';
import {beforeMount} from '@playwright/experimental-ct-react/hooks';

import './index.scss';

const toaster = new Toaster();

beforeMount(async ({App}) => {
    return (
        <Provider>
            <ToasterProvider toaster={toaster}>
                <App />
                <ToasterComponent />
            </ToasterProvider>
        </Provider>
    );
});
