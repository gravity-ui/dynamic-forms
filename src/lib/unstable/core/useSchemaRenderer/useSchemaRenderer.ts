/* eslint-disable complexity */

import React from 'react';

import type {FieldValidator} from 'final-form';
import cloneDeep from 'lodash/cloneDeep';
import {useForm} from 'react-final-form';

import {SchemaRendererEventType, type SchemaRendererMode} from '../constants';
import type {ErrorMessages, FieldValue, JsonSchema, NodesConfig} from '../types';
import {getServiceFieldName, getStrictModeChecker} from '../utils';

import {SCHEMA_RENDERER_SERVICE_FIELD} from './constants';
import type {SchemaRendererSettings, SchemaRendererState} from './types';
import {getDispatch, getRunValidate, getSubscribe, getValidate} from './utils';

export interface UseSchemaRendererParams {
    coerceInitialValues?: SchemaRendererSettings['coerceInitialValues'];
    config?: NodesConfig;
    connectValidate?: boolean;
    errorMessages?: ErrorMessages;
    jsonDefaultValues?: SchemaRendererSettings['jsonDefaultValues'];
    mode: SchemaRendererMode;
    name: string;
    schema: JsonSchema;
    size?: SchemaRendererSettings['size'];
    validateOnBlur: boolean;
    view?: SchemaRendererSettings['view'];
    userContext?: SchemaRendererState['userContext'];
}

export const useSchemaRenderer = ({
    coerceInitialValues = true,
    config,
    connectValidate = true,
    errorMessages,
    jsonDefaultValues = false,
    mode,
    name: headName,
    schema: originalSchema,
    size = 'm',
    validateOnBlur,
    view = 'stretch',
    userContext,
}: UseSchemaRendererParams): FieldValidator<FieldValue> => {
    const form = useForm();

    const strictCheckerRef = React.useRef(getStrictModeChecker());
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

    const {initialEvents, initialState} = React.useMemo(() => {
        const prevParams = prevParamsRef.current;
        const prevState = stateRef.current;

        const configUpdated = config !== prevParams?.config;
        const errorMessagesUpdated = errorMessages !== prevParams?.errorMessages;
        const nameUpdated = headName !== prevParams?.name;
        const modeUpdated = mode !== prevParams?.mode;
        const schemaUpdated = originalSchema !== prevParams?.schema;
        const userContextUpdated = userContext !== prevParams?.userContext;
        const settingsUpdated =
            coerceInitialValues !== prevParams?.coerceInitialValues ||
            jsonDefaultValues !== prevParams?.jsonDefaultValues ||
            size !== prevParams?.size ||
            view !== prevParams?.view;

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
            settings: {
                coerceInitialValues,
                jsonDefaultValues,
                size,
                headVariant: size === 'xl' ? 'subheader-3' : 'subheader-2',
                titleVariant: size === 'xl' ? 'subheader-2' : 'subheader-1',
                textVariant: size === 'xl' ? 'body-2' : 'body-1',
                view,
            },
            schema:
                nameUpdated || schemaUpdated ? cloneDeep(originalSchema) : prevState?.schema || {},
            submitCount: nameUpdated || schemaUpdated || !prevState ? 0 : prevState.submitCount,
            subscribe,
            subscribers: prevState?.subscribers || {byId: {}, byName: new Map(), byPath: new Map()},
            unsubscribe,
            userContext: userContextUpdated ? userContext || {} : prevState?.userContext || {},
            waiters: nameUpdated || schemaUpdated || !prevState?.waiters ? {} : prevState.waiters,
        };

        const initialEvents = [
            ...(configUpdated ? [SchemaRendererEventType.Config] : []),
            ...(errorMessagesUpdated ? [SchemaRendererEventType.ErrorMessages] : []),
            ...(nameUpdated ? [SchemaRendererEventType.Name] : []),
            ...(modeUpdated ? [SchemaRendererEventType.Mode] : []),
            ...(schemaUpdated ? [SchemaRendererEventType.Schema] : []),
            ...(userContextUpdated ? [SchemaRendererEventType.UserContext] : []),
            ...(settingsUpdated ? [SchemaRendererEventType.Settings] : []),
        ].map((type) => ({type, all: true}));

        prevParamsRef.current = {
            coerceInitialValues,
            config,
            errorMessages,
            jsonDefaultValues,
            name: headName,
            mode,
            schema: originalSchema,
            size,
            userContext,
            validateOnBlur,
            view,
        };
        stateRef.current = initialState;

        return {initialEvents, initialState};
    }, [
        coerceInitialValues,
        config,
        dispatchEvent,
        errorMessages,
        jsonDefaultValues,
        headName,
        mode,
        originalSchema,
        runValidate,
        size,
        subscribe,
        unsubscribe,
        validateOnBlur,
        view,
        userContext,
    ]);

    React.useMemo(() => {
        if (
            !strictCheckerRef.current.checkDiff({
                connectValidate,
                form,
                headName,
                validate,
            })
        ) {
            return;
        }

        const getValidator = connectValidate ? () => validate : undefined;

        unsubscribeRef.current?.();

        unsubscribeRef.current = form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, headName),
            () => {},
            {data: true},
            {
                data: {state: stateRef.current},
                getValidator,
                silent: true,
                validateFields: [headName],
            },
        );
    }, [connectValidate, form, headName, validate]);

    React.useEffect(() => {
        const srField = form.getFieldState(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, headName),
        );

        if (srField?.data) {
            srField.data.state = initialState;

            initialState.dispatchEvent(initialEvents);
        }
    }, [initialEvents, initialState]);

    React.useEffect(() => {
        const originalSubmit = form.submit;

        form.submit = () => {
            const srField = form.getFieldState(
                getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, headName),
            );
            const srState: SchemaRendererState | undefined = srField?.data?.state;

            if (srState) {
                srState.submitCount += 1;
                srState.dispatchEvent([{type: SchemaRendererEventType.Submit, all: true}]);
            }

            return originalSubmit.call(form);
        };

        return () => {
            form.submit = originalSubmit;
        };
    }, [form]);

    React.useEffect(() => {
        const strictChecker = strictCheckerRef.current;

        return () => {
            if (strictChecker.isStrict()) {
                return;
            }

            unsubscribeRef.current?.();
        };
    }, []);

    return validate;
};
