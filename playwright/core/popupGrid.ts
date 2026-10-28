import {expect} from '@playwright/experimental-ct-react';
import type {Locator, Page} from '@playwright/test';

// Floating UI positions portals against the viewport. Fit the whole grid before
// checking their positions, so off-screen rows cannot flip into neighbouring cells.
export const fitGridInViewport = async (page: Page, grid: Locator) => {
    const box = await grid.locator('.playwright-wrapper-test').boundingBox();
    if (!box) {
        throw new Error('The screenshot grid must be mounted before fitting the viewport');
    }
    await page.setViewportSize({
        width: Math.ceil(box.width + 40),
        height: Math.ceil(box.height + 40),
    });
    await page.evaluate(() => window.scrollTo(0, 0));
};

export const getSelectPopup = async (page: Page, control: Locator) => {
    await expect(control).toHaveAttribute('aria-expanded', 'true');
    const id = await control.getAttribute('aria-controls');
    expect(id).toBeTruthy();
    return page.locator('.g-select-popup').filter({has: page.locator(`[id="${id}"]`)});
};

export const expectPopupInCell = async (popup: Locator, cell: Locator, control: Locator) => {
    await expect(popup).toBeVisible();
    await expect
        .poll(
            async () => {
                const [popupBox, controlBox] = await Promise.all([
                    popup.boundingBox(),
                    control.boundingBox(),
                ]);
                if (!popupBox || !controlBox) {
                    return {insideCell: false, covered: ['Popup or control is not visible']};
                }
                // Measure visible text and inputs, not background containers such
                // as Card. One browser evaluation checks the entire cell.
                return cell.evaluate(
                    (element, {box, trigger}) => {
                        const intersects = (rect: {
                            x: number;
                            y: number;
                            width: number;
                            height: number;
                        }) =>
                            rect.width > 0 &&
                            rect.height > 0 &&
                            rect.x < box.x + box.width &&
                            rect.x + rect.width > box.x &&
                            rect.y < box.y + box.height &&
                            rect.y + rect.height > box.y;
                        const frame = element.getBoundingClientRect();
                        // Containment also rules out overlap with neighbouring cells
                        // and their portals, since the grid cells do not intersect.
                        const insideCell =
                            box.width > 0 &&
                            box.height > 0 &&
                            box.x >= frame.left &&
                            box.y >= frame.top &&
                            box.x + box.width <= frame.right &&
                            box.y + box.height <= frame.bottom;
                        const covered = intersects(trigger) ? ['Popup trigger'] : [];
                        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
                        while (walker.nextNode()) {
                            const node = walker.currentNode;
                            const text = node.textContent?.trim();
                            if (
                                !text ||
                                !node.parentElement ||
                                getComputedStyle(node.parentElement).visibility === 'hidden'
                            ) {
                                continue;
                            }
                            const range = document.createRange();
                            range.selectNodeContents(node);
                            if (Array.from(range.getClientRects()).some(intersects)) {
                                covered.push(text);
                            }
                        }
                        for (const input of element.querySelectorAll(
                            'input, textarea, button, [role="combobox"]',
                        )) {
                            if (
                                getComputedStyle(input).visibility !== 'hidden' &&
                                intersects(input.getBoundingClientRect())
                            ) {
                                covered.push(input.getAttribute('aria-label') || input.tagName);
                            }
                        }
                        return {insideCell, covered};
                    },
                    {box: popupBox, trigger: controlBox},
                );
            },
            {message: 'The popup must fit its cell without covering text or controls'},
        )
        .toEqual({insideCell: true, covered: []});
};
