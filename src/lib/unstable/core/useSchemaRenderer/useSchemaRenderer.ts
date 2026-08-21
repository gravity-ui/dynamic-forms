/* eslint-disable complexity */

import React from 'react';

import type {FieldValidator} from 'final-form';
import cloneDeep from 'lodash/cloneDeep';
import {useForm} from 'react-final-form';

import {SchemaRendererEventType, type SchemaRendererMode} from '../constants';
import type {ErrorMessages, FieldValue, JsonSchema, NodesConfig} from '../types';
import {getServiceFieldName} from '../utils';

import {SCHEMA_RENDERER_SERVICE_FIELD} from './constants';
import type {SchemaRendererState} from './types';
import {getDispatch, getRunValidate, getSubscribe, getValidate} from './utils';

export interface UseSchemaRendererParams {
    config?: NodesConfig;
    connectValidate?: boolean;
    errorMessages?: ErrorMessages;
    mode: SchemaRendererMode;
    name: string;
    schema: JsonSchema;
    validateOnBlur: boolean;
    userContext?: SchemaRendererState['userContext'];
}

export const useSchemaRenderer = ({
    config,
    connectValidate = true,
    errorMessages,
    mode,
    name: headName,
    schema: originalSchema,
    validateOnBlur,
    userContext,
}: UseSchemaRendererParams): FieldValidator<FieldValue> => {
    const form = useForm();

    const stateRef = React.useRef<SchemaRendererState>(null);
    const prevParamsRef = React.useRef<UseSchemaRendererParams>(null);
    const unsubscribeRef = React.useRef<() => void>(null);

    const {subscribe, unsubscribe} = React.useMemo(
        () => getSubscribe(form, headName),
        [form, headName],
    );
    const dispatchEvent = React.useMemo(() => getDispatch(form, headName), [form, headName]);
    const runValidate = React.useMemo(
        () => getRunValidate(form, headName, validateOnBlur),
        [form, headName, validateOnBlur],
    );
    const validate = React.useMemo(() => getValidate(form, headName), [form, headName]);

    React.useMemo(() => {
        unsubscribeRef.current?.();

        const prevParams = prevParamsRef.current;
        const prevState = stateRef.current;

        const configUpdated = config !== prevParams?.config;
        const errorMessagesUpdated = errorMessages !== prevParams?.errorMessages;
        const nameUpdated = headName !== prevParams?.name;
        const modeUpdated = mode !== prevParams?.mode;
        const schemaUpdated = originalSchema !== prevParams?.schema;
        const userContextUpdated = userContext !== prevParams?.userContext;

        const initialState: SchemaRendererState = {
            cache: nameUpdated || schemaUpdated || !prevState?.cache ? {} : prevState.cache,
            config: config || {},
            dispatchEvent,
            errors: nameUpdated || schemaUpdated || !prevState?.errors ? {} : prevState.errors,
            errorMessages: errorMessages || {},
            mode,
            originalSchema,
            patches: nameUpdated || schemaUpdated || !prevState?.patches ? [] : prevState.patches,
            priorityErrors:
                nameUpdated || schemaUpdated || !prevState?.priorityErrors
                    ? {}
                    : prevState.priorityErrors,
            regularErrors:
                nameUpdated || schemaUpdated || !prevState?.regularErrors
                    ? {}
                    : prevState.regularErrors,
            runValidate,
            schema:
                nameUpdated || schemaUpdated ? cloneDeep(originalSchema) : prevState?.schema || {},
            subscribe,
            subscribers: prevState?.subscribers || {byId: {}, byName: new Map(), byPath: new Map()},
            unsubscribe,
            userContext: userContextUpdated ? userContext || {} : prevState?.userContext || {},
            waiters: nameUpdated || schemaUpdated || !prevState?.waiters ? {} : prevState.waiters,
        };
        const getValidator = connectValidate ? () => validate : undefined;

        let initialEvents = [
            ...(configUpdated ? [SchemaRendererEventType.Config] : []),
            ...(errorMessagesUpdated ? [SchemaRendererEventType.ErrorMessages] : []),
            ...(nameUpdated ? [SchemaRendererEventType.Name] : []),
            ...(modeUpdated ? [SchemaRendererEventType.Mode] : []),
            ...(schemaUpdated ? [SchemaRendererEventType.Schema] : []),
            ...(userContextUpdated ? [SchemaRendererEventType.UserContext] : []),
        ].map((type) => ({type, all: true}));

        unsubscribeRef.current = form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, headName),
            (f) => {
                const state: SchemaRendererState | undefined = f.data?.state;

                if (state && initialEvents.length) {
                    state.dispatchEvent(initialEvents);

                    initialEvents = [];
                }
            },
            {data: true},
            {data: {state: initialState}, getValidator, validateFields: [headName]},
        );

        prevParamsRef.current = {
            config,
            errorMessages,
            name: headName,
            mode,
            schema: originalSchema,
            userContext,
            validateOnBlur,
        };
        stateRef.current = initialState;
    }, [
        config,
        connectValidate,
        dispatchEvent,
        errorMessages,
        form,
        headName,
        mode,
        originalSchema,
        runValidate,
        subscribe,
        unsubscribe,
        validate,
        validateOnBlur,
        userContext,
    ]);

    React.useEffect(() => {
        return () => {
            unsubscribeRef.current?.();
        };
    }, []);

    return validate;
};
