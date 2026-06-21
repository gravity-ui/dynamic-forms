import React from 'react';

import {useField} from 'react-final-form';

import {SchemaRendererMode} from '../constants';
import type {JsonSchema} from '../types';
import {useEntitiesState} from '../useSchemaRenderer';
import {getSchemaBySchemaPath, smartMerge} from '../utils';

import type {EntityState} from './types';
import {getRenderKit} from './utils';

export interface EntityProps {
    name: string;
    schema?: JsonSchema;
}

const EntityComponent: React.FC<EntityProps> = ({name, schema: schemaProps = {}}) => {
    const {config, error, headName, mode, rootSchema} = useEntitiesState(name);

    const options = React.useMemo(() => {
        const data: EntityState = {headName, schema: schemaProps};

        return {
            data,
            defaultValue: schemaProps.default,
            subscription: {
                data: true,
                submitFailed: true,
                touched: true,
                validating: true,
                value: true,
            },
        };
    }, [headName, schemaProps]);

    const field = useField(name, options);

    const schema = React.useMemo(() => {
        let schema = field.meta.data?.schema || schemaProps;

        if (schema.$ref && rootSchema) {
            const schemaByRef = getSchemaBySchemaPath(schema.$ref, rootSchema);

            if (schemaByRef) {
                schema = smartMerge(schema, schemaByRef);
            }
        }

        return schema;
    }, [field.meta.data?.schema, rootSchema, schemaProps]);

    const meta = React.useMemo(() => ({...field.meta, error}), [field.meta, error]);

    const renderKit = React.useMemo(() => getRenderKit({config, schema}), [config, schema]);

    let content = null;

    if (mode === SchemaRendererMode.Form) {
        const formKit = renderKit[SchemaRendererMode.Form];

        if (formKit.Component) {
            if (formKit.independent) {
                content = (
                    <formKit.Component
                        input={field.input}
                        meta={meta}
                        schema={schema}
                        controlProps={formKit.props}
                        Wrapper={formKit.Wrapper}
                        wrapperProps={formKit.wrapperProps}
                    />
                );
            } else {
                content = (
                    <formKit.Component
                        input={field.input}
                        meta={meta}
                        schema={schema}
                        controlProps={formKit.props}
                    />
                );

                if (formKit.Wrapper) {
                    content = (
                        <formKit.Wrapper
                            input={field.input}
                            meta={meta}
                            schema={schema}
                            wrapperProps={formKit.wrapperProps}
                        >
                            {content}
                        </formKit.Wrapper>
                    );
                }
            }
        }
    }

    if (mode === SchemaRendererMode.Overview) {
        const overviewKit = renderKit[SchemaRendererMode.Overview];

        if (overviewKit.Component) {
            if (overviewKit.independent) {
                content = (
                    <overviewKit.Component
                        input={field.input}
                        meta={meta}
                        schema={schema}
                        viewProps={overviewKit.props}
                        Wrapper={overviewKit.Wrapper}
                        wrapperProps={overviewKit.wrapperProps}
                    />
                );
            } else {
                content = (
                    <overviewKit.Component
                        input={field.input}
                        meta={meta}
                        schema={schema}
                        viewProps={overviewKit.props}
                    />
                );

                if (overviewKit.Wrapper) {
                    content = (
                        <overviewKit.Wrapper
                            input={field.input}
                            meta={meta}
                            schema={schema}
                            wrapperProps={overviewKit.wrapperProps}
                        >
                            {content}
                        </overviewKit.Wrapper>
                    );
                }
            }
        }
    }

    return content;
};

export const Entity = React.memo(EntityComponent);
