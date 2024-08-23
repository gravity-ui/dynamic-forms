import {expect} from '@playwright/experimental-ct-react';

import type {ExpectScreenshotFixture, PlaywrightFixture} from './types';

declare global {
    interface Window {
        __setTheme: (theme?: string) => void;
    }
}

export const expectScreenshotFixture: PlaywrightFixture<ExpectScreenshotFixture> = async (
    {page},
    use,
    testInfo,
) => {
    const expectScreenshot: ExpectScreenshotFixture = async ({
        component,
        screenshotName,
        ...pageScreenshotOptions
    } = {}) => {
        const captureScreenshot = async (theme: string) => {
            await page.waitForFunction(() => typeof window.__setTheme === 'function');

            await page.evaluate((t) => window.__setTheme(t), theme);

            return (component || page.locator('.playwright-wrapper-test')).screenshot({
                animations: 'disabled',
                ...pageScreenshotOptions,
            });
        };

        const nameScreenshot = testInfo.titlePath.slice(1).join(' ');

        expect(await captureScreenshot('dark')).toMatchSnapshot({
            name: `${screenshotName || nameScreenshot} dark.png`,
        });

        expect(await captureScreenshot('light')).toMatchSnapshot({
            name: `${screenshotName || nameScreenshot} light.png`,
        });
    };

    await use(expectScreenshot);
};
