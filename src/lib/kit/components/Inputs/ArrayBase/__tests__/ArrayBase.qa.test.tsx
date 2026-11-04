import React from 'react';

import {ThemeProvider} from '@gravity-ui/uikit';
import {render} from '@testing-library/react';

import {SpecTypes} from '../../../../../core';
import {ArrayBase} from '../ArrayBase';

type Props = React.ComponentProps<typeof ArrayBase>;

// Stable across rerenders (incl. defaultValue), so only a changed `qa` can invalidate the AddButton memo.
const input = {name: 'field', onChange: jest.fn()};
const arrayInput = {name: 'field', onItemAdd: jest.fn()};
const defaultValue = ['a'];

const ui = (qa: string | undefined, name = 'field') => {
    const props = {
        name,
        input,
        arrayInput,
        meta: {},
        spec: {
            type: SpecTypes.Array,
            defaultValue,
            items: {type: SpecTypes.String, viewSpec: {type: 'base'}},
            viewSpec: {type: 'base', qa},
        },
    } as unknown as Props;

    return (
        <ThemeProvider>
            <ArrayBase {...props} />
        </ThemeProvider>
    );
};

const getQa = () =>
    Array.from(document.body.querySelectorAll('[data-qa]')).map((el) => el.getAttribute('data-qa'));

describe('ArrayBase -init-arr qa', () => {
    test.each([
        [undefined, 'field', 'field-init-arr'],
        ['orders', 'field', 'orders-init-arr'],
        ['orders', 'field.<3>', 'orders-3-init-arr'],
    ])('qa %p, name %p -> %p', (qa, name, expected) => {
        render(ui(qa, name));

        expect(getQa()).toEqual([expected]);
    });

    test('rerender with another qa updates the button qa', () => {
        const {rerender} = render(ui('orders'));
        rerender(ui('other'));

        expect(getQa()).toEqual(['other-init-arr']);
    });
});
