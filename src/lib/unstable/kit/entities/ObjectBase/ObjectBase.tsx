import React from 'react';

import {type JsonSchemaObject, type NodeEntity, SchemaRendererNode} from '../../../core';
import {EntityContainer} from '../../components';

export interface ObjectBaseProps {
    disabled?: boolean;
    order?: string[];
}

const ObjectBaseComponent: NodeEntity<JsonSchemaObject, ObjectBaseProps> = ({
    headName,
    input,
    props,
    schema,
    schemaPath,
}) => {
    const {name} = input;

    return (
        <EntityContainer stretch="by-child">
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
};

export const ObjectBase = React.memo(ObjectBaseComponent);
