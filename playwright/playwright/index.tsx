import React from 'react';

import {beforeMount} from '@playwright/experimental-ct-react/hooks';

import {Providers} from './Providers';

beforeMount(async ({App}) => {
    return (
        <Providers>
            <App />
        </Providers>
    );
});
