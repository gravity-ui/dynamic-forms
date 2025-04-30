import React from 'react';

import {useField, useForm} from 'react-final-form';

import type {ErrorMessages, JsonSchema, SchemaRendererConfig} from '../types';

import {getValidate} from './utils';

export interface SchemaRendererProps {
    config: SchemaRendererConfig;
    errorMessages?: ErrorMessages;
    headName: string;
    mainSchema: JsonSchema;
    serviceFieldName: string;
}

const SchemaRendererServiceFieldComponent: React.FC<SchemaRendererProps> = ({
    config,
    errorMessages,
    headName,
    mainSchema,
    serviceFieldName,
}) => {
    const {setValidationCache, setValidationWaiters} = useForm().mutators;

    const validate = React.useMemo(
        () =>
            getValidate({
                config,
                errorMessages,
                headName,
                mainSchema,
                serviceFieldName,
                setValidationCache,
                setValidationWaiters,
            }),
        [
            config,
            errorMessages,
            headName,
            mainSchema,
            serviceFieldName,
            setValidationCache,
            setValidationWaiters,
        ],
    );

    useField(serviceFieldName, {data: {schema: mainSchema}, subscription: {}, validate});

    return null;
};

export const SchemaRendererServiceField = React.memo(SchemaRendererServiceFieldComponent);
