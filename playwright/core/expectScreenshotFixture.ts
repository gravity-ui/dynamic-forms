import {expect} from '@playwright/experimental-ct-react';

import type {ExpectScreenshotFixture, PlaywrightFixture} from './types';

export const expectScreenshotFixture: PlaywrightFixture<ExpectScreenshotFixture> = async (
    {page},
    run,
    testInfo,
) => {
    const expectScreenshot: ExpectScreenshotFixture = async ({
        component,
        screenshotName,
        fullPage,
        ...pageScreenshotOptions
    } = {}) => {
        const captureScreenshot = async () => {
            if (fullPage) {
                return page.screenshot({
                    animations: 'disabled',
                    ...pageScreenshotOptions,
                    fullPage,
                });
            }
            return (component || page.locator('.playwright-wrapper-test')).screenshot({
                animations: 'disabled',
                ...pageScreenshotOptions,
            });
        };

        const nameScreenshot = testInfo.titlePath.slice(1).join(' ');

        await page.emulateMedia({colorScheme: 'light'});
        await expect(page.locator('body')).toHaveClass(/g-root_theme_light/);

        expect(await captureScreenshot()).toMatchSnapshot({
            name: `${screenshotName || nameScreenshot} light.png`,
        });

        await page.emulateMedia({colorScheme: 'dark'});
        await expect(page.locator('body')).toHaveClass(/g-root_theme_dark/);

        expect(await captureScreenshot()).toMatchSnapshot({
            name: `${screenshotName || nameScreenshot} dark.png`,
        });
    };

    await run(expectScreenshot);
};
