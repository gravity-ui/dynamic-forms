import React from 'react';

import {
    type JsonSchemaObject,
    type NodeEntity,
    SchemaRendererMode,
    SchemaRendererNode,
} from '../../../core';
import {EmptyEntityValue, EntityContainer} from '../../components';

export interface ObjectBaseProps {
    disabled?: boolean;
    order?: string[];
}

const ObjectBaseComponent: NodeEntity<JsonSchemaObject, ObjectBaseProps> = ({
    headName,
    mode,
    input,
    props,
    schema,
    schemaPath,
}) => {
    const {name} = input;

    const overviewFlag = mode === SchemaRendererMode.Overview;

    if (overviewFlag && !Object.keys(schema.properties || {}).length) {
        return <EmptyEntityValue />;
    }

    return (
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
};

export const ObjectBase = React.memo(ObjectBaseComponent);
