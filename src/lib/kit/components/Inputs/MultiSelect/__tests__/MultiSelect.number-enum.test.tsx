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

const renderNumberEnum = (values: number[], initialValue: number[] | undefined = [3]) => {
    const spec: ArraySpec = {
        type: SpecTypes.Array,
        enum: values,
        defaultValue: initialValue,
        viewSpec: {
            type: 'select',
            layout: 'row',
        },
    };

    render(
        <ThemeProvider>
            <Form initialValues={{input: initialValue}} onSubmit={noop}>
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

test('renders an array select without an initial value', () => {
    renderNumberEnum([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], undefined);

    expect(screen.getByRole('combobox')).toBeVisible();
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
