import React from 'react';

import isString from 'lodash/isString';

import {
    type JsonSchema,
    type JsonSchemaObject,
    type NodeEntity,
    SchemaRendererEventType,
    SchemaRendererMode,
    SchemaRendererNode,
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
    togglerArrayRemoveButton?: boolean;
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
}) => {
    const {name, value} = input;
    const {
        togglerArrayRemoveButton = false,
        toggler: togglerSchema = {},
        withIndent = false,
    } = props;

    const overviewFlag = mode === SchemaRendererMode.Overview;

    const srState = useSchemaRendererState({
        headName,
        subscriptions: [SchemaRendererEventType.Config],
    });

    const [togglerValues, setTogglerValues] = React.useState<string[]>(() => {
        if (value && Object.keys(value).length) {
            return Object.keys(value);
        }

        if (schema.properties && Object.keys(schema.properties).length) {
            return [Object.keys(schema.properties)[0]];
        }

        return [];
    });

    const toggler = React.useMemo(() => {
        let result: React.ReactNode = null;
        const renderKit = getRenderKit({config: srState?.config, schema: togglerSchema});
        const {Entity, Layout, entityProps, independent, layoutProps} = renderKit[mode];
        const togglerInput = {
            ...input,
            name: togglerArrayRemoveButton ? name : `${name}._____toggler`,
            value: togglerValues,
            onChange: (value: unknown) => {
                if (Array.isArray(value)) {
                    setTogglerValues(value.filter(isString));
                }
            },
        };
        const togglerMeta = {
            ...meta,
            error: undefined,
        };

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
                    schemaPath="___stub"
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
                        schemaPath="___stub"
                    >
                        {result}
                    </Layout>
                );
            }
        }

        return result;
    }, [
        headName,
        input,
        meta,
        mode,
        name,
        srState?.config,
        togglerArrayRemoveButton,
        togglerSchema,
        togglerValues,
    ]);

    const wrapperInput = React.useMemo(() => {
        if (!togglerArrayRemoveButton) {
            return input;
        }

        return {
            ...input,
            name: `${name}._____wrapper`,
        };
    }, [name, input, togglerArrayRemoveButton]);

    let content = (
        <EntityContainer direction="column-reverse" stretch="by-child" fill="populated">
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
                input={wrapperInput}
                meta={meta}
                mode={mode}
                schema={schema}
                schemaPath={schemaPath}
                props={layoutProps || {}}
            >
                {content}
            </Layout>
        );
    }

    return content;
};
