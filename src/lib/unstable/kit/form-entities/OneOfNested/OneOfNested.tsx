import React from 'react';

import {
    type JsonSchema,
    type JsonSchemaObject,
    type NodeEntity,
    NodeType,
    SchemaNode,
    SchemaRendererEventType,
    SchemaRendererMode,
    getRenderKit,
    useSchemaRendererState,
} from '../../../core';
import {EntityContainer} from '../../components';
import {block} from '../../utils';

import './OneOfNested.scss';

const b = block('one-of-nested');

export interface OneOfNestedProps {
    toggler: JsonSchema;
    booleanToKey?: {true: string; false: string};
    withIndent?: boolean;
    togglerArrayRemoveButton?: boolean;
}

const OneOfNestedComponent: NodeEntity<JsonSchemaObject, OneOfNestedProps> = ({
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
        booleanToKey,
        togglerArrayRemoveButton = false,
        toggler: togglerSchema = {},
        withIndent = false,
    } = props;

    const srState = useSchemaRendererState({
        headName,
        subscriptions: [SchemaRendererEventType.Config],
    });

    const [togglerValue, setTogglerValue] = React.useState<string>(
        Object.keys(value || schema.properties || {})[0] || '',
    );

    const toggler = React.useMemo(() => {
        let result: React.ReactNode = null;
        const renderKit = getRenderKit({config: srState?.config, schema: togglerSchema});
        const {Entity, Layout, entityProps, independent, layoutProps} =
            renderKit[SchemaRendererMode.Form];
        const togglerInput = {
            ...input,
            name: togglerArrayRemoveButton ? name : `${name}._____toggler`,
            value:
                (togglerSchema.nodeParameters?.type === NodeType.Boolean &&
                    booleanToKey &&
                    booleanToKey.true === togglerValue) ??
                togglerValue,
            onChange: (value: unknown) => {
                const nextValue = `${value}`;

                setTogglerValue(booleanToKey?.[nextValue as 'true' | 'false'] || nextValue);
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
        booleanToKey,
        headName,
        input,
        meta,
        mode,
        name,
        srState?.config,
        togglerArrayRemoveButton,
        togglerSchema,
        togglerValue,
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
        <EntityContainer stretch="by-child">
            {toggler}
            <div className={b('content', {'with-indent': withIndent})}>
                <SchemaNode
                    headName={headName}
                    name={`${name}.${togglerValue}`}
                    schemaPath={`${schemaPath}/properties/${togglerValue}`}
                />
            </div>
        </EntityContainer>
    );

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

export const OneOfNested = React.memo(OneOfNestedComponent);
