import React from 'react';

import {ThemeProvider} from '@gravity-ui/uikit';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import cloneDeep from 'lodash/cloneDeep';
import noop from 'lodash/noop';
import {Form} from 'react-final-form';

import type {NumberSpec, Spec, StringSpec} from '../../../../../core';
import {DynamicField, SpecTypes} from '../../../../../core';
import {dynamicConfig} from '../../../../constants';

const NAME = 'input';

const PLACEHOLDER = 'placeholder text';

const SPEC_NUMBER: NumberSpec = {
    type: SpecTypes.Number,
    required: true,
    viewSpec: {
        type: 'base',
        layout: 'row',
        layoutTitle: 'Age',
        placeholder: PLACEHOLDER,
    },
};

const SPEC_STRING: StringSpec = {
    type: SpecTypes.String,
    viewSpec: {
        type: 'base',
        placeholder: PLACEHOLDER,
    },
};

const SPEC_PASSWORD: StringSpec = {
    type: SpecTypes.String,
    viewSpec: {
        type: 'password',
        placeholder: PLACEHOLDER,
    },
};

const DynamicForm = ({spec}: {spec: Spec}) => (
    <ThemeProvider>
        <Form initialValues={{}} onSubmit={noop}>
            {() => <DynamicField name={NAME} spec={spec} config={dynamicConfig} />}
        </Form>
    </ThemeProvider>
);

beforeEach(() => {
    window.matchMedia = () => ({
        media: '',
        matches: false,
        onchange: () => {},
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: (_) => true,
    });
});

describe('Text input', () => {
    test('input display check', () => {
        render(<DynamicForm spec={SPEC_STRING} />);

        const input = screen.getByPlaceholderText(PLACEHOLDER);

        expect(input).toBeVisible();
    });

    test('checking value change, focus, deleting input value in Number spec', async () => {
        render(<DynamicForm spec={SPEC_NUMBER} />);

        const user = userEvent.setup();
        const input = screen.getByPlaceholderText(PLACEHOLDER);

        expect(input).not.toHaveFocus();

        await user.click(input);

        expect(input).toHaveFocus();

        await user.keyboard('1');

        expect(input).toHaveValue('1');

        await user.type(input, '{backspace}');

        expect(input).toHaveValue('');
    });

    test('check button clear', async () => {
        render(<DynamicForm spec={SPEC_STRING} />);

        const user = userEvent.setup();
        const input = screen.getByPlaceholderText(PLACEHOLDER);

        let clearButton = screen.queryByRole('button', {name: 'Clear'});

        expect(clearButton).not.toBeInTheDocument();

        await user.click(input);
        await user.keyboard('text value');

        clearButton = screen.queryByRole('button', {name: 'Clear'});

        expect(clearButton).toBeInTheDocument();

        if (clearButton) {
            await user.click(clearButton);
        }

        expect(input).toHaveValue('');
        expect(clearButton).not.toBeInTheDocument();
    });

    test('checking default values String spec', async () => {
        const spec = cloneDeep(SPEC_STRING);
        spec.defaultValue = 'default value';

        render(<DynamicForm spec={spec} />);

        const input = screen.getByPlaceholderText(PLACEHOLDER);

        expect(input).toHaveValue('default value');
    });

    test('checking default values Number spec', async () => {
        const spec = cloneDeep(SPEC_NUMBER);
        spec.defaultValue = 123;

        render(<DynamicForm spec={spec} />);

        const input = screen.getByPlaceholderText(PLACEHOLDER);

        expect(input).toHaveValue('123');
    });

    test('disabled input check', async () => {
        const spec = cloneDeep(SPEC_STRING);
        spec.viewSpec.disabled = true;

        render(<DynamicForm spec={spec} />);

        const user = userEvent.setup();
        const input = screen.getByPlaceholderText(PLACEHOLDER);

        await user.click(input);

        expect(input).not.toHaveFocus();
        expect(input).toBeDisabled();
    });

    test('spec password autocomplete check', () => {
        render(<DynamicForm spec={SPEC_PASSWORD} />);

        const input = screen.getByPlaceholderText(PLACEHOLDER);

        expect(input.getAttribute('autocomplete')).toBe('new-password');
    });

    test('error message check in Number spec', async () => {
        const {container} = render(<DynamicForm spec={SPEC_NUMBER} />);

        const user = userEvent.setup();
        const input = screen.getByPlaceholderText(PLACEHOLDER);

        await user.click(input);
        await user.keyboard('value');

        expect(input).toHaveValue('value');
        expect(container.querySelector('.df-error-wrapper__error-text')).toBeInTheDocument();
        expect(screen.getByText('Value must be a number')).toBeVisible();

        const clearButton = screen.queryByRole('button', {name: 'Clear'});

        expect(clearButton).toBeInTheDocument();

        if (clearButton) {
            await user.click(clearButton);
        }

        expect(input).toHaveValue('');
        expect(container.querySelector('.df-error-wrapper__error-text')).toBeInTheDocument();
        expect(screen.getByText('Empty field')).toBeVisible();

        await user.keyboard('1');

        expect(input).toHaveValue('1');
        expect(container.querySelector('.df-error-wrapper__error-text')).not.toBeInTheDocument();
    });
});
