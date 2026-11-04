import React from 'react';

import {ThemeProvider} from '@gravity-ui/uikit';
import {render} from '@testing-library/react';

import {RemoveButton} from '../RemoveButton';

const onDrop = jest.fn();

const ui = (name: string) => (
    <ThemeProvider>
        <RemoveButton name={name} onDrop={onDrop} switcherClassName="switcher" />
    </ThemeProvider>
);

describe('RemoveButton', () => {
    test('rerender with another name updates the switcher qa', () => {
        const {rerender} = render(ui('a'));
        rerender(ui('b'));

        const qas = Array.from(document.body.querySelectorAll('[data-qa]'));

        expect(qas.map((el) => el.getAttribute('data-qa'))).toEqual(['b-drop-item']);
    });
});
