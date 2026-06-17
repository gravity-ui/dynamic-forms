import React from 'react';

import {Plus} from '@gravity-ui/icons';
import {Button, Flex, Icon} from '@gravity-ui/uikit';

import {type Control, Entity, type JsonSchemaArray} from '../../../core';
import {ControlError} from '../../components';
import {getValidationState} from '../../utils';

export interface ArrayBaseProps {
    addButtonText?: string;
    addButtonPosition?: string;
    disabled?: boolean;
}

const Component: Control<JsonSchemaArray, ArrayBaseProps> = ({
    controlProps,
    input,
    meta,
    schema,
}) => {
    const addButton = React.useMemo(() => {
        const itemsSchema = schema.items;

        if (Array.isArray(itemsSchema)) {
            return null;
        }

        const onClick = () => input.onChange([...(input.value || []), itemsSchema?.default]);

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
        input.value,
        schema.default,
        schema.items,
        schema.readOnly,
    ]);

    const items = React.useMemo(() => {
        const itemsSchema = schema.items;

        if (Array.isArray(itemsSchema)) {
            return itemsSchema.map((item, index) => (
                <Entity name={`${input.name}[${index}]`} schema={item} key={index} />
            ));
        }

        return new Array(input.value?.length)
            .fill(null)
            .map((_, index) => (
                <Entity name={`${input.name}[${index}]`} schema={itemsSchema} key={index} />
            ));
    }, [input.name, input.value?.length, schema.items]);

    return (
        <ControlError errorMessage={meta.error} validationState={getValidationState(meta)}>
            <Flex direction="column" gap={2}>
                <Flex direction="column">{items}</Flex>
                {addButton}
            </Flex>
        </ControlError>
    );
};

export const ArrayBase = React.memo(Component);
