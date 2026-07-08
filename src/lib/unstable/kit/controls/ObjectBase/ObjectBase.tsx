import React from 'react';

import {type Control, Entity, type JsonSchemaObject} from '../../../core';
import {ControlContainer} from '../../components';

export interface ObjectBaseProps {
    disabled?: boolean;
    order?: string[];
}

const Component: Control<JsonSchemaObject, ObjectBaseProps> = ({
    controlProps,
    input,

    schema,
}) => {
    const {name} = input;

    return (
        <ControlContainer stretch="by-child">
            {(controlProps.order || Object.keys(schema.properties || {})).map(
                (property: string) => (
                    <Entity
                        name={`${name ? name + '.' : ''}${property}`}
                        schema={schema.properties?.[property]}
                        key={property}
                    />
                ),
            )}
        </ControlContainer>
    );
};

export const ObjectBase = React.memo(Component);
