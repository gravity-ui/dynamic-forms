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
    name: string;
    schema: JsonSchema;
}

const SchemaRendererComponent: React.FC<SchemaRendererProps> = ({
    config,
    errorMessages,
    mode,
    name,
    schema,
}) => {
    const serviceFieldName = `DYNAMIC_FORMS_SERVICE_FIELD/${name}`;

    const context: SchemaRendererContextType = React.useMemo(
        () => ({
            config,
            mode,
            name,
            schema,
            serviceFieldName,
        }),
        [config, mode, name, schema, serviceFieldName],
    );

    return (
        <SchemaRendererContext.Provider value={context}>
            <SchemaRendererServiceField
                config={config}
                errorMessages={errorMessages}
                name={name}
                mainSchema={schema}
                serviceFieldName={serviceFieldName}
            />
            <Entity name={name} schema={schema} />
        </SchemaRendererContext.Provider>
    );
};

export const SchemaRenderer = React.memo(SchemaRendererComponent);
