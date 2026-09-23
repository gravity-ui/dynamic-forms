import React from 'react';

import isString from 'lodash/isString';

import {
    type JsonSchema,
    type JsonSchemaObject,
    type NodeEntity,
    type ObjectValue,
    SchemaRendererEventType,
    SchemaRendererMode,
    SchemaRendererNode,
    SchemaRendererNodeContext,
    getRenderKit,
    useSchemaRendererState,
} from '../../../core';
import {EntityContainer, LayoutContainer} from '../../components';
import {block} from '../../utils';

import './FewOfNested.scss';

const b = block('few-of-nested');

export interface FewOfNestedProps {
    toggler: JsonSchema;
    withIndent?: boolean;
    order?: string[];
}

export const FewOfNested: NodeEntity<JsonSchemaObject, FewOfNestedProps> = ({
    Layout,
    headName,
    input,
    layoutProps,
    meta,
    mode,
    props,
    schema,
    schemaPath,
    settings,
}) => {
    const {name, value} = input;
    const {toggler: togglerSchema = {}, withIndent = false, order} = props;

    const overviewFlag = mode === SchemaRendererMode.Overview;

    const srState = useSchemaRendererState({
        headName,
        subscriptions: [SchemaRendererEventType.Config],
    });

    const [togglerValues, setTogglerValues] = React.useState<string[]>(() => {
        if (value && Object.keys(value).length) {
            return Object.keys(value);
        }

        if (!overviewFlag) {
            if (order?.[0] !== undefined) {
                return [order[0]];
            }

            if (schema.properties && Object.keys(schema.properties).length) {
                return [Object.keys(schema.properties)[0]];
            }
        }

        return [];
    });

    const toggler = React.useMemo(() => {
        let result: React.ReactNode = null;
        const renderKit = getRenderKit({config: srState?.config, schema: togglerSchema});
        const {Entity, Layout, entityProps, independent, layoutProps} = renderKit[mode];

        const togglerName = `${name}._____toggler`;
        const togglerSchemaPath = '___stub';
        const togglerInput = {
            ...input,
            name: togglerName,
            value: togglerValues,
            onChange: (value: unknown) => {
                if (Array.isArray(value)) {
                    const nextTogglerValues = value.filter(isString);

                    setTogglerValues(nextTogglerValues);
                    input.onChange(
                        nextTogglerValues.reduce(
                            (acc: ObjectValue, togglerValue) => ({
                                ...acc,
                                [togglerValue]: input.value?.[togglerValue],
                            }),
                            {},
                        ),
                    );
                }
            },
        };
        const togglerMeta = {...meta, error: undefined};

        if (Entity) {
            result = (
                <Entity
                    Layout={independent ? Layout : undefined}
                    headName={headName}
                    input={togglerInput}
                    layoutProps={independent ? layoutProps : undefined}
                    meta={togglerMeta}
                    mode={mode}
                    props={entityProps}
                    schema={togglerSchema}
                    schemaPath={togglerSchemaPath}
                />
            );

            if (Layout && !independent) {
                result = (
                    <Layout
                        headName={headName}
                        input={togglerInput}
                        meta={togglerMeta}
                        mode={mode}
                        props={layoutProps}
                        schema={togglerSchema}
                        schemaPath={togglerSchemaPath}
                    >
                        {result}
                    </Layout>
                );
            }
        }

        const nodeContext = {
            headName,
            input: togglerInput,
            meta: togglerMeta,
            mode,
            name: togglerName,
            schema: togglerSchema,
            schemaPath: togglerSchemaPath,
            settings,
        };

        return (
            <SchemaRendererNodeContext.Provider value={nodeContext}>
                {result}
            </SchemaRendererNodeContext.Provider>
        );
    }, [
        headName,
        input,
        meta,
        mode,
        name,
        settings,
        srState?.config,
        togglerSchema,
        togglerValues,
    ]);

    let content = (
        <EntityContainer
            className={b({size: settings?.size})}
            direction="column-reverse"
            width="by-child"
            fill="populated"
        >
            {togglerValues.length ? (
                <LayoutContainer
                    className={b('content', {'with-indent': withIndent})}
                    hideEmpty={overviewFlag}
                >
                    {togglerValues.map((togglerValue) => (
                        <SchemaRendererNode
                            headName={headName}
                            key={togglerValue}
                            name={`${name ? name + '.' : ''}${togglerValue}`}
                            schemaPath={`${schemaPath}/properties/${togglerValue}`}
                        />
                    ))}
                </LayoutContainer>
            ) : null}
            {toggler}
        </EntityContainer>
    );

    if (overviewFlag && togglerValues.length === 0) {
        content = <React.Fragment>{toggler}</React.Fragment>;
    }

    if (Layout) {
        content = (
            <Layout
                headName={headName}
                input={input}
                meta={meta}
                mode={mode}
                props={layoutProps || {}}
                schema={schema}
                schemaPath={schemaPath}
                settings={settings}
            >
                {content}
            </Layout>
        );
    }

    return content;
};
