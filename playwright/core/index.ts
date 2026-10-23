import {test as base} from '@playwright/experimental-ct-react';

import {expectScreenshotFixture} from './expectScreenshotFixture';
import {mountFixture} from './mountFixture';
import type {Fixtures} from './types';

export const test = base.extend<Fixtures>({
    mount: mountFixture,
    expectScreenshot: expectScreenshotFixture,
});

// The full SchemaRenderer column is captured at CSS resolution. Avoid allocating
// Retina-sized browser surfaces for tens of thousands of pixels in height.
export const schemaTest = test.extend<Fixtures>({deviceScaleFactor: 1});
