import React from 'react';

import {beforeMount} from '@playwright/experimental-ct-react/hooks';

import {Provider} from './Providers';

beforeMount(async ({App}) => {
    return (
        <Provider>
            <App />
        </Provider>
    );
});
