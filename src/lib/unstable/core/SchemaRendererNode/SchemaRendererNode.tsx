import React from 'react';

import type {FieldState} from 'final-form';
import noop from 'lodash/noop';
import {type FieldInputProps, type FieldMetaState, useForm} from 'react-final-form';

import {SchemaRendererEventType, SchemaRendererMode} from '../constants';
import type {JsonSchema} from '../types';
import {SCHEMA_RENDERER_SERVICE_FIELD} from '../useSchemaRenderer';
import {useSchemaRendererState} from '../useSchemaRendererState';
import {getServiceFieldName} from '../utils';

import type {SchemaRendererNodeState} from './types';
import {getAccumulatedSchema, getRenderKit} from './utils';

export interface SchemaRendererNodeProps {
    headName: string;
    modeOverride?: SchemaRendererMode;
    name: string;
    schemaOverride?: JsonSchema;
    schemaPath: string;
}

const SchemaRendererNodeComponent: React.FC<SchemaRendererNodeProps> = ({
    headName,
    modeOverride,
    name,
    schemaOverride,
    schemaPath,
}) => {
    const form = useForm();

    const firstRenderRef = React.useRef(true);
    const pendingTicksRef = React.useRef({input: 0, meta: 0});
    const fieldRef = React.useRef<FieldState<any>>(null);
    const unsubscribeRef = React.useRef<() => void>(null);
    const [ticks, setTicks] = React.useState({input: 0, meta: 0});

    const srState = useSchemaRendererState({
        headName,
        name,
        schemaPath,
        subscriptions: [
            SchemaRendererEventType.Config,
            SchemaRendererEventType.Error,
            SchemaRendererEventType.Mode,
            SchemaRendererEventType.Name,
            SchemaRendererEventType.Patch,
            SchemaRendererEventType.Settings,
            SchemaRendererEventType.Schema,
        ],
    });

    const schema = React.useMemo(
        () => getAccumulatedSchema(schemaPath, srState?.schema, schemaOverride),
        [schemaOverride, schemaPath, srState?.schema],
    );

    const error = srState?.errors[name];
    const mode: SchemaRendererMode | undefined = modeOverride || srState?.mode;
    const jsonDefaultValues: boolean = srState?.settings?.jsonDefaultValues || false;

    const kit = React.useMemo(
        () => getRenderKit({config: srState?.config, schema}),
        [schema, srState?.config],
    );

    React.useMemo(() => {
        unsubscribeRef.current?.();

        const initialState: SchemaRendererNodeState = {schemaPath};

        let defaultValue = schema?.default;

        if (jsonDefaultValues && typeof defaultValue === 'string') {
            try {
                defaultValue = JSON.parse(defaultValue);
            } catch {}
        }

        unsubscribeRef.current = form.registerField(
            name,
            (f) => {
                const prevF = fieldRef.current;

                if (prevF) {
                    let inputTick = 0;
                    let metaTick = 0;

                    if (f.value !== prevF.value) {
                        inputTick = 1;
                    }

                    if (
                        prevF.submitFailed !== f.submitFailed ||
                        prevF.touched !== f.touched ||
                        prevF.validating !== f.validating
                    ) {
                        metaTick = 1;
                    }

                    if (inputTick + metaTick) {
                        if (firstRenderRef.current) {
                            pendingTicksRef.current = {input: inputTick, meta: metaTick};
                        } else {
                            setTicks((t) => ({
                                input: t.input + inputTick,
                                meta: t.meta + metaTick,
                            }));
                        }
                    }
                }

                fieldRef.current = f;
            },
            {submitFailed: true, touched: true, validating: true, value: true},
            {
                data: {state: initialState},
                defaultValue,
                validateFields: [getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, headName)],
            },
        );
    }, [form, jsonDefaultValues, headName, name, schema?.default, schema?.type, schemaPath]);

    const input: FieldInputProps<any> = React.useMemo(() => {
        const fieldState = form.getFieldState(name);

        return {
            name,
            onBlur: fieldState?.blur || noop,
            onChange: fieldState?.change || noop,
            onFocus: fieldState?.focus || noop,
            value: fieldState?.value ?? undefined,
        };
    }, [name, form, ticks.input]);

    const meta: FieldMetaState<any> = React.useMemo(() => {
        const fieldState = form.getFieldState(name);

        return {
            data: fieldState?.data,
            error,
            initial: fieldState?.initial,
            submitFailed: fieldState?.submitFailed,
            touched: fieldState?.touched,
            validating: fieldState?.validating,
        };
    }, [error, form, name, ticks.meta]);

    React.useEffect(() => {
        firstRenderRef.current = false;

        if (pendingTicksRef.current.input || pendingTicksRef.current.meta) {
            setTicks((t) => ({
                input: t.input + pendingTicksRef.current.input,
                meta: t.meta + pendingTicksRef.current.meta,
            }));
        }

        return () => {
            unsubscribeRef.current?.();
        };
    }, []);

    let content = null;

    if (
        (mode === SchemaRendererMode.Overview && !schema?.writeOnly) ||
        (mode === SchemaRendererMode.Form && !schema?.readOnly)
    ) {
        const {Entity, Layout, entityProps, independent, layoutProps} = kit[mode];

        if (Entity) {
            content = (
                <Entity
                    Layout={independent ? Layout : undefined}
                    headName={headName}
                    input={input}
                    layoutProps={independent ? layoutProps : undefined}
                    meta={meta}
                    mode={mode}
                    props={entityProps}
                    schema={schema}
                    schemaPath={schemaPath}
                />
            );

            if (Layout && !independent) {
                content = (
                    <Layout
                        headName={headName}
                        input={input}
                        meta={meta}
                        mode={mode}
                        props={layoutProps}
                        schema={schema}
                        schemaPath={schemaPath}
                    >
                        {content}
                    </Layout>
                );
            }
        }
    }

    return content;
};

export const SchemaRendererNode = React.memo(SchemaRendererNodeComponent);
