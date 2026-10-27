import React from 'react';

import {isDateTime} from '@gravity-ui/date-utils';
import {Button} from '@gravity-ui/uikit';
import noop from 'lodash/noop';
import {Form} from 'react-final-form';

import {SchemaRenderer, config, errorMessages} from '../../src/unstable';
import type {FieldValue, SchemaRendererProps} from '../../src/unstable';

export interface SchemaFormProps
    extends Required<Omit<SchemaRendererProps, 'config' | 'errorMessages' | 'name'>> {
    value: FieldValue;
    showSubmit: boolean;
    width: number;
}

// Only infrastructure lives here. Each test supplies its renderer settings explicitly.
export const SchemaForm = ({value, showSubmit, width, ...rendererProps}: SchemaFormProps) => (
    <div style={{width}}>
        <Form
            initialValues={{input: value}}
            onSubmit={noop}
            validateOnBlur={rendererProps.validateOnBlur}
        >
            {({handleSubmit, values}) => (
                <form onSubmit={handleSubmit}>
                    <SchemaRenderer
                        {...rendererProps}
                        name="input"
                        config={config}
                        errorMessages={errorMessages}
                    />
                    {showSubmit && <Button type="submit">Submit</Button>}
                    <output data-qa="form-value" hidden>
                        {JSON.stringify(values.input)}
                    </output>
                    <output data-qa="form-value-type" hidden>
                        {isDateTime(values.input)
                            ? 'date_time'
                            : values.input instanceof Date
                            ? 'date'
                            : typeof values.input}
                    </output>
                </form>
            )}
        </Form>
    </div>
);
