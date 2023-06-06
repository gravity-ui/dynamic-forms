import React from 'react';

import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import _ from 'lodash';
import {Form} from 'react-final-form';

import {DynamicField, NumberSpec, Spec, SpecTypes, StringSpec} from '../../../../../core';
import {dynamicConfig} from '../../../../constants';

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
        test('visible input', () => {
            render(<DynamicForm spec={SPEC_STRING} />);

            const input = screen.getByPlaceholderText(PLACEHOLDER);

            expect(input).toBeVisible();
        });

        test('not disabled input', () => {
            render(<DynamicForm spec={SPEC_STRING} />);

            const input = screen.getByPlaceholderText(PLACEHOLDER);

            expect(input).not.toBeDisabled();
        });

        test('disabled input', async () => {
            const spec = _.cloneDeep(SPEC_STRING);
            spec.viewSpec.disabled = true;

            render(<DynamicForm spec={spec} />);

            const user = userEvent.setup();
            const input = screen.getByPlaceholderText(PLACEHOLDER);

            await user.click(input);

            expect(input).not.toHaveFocus();
            expect(input).toBeDisabled();
        });

        test('focus input', async () => {
            render(<DynamicForm spec={SPEC_STRING} />);

            const user = userEvent.setup();
            const input = screen.getByPlaceholderText(PLACEHOLDER);

            expect(input).not.toHaveFocus();

            await user.click(input);

            expect(input).toHaveFocus();
        });

        test('onChange input', async () => {
            render(<DynamicForm spec={SPEC_STRING} />);

            const user = userEvent.setup();
            const input = screen.getByPlaceholderText(PLACEHOLDER);

            await user.click(input);
            await user.keyboard('text value');

            expect(input).toHaveValue('text value');
        });

        test('clear button', async () => {
            render(<DynamicForm spec={SPEC_STRING} />);

            const user = userEvent.setup();
            const input = screen.getByPlaceholderText(PLACEHOLDER);

            let clearButton = screen.queryByRole('button', {name: 'Clear input value'});

            expect(clearButton).not.toBeInTheDocument();

            await user.click(input);
            await user.keyboard('text value');

            clearButton = screen.queryByRole('button', {name: 'Clear input value'});

            expect(clearButton).toBeInTheDocument();

            if (clearButton) {
                await user.click(clearButton);
            }

            expect(clearButton).not.toBeInTheDocument();
        });

        test('default value input', async () => {
            const spec = _.cloneDeep(SPEC_STRING);
            spec.defaultValue = 'default value';

            render(<DynamicForm spec={spec} />);

            const input = screen.getByPlaceholderText(PLACEHOLDER);

            expect(input).toHaveValue('default value');
        });
    });

    describe('Number spec', () => {
        test('visible input', () => {
            render(<DynamicForm spec={SPEC_NUMBER} />);

            const input = screen.getByPlaceholderText(PLACEHOLDER);

            expect(input).toBeVisible();
        });

        test('not disabled input', () => {
            render(<DynamicForm spec={SPEC_NUMBER} />);

            const input = screen.getByPlaceholderText(PLACEHOLDER);

            expect(input).not.toBeDisabled();
        });

        test('disabled input', async () => {
            const spec = _.cloneDeep(SPEC_NUMBER);
            spec.viewSpec.disabled = true;

            render(<DynamicForm spec={spec} />);

            const user = userEvent.setup();
            const input = screen.getByPlaceholderText(PLACEHOLDER);

            await user.click(input);

            expect(input).not.toHaveFocus();
            expect(input).toBeDisabled();
        });

        test('focus input', async () => {
            render(<DynamicForm spec={SPEC_NUMBER} />);

            const user = userEvent.setup();
            const input = screen.getByPlaceholderText(PLACEHOLDER);

            expect(input).not.toHaveFocus();

            await user.click(input);

            expect(input).toHaveFocus();
        });

        test('onChange input', async () => {
            render(<DynamicForm spec={SPEC_NUMBER} />);

            const user = userEvent.setup();
            const input = screen.getByPlaceholderText(PLACEHOLDER);

            await user.click(input);
            await user.keyboard('123');

            expect(input).toHaveValue('123');
        });

        test('clear button', async () => {
            render(<DynamicForm spec={SPEC_NUMBER} />);

            const user = userEvent.setup();
            const input = screen.getByPlaceholderText(PLACEHOLDER);

            let clearButton = screen.queryByRole('button', {name: 'Clear input value'});

            expect(clearButton).not.toBeInTheDocument();

            await user.click(input);
            await user.keyboard('123');

            clearButton = screen.queryByRole('button', {name: 'Clear input value'});

            expect(clearButton).toBeInTheDocument();

            if (clearButton) {
                await user.click(clearButton);
            }

            expect(clearButton).not.toBeInTheDocument();
        });

        test('default value input', async () => {
            const spec = _.cloneDeep(SPEC_NUMBER);
            spec.defaultValue = 123;

            render(<DynamicForm spec={spec} />);

            const input = screen.getByPlaceholderText(PLACEHOLDER);

            expect(input).toHaveValue('123');
        });
    });

    describe('password', () => {
        test('visible input', () => {
            render(<DynamicForm spec={SPEC_PASSWORD} />);

            const input = screen.getByPlaceholderText(PLACEHOLDER);

            expect(input).toBeVisible();
        });

        test('not disabled input', () => {
            render(<DynamicForm spec={SPEC_PASSWORD} />);

            const input = screen.getByPlaceholderText(PLACEHOLDER);

            expect(input).not.toBeDisabled();
        });

        test('disabled input', async () => {
            const spec = _.cloneDeep(SPEC_PASSWORD);
            spec.viewSpec.disabled = true;

            render(<DynamicForm spec={spec} />);

            const user = userEvent.setup();
            const input = screen.getByPlaceholderText(PLACEHOLDER);

            await user.click(input);

            expect(input).not.toHaveFocus();
            expect(input).toBeDisabled();
        });

        test('focus input', async () => {
            render(<DynamicForm spec={SPEC_PASSWORD} />);

            const user = userEvent.setup();
            const input = screen.getByPlaceholderText(PLACEHOLDER);

            expect(input).not.toHaveFocus();

            await user.click(input);

            expect(input).toHaveFocus();
        });

        test('onChange input', async () => {
            render(<DynamicForm spec={SPEC_PASSWORD} />);

            const user = userEvent.setup();
            const input = screen.getByPlaceholderText(PLACEHOLDER);

            await user.click(input);
            await user.keyboard('new password');

            expect(input).toHaveValue('new password');
        });

        test('clear button', async () => {
            render(<DynamicForm spec={SPEC_PASSWORD} />);

            const user = userEvent.setup();
            const input = screen.getByPlaceholderText(PLACEHOLDER);

            let clearButton = screen.queryByRole('button', {name: 'Clear input value'});

            expect(clearButton).not.toBeInTheDocument();

            await user.click(input);
            await user.keyboard('new password');

            clearButton = screen.queryByRole('button', {name: 'Clear input value'});

            expect(clearButton).toBeInTheDocument();

            if (clearButton) {
                await user.click(clearButton);
            }

            expect(clearButton).not.toBeInTheDocument();
        });

        test('default value input', async () => {
            const spec = _.cloneDeep(SPEC_PASSWORD);
            spec.defaultValue = 'new password';

            render(<DynamicForm spec={spec} />);

            const input = screen.getByPlaceholderText(PLACEHOLDER);

            expect(input).toHaveValue('new password');
        });

        test('autocomplete input', () => {
            render(<DynamicForm spec={SPEC_PASSWORD} />);

            const input = screen.getByPlaceholderText(PLACEHOLDER);

            expect(input.getAttribute('autocomplete')).toBe('new-password');
        });
    });
});
