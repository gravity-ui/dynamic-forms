import React from 'react';

import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import _ from 'lodash';
import {Form} from 'react-final-form';

import {DynamicField, NumberSpec, Spec, SpecTypes, StringSpec} from '../../../../../core';
import {dynamicConfig} from '../../../../../kit/constants';

const NAME = 'input';

const PLACEHOLDER = 'placeholder text';

const SPEC_NUMBER: NumberSpec = {
    type: SpecTypes.Number,
    viewSpec: {
        type: 'base',
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
    <Form initialValues={{}} onSubmit={_.noop}>
        {() => <DynamicField name={NAME} spec={spec} config={dynamicConfig} />}
    </Form>
);

describe('Text input', () => {
    describe('String spec', () => {
        test('text input: visible input, clear button, onChange', async () => {
            render(<DynamicForm spec={SPEC_STRING} />);

            const user = userEvent.setup();
            const input = screen.getByPlaceholderText(PLACEHOLDER);

            expect(input).toBeVisible();

            let clearButton = screen.queryByRole('button', {name: 'Clear input value'});

            expect(clearButton).not.toBeInTheDocument();

            await user.click(input);

            expect(input).toHaveFocus();
            expect(input).not.toBeDisabled();

            await user.keyboard('text value');

            expect(input).toHaveValue('text value');

            clearButton = screen.queryByRole('button', {name: 'Clear input value'});

            expect(clearButton).toBeInTheDocument();

            if (clearButton) {
                await user.click(clearButton);
            }

            expect(input).toHaveValue('');
            expect(clearButton).not.toBeInTheDocument();

            await user.keyboard('text value');

            expect(input).toHaveValue('text value');
        });

        test('disabled text input', async () => {
            const spec = _.cloneDeep(SPEC_STRING);
            spec.viewSpec.disabled = true;

            render(<DynamicForm spec={spec} />);

            const user = userEvent.setup();
            const input = screen.getByPlaceholderText(PLACEHOLDER);

            expect(input).toBeVisible();

            await user.click(input);

            expect(input).not.toHaveFocus();
            expect(input).toBeDisabled();
        });

        test('default value text input', async () => {
            const spec = _.cloneDeep(SPEC_STRING);
            spec.defaultValue = 'default value';

            render(<DynamicForm spec={spec} />);

            const user = userEvent.setup();
            const input = screen.getByPlaceholderText(PLACEHOLDER);

            expect(input).toBeVisible();

            await user.click(input);

            expect(input).toHaveFocus();
            expect(input).not.toBeDisabled();
            expect(input).toHaveValue('default value');

            const clearButton = screen.queryByRole('button', {name: 'Clear input value'});

            expect(clearButton).toBeInTheDocument();
        });
    });

    describe('Number spec', () => {
        test('text input: visible input, clear button, onChange ', async () => {
            render(<DynamicForm spec={SPEC_NUMBER} />);

            const user = userEvent.setup();
            const input = screen.getByPlaceholderText(PLACEHOLDER);

            expect(input).toBeVisible();

            let clearButton = screen.queryByRole('button', {name: 'Clear input value'});

            expect(clearButton).not.toBeInTheDocument();

            await user.click(input);

            expect(input).toHaveFocus();
            expect(input).not.toBeDisabled();

            await user.keyboard('123');

            expect(input).toHaveValue('123');

            clearButton = screen.queryByRole('button', {name: 'Clear input value'});

            expect(clearButton).toBeInTheDocument();

            if (clearButton) {
                await user.click(clearButton);
            }

            expect(input).toHaveValue('');
            expect(clearButton).not.toBeInTheDocument();

            await user.keyboard('123');

            expect(input).toHaveValue('123');
        });

        test('disabled text input', async () => {
            const spec = _.cloneDeep(SPEC_NUMBER);
            spec.viewSpec.disabled = true;

            render(<DynamicForm spec={spec} />);

            const user = userEvent.setup();
            const input = screen.getByPlaceholderText(PLACEHOLDER);

            expect(input).toBeVisible();

            await user.click(input);

            expect(input).not.toHaveFocus();
            expect(input).toBeDisabled();
        });

        test('default value text input', async () => {
            const spec = _.cloneDeep(SPEC_NUMBER);
            spec.defaultValue = 123;

            render(<DynamicForm spec={spec} />);

            const user = userEvent.setup();
            const input = screen.getByPlaceholderText(PLACEHOLDER);

            expect(input).toBeVisible();

            await user.click(input);

            expect(input).toHaveFocus();
            expect(input).not.toBeDisabled();
            expect(input).toHaveValue('123');

            const clearButton = screen.queryByRole('button', {name: 'Clear input value'});

            expect(clearButton).toBeInTheDocument();
        });
    });

    describe('password', () => {
        test('visible input, clear button, onChange', async () => {
            render(<DynamicForm spec={SPEC_PASSWORD} />);

            const user = userEvent.setup();
            const input = screen.getByPlaceholderText(PLACEHOLDER);

            expect(input).toBeVisible();
            expect(input.getAttribute('autocomplete')).toBe('new-password');

            let clearButton = screen.queryByRole('button', {name: 'Clear input value'});

            expect(clearButton).not.toBeInTheDocument();

            await user.click(input);

            expect(input).toHaveFocus();
            expect(input).not.toBeDisabled();

            await user.keyboard('text value');

            expect(input).toHaveValue('text value');

            clearButton = screen.queryByRole('button', {name: 'Clear input value'});

            expect(clearButton).toBeInTheDocument();

            if (clearButton) {
                await user.click(clearButton);
            }

            expect(input).toHaveValue('');
            expect(clearButton).not.toBeInTheDocument();

            await user.keyboard('text value');

            expect(input).toHaveValue('text value');
        });

        test('disabled password', async () => {
            const spec = _.cloneDeep(SPEC_PASSWORD);
            spec.viewSpec.disabled = true;

            render(<DynamicForm spec={spec} />);

            const user = userEvent.setup();
            const input = screen.getByPlaceholderText(PLACEHOLDER);

            expect(input).toBeVisible();

            await user.click(input);

            expect(input).not.toHaveFocus();
            expect(input).toBeDisabled();
        });

        test('default value password', async () => {
            const spec = _.cloneDeep(SPEC_PASSWORD);
            spec.defaultValue = 'default value';

            render(<DynamicForm spec={spec} />);

            const user = userEvent.setup();
            const input = screen.getByPlaceholderText(PLACEHOLDER);

            expect(input).toBeVisible();

            await user.click(input);

            expect(input).toHaveFocus();
            expect(input).not.toBeDisabled();
            expect(input).toHaveValue('default value');

            const clearButton = screen.queryByRole('button', {name: 'Clear input value'});

            expect(clearButton).toBeInTheDocument();
        });
    });
});
