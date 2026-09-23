import React from 'react';

import {
    type JsonSchema,
    type JsonSchemaObject,
    type NodeEntity,
    NodeType,
    SchemaRendererEventType,
    SchemaRendererMode,
    SchemaRendererNode,
    SchemaRendererNodeContext,
    getRenderKit,
    useSchemaRendererState,
} from '../../../core';
import {EntityContainer, LayoutContainer} from '../../components';
import {block} from '../../utils';

import './OneOfNested.scss';

const b = block('one-of-nested');

export interface OneOfNestedProps {
    toggler: JsonSchema;
    booleanToKey?: {true: string; false: string};
    withIndent?: boolean;
    order?: string[];
}

export const OneOfNested: NodeEntity<JsonSchemaObject, OneOfNestedProps> = ({
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
    const {booleanToKey, toggler: togglerSchema = {}, withIndent = false, order} = props;

    const overviewFlag = mode === SchemaRendererMode.Overview;

    const srState = useSchemaRendererState({
        headName,
        subscriptions: [SchemaRendererEventType.Config],
    });

    const [togglerValue, setTogglerValue] = React.useState<string | undefined>(() => {
        if (value && Object.keys(value).length) {
            return Object.keys(value)[0];
        }

        if (!overviewFlag) {
            if (order?.[0] !== undefined) {
                return order[0];
            }

            if (schema.properties) {
                return Object.keys(schema.properties)[0];
            }
        }

        return undefined;
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
            value:
                togglerSchema.nodeParameters?.type === NodeType.Boolean &&
                booleanToKey &&
                togglerValue !== undefined
                    ? booleanToKey.true === togglerValue
                    : togglerValue,
            onChange: (value: unknown) => {
                const nextValue = `${value}`;
                const nextTogglerValue = booleanToKey?.[nextValue as 'true' | 'false'] || nextValue;

                setTogglerValue(nextTogglerValue);
                input.onChange({[nextTogglerValue]: undefined});
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
        booleanToKey,
        headName,
        input,
        meta,
        mode,
        name,
        settings,
        srState?.config,
        togglerSchema,
        togglerValue,
    ]);

    let content = (
        <EntityContainer
            className={b({size: settings?.size})}
            direction="column-reverse"
            width="by-child"
            fill="populated"
        >
            {togglerValue === undefined ? null : (
                <LayoutContainer
                    className={b('content', {'with-indent': withIndent})}
                    hideEmpty={overviewFlag}
                >
                    <SchemaRendererNode
                        headName={headName}
                        name={`${name ? name + '.' : ''}${togglerValue}`}
                        schemaPath={`${schemaPath}/properties/${togglerValue}`}
                        key={togglerValue}
                    />
                </LayoutContainer>
            )}
            {toggler}
        </EntityContainer>
    );

    if (overviewFlag && Object.values(value || {}).length === 0) {
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
