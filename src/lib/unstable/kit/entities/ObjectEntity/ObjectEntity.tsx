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
    settings,
}) => {
    const {order} = props;
    const {name} = input;

    if (!Object.keys(schema.properties || {}).length) {
        return null;
    }

    let content = (
        <EntityContainer width="by-child" fill="by-child" droppable>
            {(order || Object.keys(schema.properties || {})).map((property: string) => (
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
