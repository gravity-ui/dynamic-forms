import React from 'react';

import {Provider} from '@gravity-ui/uikit';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import noop from 'lodash/noop';
import {Form} from 'react-final-form';

import {NodeType, SchemaRenderer, SchemaRendererMode} from '../../../../../../core';
import {config} from '../../../../../../kit/constants';
import {DynamicField, SpecTypes} from '../../../../../core';
import {dynamicConfig} from '../../../../constants';

beforeEach(() => {
    window.matchMedia = () => ({
        media: '',
        matches: false,
        onchange: null,
        addListener: noop,
        removeListener: noop,
        addEventListener: noop,
        removeEventListener: noop,
        dispatchEvent: () => true,
    });
});

describe.each(['DynamicField', 'SchemaRenderer'])('%s DateInput', (renderer) => {
    test.each([
        {
            timeZone: 'America/New_York',
            initialValue: '2024-02-20T12:30:00.000Z',
            initialDisplay: '20.02.2024 07:30',
            expectedValue: '2024-02-21T13:45:00.000Z',
        },
        {
            timeZone: 'UTC',
            initialValue: '2024-02-20T12:30:00.000Z',
            initialDisplay: '20.02.2024 12:30',
            expectedValue: '2024-02-21T08:45:00.000Z',
        },
    ])('edits and clears the date in $timeZone', async (scenario) => {
        const user = userEvent.setup();
        const format = 'DD.MM.YYYY HH:mm';
        const timeZone = scenario.timeZone;

        render(
            <Provider>
                <Form initialValues={{input: scenario.initialValue}} onSubmit={noop}>
                    {({values}) => (
                        <>
                            {renderer === 'DynamicField' ? (
                                <DynamicField
                                    name="input"
                                    config={dynamicConfig}
                                    spec={{
                                        type: SpecTypes.String,
                                        viewSpec: {
                                            type: 'date_input',
                                            dateInput: {
                                                printFormat: format,
                                                timeZone,
                                            },
                                        },
                                    }}
                                />
                            ) : (
                                <SchemaRenderer
                                    name="input"
                                    mode={SchemaRendererMode.Form}
                                    config={config}
                                    validateOnBlur={false}
                                    schema={{
                                        nodeParameters: {
                                            type: NodeType.Any,
                                            entity: 'date',
                                            entityProps: {
                                                format,
                                                timeZone,
                                            },
                                        },
                                    }}
                                />
                            )}
                            <output data-testid="value">{JSON.stringify(values.input)}</output>
                        </>
                    )}
                </Form>
            </Provider>,
        );

        const input = screen.getByRole('combobox') as HTMLInputElement;
        expect(input.value.replace(/[\u2066-\u2069]/g, '')).toBe(scenario.initialDisplay);

        await user.click(input);
        await user.paste('21.02.2024 08:45');
        await user.tab();

        expect(input.value.replace(/[\u2066-\u2069]/g, '')).toBe('21.02.2024 08:45');
        await waitFor(() => {
            expect(screen.getByTestId('value')).toHaveTextContent(
                JSON.stringify(scenario.expectedValue),
            );
        });

        await user.click(screen.getByRole('button', {name: 'Clear'}));
        await waitFor(() => expect(screen.getByTestId('value')).toBeEmptyDOMElement());
    });
});
