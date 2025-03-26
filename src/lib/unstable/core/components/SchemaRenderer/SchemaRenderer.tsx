import React from 'react';

import {useForm} from 'react-final-form';

import type {SchemaRendererMode} from '../../constants';
import {EMPTY_OBJECT} from '../../constants';
import type {
    ErrorMessages,
    JsonSchema,
    SchemaRendererConfig,
    SchemaRendererContextType,
} from '../../types';
import {Entity} from '../Entity';

import {SchemaRendererContext} from './context';

export interface SchemaRendererProps {
    config: SchemaRendererConfig;
    errorMessages?: ErrorMessages;
    mode: SchemaRendererMode;
    name: string;
    schema: JsonSchema;
}

const Component: React.FC<SchemaRendererProps> = ({
    config,
    errorMessages = EMPTY_OBJECT,
    mode,
    name,
    schema,
}) => {
    const {setValidationCache, setValidationWaiters} = useForm().mutators;

    const context: SchemaRendererContextType = React.useMemo(
        () => ({
            config,
            errorMessages,
            mode,
            name,
            schema,
            tools: {setValidationCache, setValidationWaiters},
        }),
        [config, errorMessages, mode, name, schema, setValidationCache, setValidationWaiters],
    );

    return (
        <SchemaRendererContext.Provider value={context}>
            <Entity name={name} schema={schema} />
        </SchemaRendererContext.Provider>
    );
};

export const SchemaRenderer = React.memo(Component);
