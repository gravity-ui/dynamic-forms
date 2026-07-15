import React from 'react';

import {useField} from 'react-final-form';

import {SchemaRendererMode} from '../constants';
import type {JsonSchema} from '../types';
import {useEntitiesState} from '../useSchemaRenderer';
import {getSchemaBySchemaPath, smartMerge} from '../utils';

import type {EntityState} from './types';
import {getRenderKit} from './utils';

export interface EntityProps {
    modeOverride?: SchemaRendererMode;
    name: string;
    schema?: JsonSchema;
    schemaOverride?: JsonSchema;
}

const EntityComponent: React.FC<EntityProps> = ({
    modeOverride,
    name,
    schema: schemaProps = {},
    schemaOverride,
}) => {
    const {config, error, headName, mode: modeState, rootSchema} = useEntitiesState(name);

    const getAccumulatedSchema = React.useCallback(
        (schema: JsonSchema, root?: JsonSchema, override?: JsonSchema) => {
            let accumulatedSchema = schema;

            if (override) {
                accumulatedSchema = smartMerge(accumulatedSchema, override);
            }

            if (accumulatedSchema.$ref && root) {
                const schemaByRef = getSchemaBySchemaPath(accumulatedSchema.$ref, root);

                if (schemaByRef) {
                    accumulatedSchema = smartMerge(accumulatedSchema, schemaByRef);
                }
            }

            return accumulatedSchema;
        },
        [],
    );

    const options = React.useMemo(() => {
        const data: EntityState = {headName, schema: schemaProps};
        const accumulatedSchema = getAccumulatedSchema(schemaProps, rootSchema, schemaOverride);

        return {
            data,
            defaultValue: accumulatedSchema.default,
            subscription: {
                data: true,
                submitFailed: true,
                touched: true,
                validating: true,
                value: true,
            },
        };
    }, [headName, getAccumulatedSchema, rootSchema, schemaOverride, schemaProps]);

    const field = useField(name, options);

    const meta = React.useMemo(() => ({...field.meta, error}), [field.meta, error]);

    const schema = React.useMemo(
        () => getAccumulatedSchema(field.meta.data?.schema, rootSchema, schemaOverride),
        [field.meta.data?.schema, schemaOverride, getAccumulatedSchema, rootSchema],
    );

    const mode = modeOverride || field.meta.data?.mode || modeState;

    const renderKit = React.useMemo(() => getRenderKit({config, schema}), [config, schema]);

    let content = null;

    if (mode === SchemaRendererMode.Form) {
        const formKit = renderKit[SchemaRendererMode.Form];

        if (formKit.Control) {
            if (formKit.independent) {
                content = (
                    <formKit.Control
                        input={field.input}
                        meta={meta}
                        schema={schema}
                        controlProps={formKit.controlProps}
                        ControlWrapper={formKit.ControlWrapper}
                        controlWrapperProps={formKit.controlWrapperProps}
                    />
                );
            } else {
                content = (
                    <formKit.Control
                        input={field.input}
                        meta={meta}
                        schema={schema}
                        controlProps={formKit.controlProps}
                    />
                );

                if (formKit.ControlWrapper) {
                    content = (
                        <formKit.ControlWrapper
                            input={field.input}
                            meta={meta}
                            schema={schema}
                            controlWrapperProps={formKit.controlWrapperProps}
                        >
                            {content}
                        </formKit.ControlWrapper>
                    );
                }
            }
        }
    }

    if (mode === SchemaRendererMode.Overview) {
        const overviewKit = renderKit[SchemaRendererMode.Overview];

        if (overviewKit.View) {
            if (overviewKit.independent) {
                content = (
                    <overviewKit.View
                        input={field.input}
                        meta={meta}
                        schema={schema}
                        viewProps={overviewKit.viewProps}
                        ViewWrapper={overviewKit.ViewWrapper}
                        viewWrapperProps={overviewKit.viewWrapperProps}
                    />
                );
            } else {
                content = (
                    <overviewKit.View
                        input={field.input}
                        meta={meta}
                        schema={schema}
                        viewProps={overviewKit.viewProps}
                    />
                );

                if (overviewKit.ViewWrapper) {
                    content = (
                        <overviewKit.ViewWrapper
                            input={field.input}
                            meta={meta}
                            schema={schema}
                            viewWrapperProps={overviewKit.viewWrapperProps}
                        >
                            {content}
                        </overviewKit.ViewWrapper>
                    );
                }
            }
        }
    }

    return content;
};

export const Entity = React.memo(EntityComponent);
