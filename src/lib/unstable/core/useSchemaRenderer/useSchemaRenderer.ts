import React from 'react';

import type {FieldValidator} from 'final-form';
import cloneDeep from 'lodash/cloneDeep';
import noop from 'lodash/noop';
import {useForm} from 'react-final-form';

import {EMPTY_OBJECT, type SchemaRendererMode} from '../constants';
import type {
    ErrorMessages,
    FieldValue,
    JsonSchema,
    SchemaRendererConfig,
    SyncValidateError,
} from '../types';

import {ENTITY_SERVICE_FIELD, USER_CONTEXT_SERVICE_FIELD} from './constants';
import {useSchemaRendererMutators} from './hooks';
import type {UserContextState} from './mutators';
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
    userContext?: Omit<UserContextState, 'headName'>;
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
    userContext,
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

        return {
            schema,
            validate: (value?: FieldValue) => {
                const allValues = form.getState().values;
                const meta = form.getFieldState(name);

                return validate(value, allValues, meta);
            },
        };
    }, [connectValidate, form, name, schema, validate]);

    React.useLayoutEffect(() => {
        schemaRef.current = cloneDeep(originalSchema);

        setSchema(schemaRef.current);
    }, [originalSchema]);

    React.useLayoutEffect(() => {
        const data = {originalSchema, schema: schemaRef.current};
        const getValidator = connectValidate ? () => validate : undefined;

        const unsubscribe = form.registerField(name, noop, EMPTY_OBJECT, {data, getValidator});

        return () => unsubscribe();
    }, [connectValidate, form, name, originalSchema, validate]);

    React.useLayoutEffect(() => {
        const data = {config, errorsRef, headName: name, mode, schema: schemaRef.current};
        const unsubscribe = form.registerField(
            `${ENTITY_SERVICE_FIELD}.${name}`,
            noop,
            EMPTY_OBJECT,
            {data},
        );

        return () => unsubscribe();
    }, [config, form, mode, name]);

    React.useLayoutEffect(() => {
        const data = {...userContext, headName: name};
        const unsubscribe = form.registerField(
            `${USER_CONTEXT_SERVICE_FIELD}.${name}`,
            noop,
            EMPTY_OBJECT,
            {data},
        );

        return () => unsubscribe();
    }, [form, name, userContext]);

    React.useLayoutEffect(() => {
        if (fieldsToTrigger.length) {
            triggerFields?.({fields: fieldsToTrigger});
        }
    }, [fieldsToTrigger, triggerFields]);

    return returnValue;
};
