import React from 'react';

import {Plus} from '@gravity-ui/icons';
import {Button, Flex, Icon} from '@gravity-ui/uikit';

import {type JsonSchemaArray, type NodeEntity, SchemaRendererNode} from '../../../core';
import {EntityContainer} from '../../components';

export interface ArrayBaseProps {
    addButtonText?: string;
    addButtonPosition?: string;
    disabled?: boolean;
}

const ArrayBaseComponent: NodeEntity<JsonSchemaArray, ArrayBaseProps> = ({
    headName,
    input,
    props,
    schema,
    schemaPath,
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
                disabled={props.disabled || schema.readOnly}
                qa={`${name}-add-button`}
            >
                <Icon data={Plus} size={14} />
                {props.addButtonText || null}
            </Button>
        );
    }, [
        props.addButtonText,
        props.disabled,
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
            return itemsSchema.map((_item, index) => (
                <SchemaRendererNode
                    headName={headName}
                    name={`${name}[${index}]`}
                    schemaPath={`${schemaPath}/items/${index}`}
                    key={index}
                />
            ));
        }

        return new Array(value?.length)
            .fill(null)
            .map((_, index) => (
                <SchemaRendererNode
                    headName={headName}
                    name={`${name}[${index}]`}
                    schemaPath={`${schemaPath}/items`}
                    key={index}
                />
            ));
    }, [headName, name, schema.items, schemaPath, value?.length]);

    return (
        <EntityContainer stretch="by-child" gap={4}>
            <Flex direction="column">{items}</Flex>
            {addButton}
        </EntityContainer>
    );
};

export const ArrayBase = React.memo(ArrayBaseComponent);
