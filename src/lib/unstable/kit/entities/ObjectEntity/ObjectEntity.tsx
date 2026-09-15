import React from 'react';

import {type JsonSchemaObject, type NodeEntity, SchemaRendererNode} from '../../../core';
import {EntityContainer} from '../../components';

export interface ObjectEntityProps {
    order?: string[];
}

export const ObjectEntity: NodeEntity<JsonSchemaObject, ObjectEntityProps> = ({
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
    const {name} = input;

    if (!Object.keys(schema.properties || {}).length) {
        return null;
    }

    let content = (
        <EntityContainer stretch="by-child" fill="by-child">
            {(props.order || Object.keys(schema.properties || {})).map((property: string) => (
                <SchemaRendererNode
                    headName={headName}
                    name={`${name ? name + '.' : ''}${property}`}
                    schemaPath={`${schemaPath}/properties/${property}`}
                    key={property}
                />
            ))}
        </EntityContainer>
    );

    if (Layout) {
        content = (
            <Layout
                headName={headName}
                input={input}
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
