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
    const {name, onBlur, onChange, onFocus, value} = input;

    const addButton = React.useMemo(() => {
        const itemsSchema = schema.items;

        if (Array.isArray(itemsSchema)) {
            return null;
        }

        const onClick = () => {
            onFocus();
            onChange([...(value || []), itemsSchema?.default]);
            onBlur();
        };

        return (
            <Button
                onClick={onClick}
                disabled={controlProps.disabled || schema.readOnly}
                qa={`${name}-add-button`}
            >
                <Icon data={Plus} size={14} />
                {controlProps.addButtonText || null}
            </Button>
        );
    }, [
        controlProps.addButtonText,
        controlProps.disabled,
        name,
        onBlur,
        onChange,
        onFocus,
        schema.items,
        schema.readOnly,
        value,
    ]);

    const items = React.useMemo(() => {
        const itemsSchema = schema.items;

        if (Array.isArray(itemsSchema)) {
            return itemsSchema.map((item, index) => (
                <Entity name={`${name}[${index}]`} schema={item} key={index} />
            ));
        }

        return new Array(value?.length)
            .fill(null)
            .map((_, index) => (
                <Entity name={`${name}[${index}]`} schema={itemsSchema} key={index} />
            ));
    }, [name, schema.items, value?.length]);

    return (
        <Flex width="100%" direction="column">
            <Flex direction="column" gap={4}>
                <Flex direction="column">{items}</Flex>
                {addButton}
            </Flex>
            <ControlError errorMessage={meta.error} validationState={getValidationState(meta)} />
        </Flex>
    );
};

export const ArrayBase = React.memo(Component);
