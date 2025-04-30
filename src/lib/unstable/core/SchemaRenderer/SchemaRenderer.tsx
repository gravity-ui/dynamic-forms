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
