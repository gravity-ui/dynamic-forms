import React from 'react';

import {ThemeProvider} from '@gravity-ui/uikit';
import {render} from '@testing-library/react';

import {SpecTypes} from '../../../../../core';
import {TableArrayInput} from '../TableArrayInput';

type Props = React.ComponentProps<typeof TableArrayInput>;

const renderInput = (qa: string | undefined, name: string) => {
    const props = {
        name,
        input: {name, onChange: jest.fn()},
        arrayInput: {name, onItemAdd: jest.fn()},
        meta: {},
        spec: {
            type: SpecTypes.Array,
            defaultValue: [{name: 'a'}],
            items: {
                type: SpecTypes.Object,
                properties: {name: {type: SpecTypes.String, viewSpec: {type: 'base'}}},
                viewSpec: {type: 'base'},
            },
            viewSpec: {type: 'table', table: [{label: 'Name', property: 'name'}], qa},
        },
    } as unknown as Props;

    render(
        <ThemeProvider>
            <TableArrayInput {...props} />
        </ThemeProvider>,
    );
};

describe('TableArrayInput -init-arr qa', () => {
    test.each([
        [undefined, 'field', 'field-init-arr'],
        ['orders', 'field', 'orders-init-arr'],
        ['orders', 'field.<3>', 'orders-3-init-arr'],
    ])('qa %p, name %p -> %p', (qa, name, expected) => {
        renderInput(qa, name);

        const qas = Array.from(document.body.querySelectorAll('[data-qa]'));

        expect(qas.map((el) => el.getAttribute('data-qa'))).toEqual([expected]);
    });
});
