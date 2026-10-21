import React from 'react';

import {Button} from '@gravity-ui/uikit';
import noop from 'lodash/noop';
import {Form} from 'react-final-form';

import {SchemaRenderer, SchemaRendererMode, config, errorMessages} from '../../src';
import type {FieldValue, JsonSchema, SchemaRendererProps} from '../../src';

interface SchemaFormProps {
    schema: JsonSchema;
    value?: FieldValue;
    mode?: SchemaRendererMode;
    size?: SchemaRendererProps['size'];
    view?: SchemaRendererProps['view'];
    userContext?: SchemaRendererProps['userContext'];
    showSubmit?: boolean;
    width?: number;
}

// Mount the public SchemaRenderer API directly, without the deprecated Spec bridge.
export const SchemaForm = ({
    schema,
    value,
    mode = SchemaRendererMode.Form,
    size = 'm',
    view = 'stretch',
    userContext,
    showSubmit = false,
    width = 600,
}: SchemaFormProps) => (
    <div style={{width}}>
        <Form initialValues={{input: value}} onSubmit={noop} validateOnBlur={false}>
            {({handleSubmit, values}) => (
                <form onSubmit={handleSubmit}>
                    <SchemaRenderer
                        name="input"
                        schema={schema}
                        config={config}
                        errorMessages={errorMessages}
                        mode={mode}
                        size={size}
                        view={view}
                        userContext={userContext}
                        validateOnBlur={false}
                    />
                    {showSubmit && <Button type="submit">Submit</Button>}
                    <output data-qa="form-value" hidden>
                        {JSON.stringify(values.input)}
                    </output>
                </form>
            )}
        </Form>
    </div>
);
