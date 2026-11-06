import {defineConfig} from '@playwright/experimental-ct-react';

import config from './playwright.config';

export default defineConfig({
    ...config,
    testIgnore: '**/deprecated/**',
});
