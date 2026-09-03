import React from 'react';

import {ThemeProvider} from '@gravity-ui/uikit';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import noop from 'lodash/noop';
import {Form} from 'react-final-form';

import {type ArraySpec, DynamicField, SpecTypes} from '../../../../../core';
import {dynamicConfig} from '../../../../constants';

beforeEach(() => {
    window.matchMedia = () => ({
        media: '',
        matches: false,
        onchange: () => {},
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
    });
});

const renderNumberEnum = (values: number[]) => {
    const spec: ArraySpec = {
        type: SpecTypes.Array,
        enum: values,
        defaultValue: [3],
        viewSpec: {
            type: 'select',
            layout: 'row',
        },
    };

    render(
        <ThemeProvider>
            <Form initialValues={{input: [3]}} onSubmit={noop}>
                {({values}) => (
                    <>
                        <DynamicField name="input" spec={spec} config={dynamicConfig} />
                        <output data-testid="value">{JSON.stringify(values.input)}</output>
                    </>
                )}
            </Form>
        </ThemeProvider>,
    );

    return screen.getByText('3');
};

test('renders an array select with nine numeric enum options', () => {
    expect(renderNumberEnum([1, 2, 3, 4, 5, 6, 7, 8, 9])).toBeVisible();
});

test('renders an array select with ten numeric enum options', () => {
    expect(renderNumberEnum([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toBeVisible();
});

test('keeps numeric enum values after selection', async () => {
    const user = userEvent.setup();

    renderNumberEnum([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', {name: '4'}));

    await waitFor(() => {
        expect(screen.getByTestId('value')).toHaveTextContent('[3,4]');
    });
});
