import React from 'react';

import {Plus} from '@gravity-ui/icons';
import {Button, Flex, Icon} from '@gravity-ui/uikit';

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
    const addButton = React.useMemo(() => {
        const onClick = () => input.onChange(schema.default);

        return (
            <Button
                onClick={onClick}
                disabled={controlProps.disabled || schema.readOnly}
                qa={`${input.name}-add-button`}
            >
                <Icon data={Plus} size={14} />
                {controlProps.addButtonText || null}
            </Button>
        );
    }, [
        controlProps.addButtonText,
        controlProps.disabled,
        input.onChange,
        schema.default,
        schema.readOnly,
    ]);

    return (
        <ControlError errorMessage={meta.error} validationState={getValidationState(meta)}>
            <Flex direction="column" gap={2}>
                <Flex direction="column">
                    {(controlProps.order || Object.keys(schema.properties || {})).map(
                        (property: string) => (
                            <Entity
                                name={`${input.name ? input.name + '.' : ''}${property}`}
                                schema={schema.properties?.[property]}
                                key={property}
                            />
                        ),
                    )}
                    {input.value ? null : addButton}
                </Flex>
            </Flex>
        </ControlError>
    );
};

export const ObjectBase = React.memo(Component);
