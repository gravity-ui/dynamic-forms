import {resolve} from 'path';

import {defineConfig} from '@playwright/experimental-ct-react';

import config from './playwright.config';

export default defineConfig({
    ...config,
    testDir: resolve(__dirname, '../src/lib/deprecated'),
    testIgnore: [],
});
