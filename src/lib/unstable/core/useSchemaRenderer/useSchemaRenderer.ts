import React from 'react';

import type {FieldSubscriber, FieldValidator} from 'final-form';
import cloneDeep from 'lodash/cloneDeep';
import {useForm} from 'react-final-form';

import {EMPTY_OBJECT, type SchemaRendererMode} from '../constants';
import type {
    ErrorMessages,
    FieldValue,
    JsonSchema,
    SchemaRendererConfig,
    SyncValidateError,
} from '../types';

import {ENTITY_SERVICE_FIELD} from './constants';
import {useSchemaRendererMutators} from './hooks';
import type {SchemaRendererState} from './types';
import {getValidate} from './utils';

export interface UseSchemaRendererParams {
    config: SchemaRendererConfig;
    connectValidate?: boolean;
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
     */
    name: string;
    schema: JsonSchema;
}

export type UseSchemaRendererReturn = {
    schema: JsonSchema | undefined;
    validate: FieldValidator<FieldValue> | undefined;
};

export const useSchemaRenderer = ({
    config,
    connectValidate = true,
    errorMessages = EMPTY_OBJECT,
    mode,
    name,
    schema: originalSchema,
}: UseSchemaRendererParams) => {
    const form = useForm();
    const {setAsyncValidationCache, setAsyncValidationWaiters, triggerFields} =
        useSchemaRendererMutators();

    const errorsRef = React.useRef<Record<string, SyncValidateError>>({});
    const schemaRef = React.useRef<JsonSchema | undefined>(undefined);
    const [schema, setSchema] = React.useState<JsonSchema | undefined>(undefined);
    const [fieldsToTrigger, setFieldsToTrigger] = React.useState<string[]>([]);

    const setErrors = React.useCallback(
        (errors: Record<string, SyncValidateError>) => {
            const formState = form.getState();
            const fieldsToTrigger: string[] = Object.keys({
                ...errorsRef.current,
                ...errors,
            }).filter((key) => {
                if (errorsRef.current[key] !== errors[key]) {
                    const field = form.getFieldState(key);

                    if (field?.touched || formState.submitFailed) {
                        return true;
                    }
                }

                return false;
            });

            errorsRef.current = errors;

            if (fieldsToTrigger.length) {
                setFieldsToTrigger(fieldsToTrigger);
            }
        },
        [form],
    );

    const validate = React.useMemo(
        () =>
            getValidate({
                config,
                errorMessages,
                name,
                setAsyncValidationCache,
                setAsyncValidationWaiters,
                setErrors,
            }),
        [
            config,
            errorMessages,
            name,
            setAsyncValidationCache,
            setAsyncValidationWaiters,
            setErrors,
        ],
    );

    const returnValue = React.useMemo(() => {
        if (connectValidate) {
            return {schema};
        }

        return {schema, validate};
    }, [connectValidate, schema, validate]);

    React.useEffect(() => {
        const subscriber: FieldSubscriber<any> = (fieldState) => {
            const data = fieldState.data as SchemaRendererState;

            if (data.schema !== schemaRef.current) {
                schemaRef.current = data.schema;
                setSchema(data.schema);
            }
        };
        const data = {originalSchema, schema: cloneDeep(originalSchema)};
        const getValidator = connectValidate ? () => validate : undefined;

        const unsubscribe = form.registerField(
            name,
            subscriber,
            {data: true},
            {data, getValidator},
        );

        return () => unsubscribe();
    }, [connectValidate, form, name, originalSchema, validate]);

    React.useEffect(() => {
        const unsubscribe = form.registerField(
            ENTITY_SERVICE_FIELD,
            () => {},
            {},
            {data: {config, mode, errorsRef}},
        );

        return () => unsubscribe();
    }, [config, form, mode]);

    React.useEffect(() => {
        if (fieldsToTrigger.length) {
            triggerFields?.({fields: fieldsToTrigger});
        }
    }, [fieldsToTrigger, triggerFields]);

    return returnValue;
};
