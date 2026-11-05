import React from 'react';

import {Provider} from '@gravity-ui/uikit';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import noop from 'lodash/noop';
import {Form} from 'react-final-form';

import {DynamicField, SpecTypes} from '../../../../../core';
import {
    JsonSchemaType,
    NodeType,
    SchemaRenderer,
    SchemaRendererMode,
} from '../../../../../unstable/core';
import {config} from '../../../../../unstable/kit/constants';
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

const descriptions = {alpha: 'First option', beta: 'Second option'};
const metadata = {alpha: 'First details', beta: 'Second details'};
const enumValues = ['alpha', 'beta', ...Array.from({length: 8}, (_, index) => `option-${index}`)];
const nodeParameters = {
    entity: 'select',
    layout: 'row',
    entityProps: {
        filterable: true,
        filterPlaceholder: 'Search options',
        enumDescriptions: descriptions,
        optionsMeta: metadata,
    },
};

describe.each([false, true])('Select with multiple=%s', (multiple) => {
    test.each(['DynamicField', 'SchemaRenderer'])(
        '%s preserves labels, filtering and submitted values with JSX options',
        async (renderer) => {
            const user = userEvent.setup();

            render(
                <Provider>
                    <Form initialValues={{input: multiple ? ['alpha'] : 'alpha'}} onSubmit={noop}>
                        {({values}) => (
                            <>
                                {renderer === 'DynamicField' ? (
                                    <DynamicField
                                        name="input"
                                        config={dynamicConfig}
                                        spec={{
                                            type: multiple ? SpecTypes.Array : SpecTypes.String,
                                            enum: enumValues,
                                            description: descriptions,
                                            viewSpec: {
                                                type: 'select',
                                                layout: 'row',
                                                selectParams: {
                                                    meta: metadata,
                                                    filterPlaceholder: 'Search options',
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
                                        schema={
                                            multiple
                                                ? {
                                                      type: JsonSchemaType.Array,
                                                      items: {
                                                          type: JsonSchemaType.String,
                                                          enum: enumValues,
                                                      },
                                                      nodeParameters: {
                                                          ...nodeParameters,
                                                          type: NodeType.Array,
                                                      },
                                                  }
                                                : {
                                                      type: JsonSchemaType.String,
                                                      enum: enumValues,
                                                      nodeParameters: {
                                                          ...nodeParameters,
                                                          type: NodeType.String,
                                                      },
                                                  }
                                        }
                                    />
                                )}
                                <output data-testid="value">{JSON.stringify(values.input)}</output>
                            </>
                        )}
                    </Form>
                </Provider>,
            );

            expect(screen.getByRole('combobox')).toHaveTextContent('First option');
            await user.click(screen.getByRole('combobox'));
            await user.type(screen.getByPlaceholderText('Search options'), 'Second');

            expect(screen.queryByRole('option', {name: /First option/})).not.toBeInTheDocument();
            await user.click(screen.getByRole('option', {name: /Second option/}));

            await waitFor(() => {
                expect(screen.getByTestId('value')).toHaveTextContent(
                    JSON.stringify(multiple ? ['alpha', 'beta'] : 'beta'),
                );
            });
        },
    );
});
