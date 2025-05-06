import React from 'react';

import {Entity} from '../Entity';
import {SchemaRendererContext, type SchemaRendererContextType} from '../SchemaRendererContext';
import {SchemaRendererServiceField} from '../SchemaRendererServiceField';
import type {SchemaRendererMode} from '../constants';
import type {ErrorMessages, JsonSchema, SchemaRendererConfig} from '../types';

export interface SchemaRendererProps {
    config: SchemaRendererConfig;
    errorMessages?: ErrorMessages;
    mode: SchemaRendererMode;
    /**
     * The `name` prop must be a non-empty string.
     *
     * In `final-form` and `react-final-form`, the `name` is used as a key to register
     * the field within the form. If you pass an empty string (`name=""`), the field will
     * not be registered, its value will not be tracked, and validation will not work.
     *
     * This can lead to:
     * - the field being missing from the form `values`;
     * - the `validate` function not being called;
     * - no error or touched state updates;
     * - inconsistent or broken form behavior.
     *
     * Always provide a unique, non-empty string for the field name.
     *
     * @example
     * // Incorrect
     * <SchemaRenderer name="" {...pros} />
     *
     * // Correct
     * <SchemaRenderer name="params" {...pros} />
     */
    name: string;
    schema: JsonSchema;
}

const SchemaRendererComponent: React.FC<SchemaRendererProps> = ({
    config,
    errorMessages,
    mode,
    name: headName,
    schema,
}) => {
    const serviceFieldName = `DYNAMIC_FORMS_SERVICE_FIELD.${headName}`;

    const context: SchemaRendererContextType = React.useMemo(
        () => ({
            config,
            mode,
            headName,
            schema,
            serviceFieldName,
        }),
        [config, mode, headName, schema, serviceFieldName],
    );

    return (
        <SchemaRendererContext.Provider value={context}>
            <SchemaRendererServiceField
                config={config}
                errorMessages={errorMessages}
                headName={headName}
                mainSchema={schema}
                serviceFieldName={serviceFieldName}
            />
            <Entity name={headName} schema={schema} />
        </SchemaRendererContext.Provider>
    );
};

export const SchemaRenderer = React.memo(SchemaRendererComponent);
