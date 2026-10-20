import React from 'react';

import {Provider} from '@gravity-ui/uikit';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Form} from 'react-final-form';

import {DynamicField, SpecTypes, dynamicConfig} from '../deprecated';

test('deprecated DynamicField can render and submit through SchemaRenderer', async () => {
    const submit = jest.fn();
    const user = userEvent.setup();

    render(
        <Provider>
            <Form initialValues={{field: 'before'}} onSubmit={submit}>
                {({handleSubmit}) => (
                    <form onSubmit={handleSubmit}>
                        <DynamicField
                            name="field"
                            spec={{type: SpecTypes.String, viewSpec: {type: 'base'}}}
                            config={dynamicConfig}
                            withSchemaRenderer
                        />
                        <button type="submit">Save</button>
                    </form>
                )}
            </Form>
        </Provider>,
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('before');
    await user.clear(input);
    await user.type(input, 'after');
    await user.click(screen.getByRole('button', {name: 'Save'}));

    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
    expect(submit.mock.calls[0][0]).toMatchObject({field: 'after'});
});
