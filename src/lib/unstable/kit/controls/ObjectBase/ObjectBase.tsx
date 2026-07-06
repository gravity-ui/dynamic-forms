import React from 'react';

import {Flex} from '@gravity-ui/uikit';

import {type Control, Entity, type JsonSchemaObject} from '../../../core';
import {ControlError} from '../../components';
import {getValidationState} from '../../utils';

export interface ObjectBaseProps {
    addButtonText?: string;
    disabled?: boolean;
    order?: string[];
}

const Component: Control<JsonSchemaObject, ObjectBaseProps> = ({
    controlProps,
    input,
    meta,
    schema,
}) => {
    const {name} = input;

    return (
        <React.Fragment>
            <Flex direction="column" gap={2}>
                <Flex direction="column">
                    {(controlProps.order || Object.keys(schema.properties || {})).map(
                        (property: string) => (
                            <Entity
                                name={`${name ? name + '.' : ''}${property}`}
                                schema={schema.properties?.[property]}
                                key={property}
                            />
                        ),
                    )}
                </Flex>
            </Flex>
            <ControlError errorMessage={meta.error} validationState={getValidationState(meta)} />
        </React.Fragment>
    );
};

export const ObjectBase = React.memo(Component);
