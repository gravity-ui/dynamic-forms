import {expect} from '@playwright/experimental-ct-react';
import type {Locator} from '@playwright/test';

export const expectInsideScreenshot = async (target: Locator, frame: Locator) => {
    await expect(target).toBeVisible();
    await expect
        .poll(
            async () => {
                const [targetBox, frameBox] = await Promise.all([
                    target.boundingBox(),
                    frame.boundingBox(),
                ]);
                if (!targetBox || !frameBox) {
                    return false;
                }
                return (
                    targetBox.width > 0 &&
                    targetBox.height > 0 &&
                    targetBox.x >= frameBox.x &&
                    targetBox.y >= frameBox.y &&
                    targetBox.x + targetBox.width <= frameBox.x + frameBox.width &&
                    targetBox.y + targetBox.height <= frameBox.y + frameBox.height
                );
            },
            {message: 'The entity value must fit inside the screenshot frame'},
        )
        .toBe(true);
};
