import React from 'react';

import {ThemeProvider} from '@gravity-ui/uikit';
import {render} from '@testing-library/react';

import {RemoveButton} from '../RemoveButton';

const onDrop = jest.fn();

const ui = (name: string, qa?: string) => (
    <ThemeProvider>
        <RemoveButton name={name} qa={qa} onDrop={onDrop} switcherClassName="switcher" />
    </ThemeProvider>
);

const getQa = () =>
    Array.from(document.body.querySelectorAll('[data-qa]')).map((el) => el.getAttribute('data-qa'));

describe('RemoveButton', () => {
    test('qa takes precedence over name', () => {
        render(ui('field', 'custom'));

        expect(getQa()).toEqual(['custom-drop-item']);
    });

    test.each([
        ['name', ['a'], ['b'], 'b-drop-item'],
        ['qa', ['f', 'x'], ['f', 'y'], 'y-drop-item'],
    ])('rerender with another %s updates the switcher qa', (_, before, after, expected) => {
        const {rerender} = render(ui(before[0], before[1]));
        rerender(ui(after[0], after[1]));

        expect(getQa()).toEqual([expected]);
    });
});
