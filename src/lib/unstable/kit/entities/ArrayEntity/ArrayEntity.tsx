import React from 'react';

import {Plus} from '@gravity-ui/icons';
import {Button, Flex, Icon} from '@gravity-ui/uikit';

import {
    type JsonSchemaArray,
    type NodeEntity,
    SchemaRendererMode,
    SchemaRendererNode,
} from '../../../core';
import {EmptyEntityValue, EntityContainer} from '../../components';

export interface ArrayEntityProps {
    addButtonText?: string;
    addButtonPosition?: string;
    disabled?: boolean;
}

export const ArrayEntity: NodeEntity<JsonSchemaArray, ArrayEntityProps> = ({
    headName,
    input,
    mode,
    props,
    schema,
    schemaPath,
}) => {
    const {name, onBlur, onChange, onFocus, value} = input;

    const overviewFlag = mode === SchemaRendererMode.Overview;

    const addButton = React.useMemo(() => {
        const itemsSchema = schema.items;

        if (Array.isArray(itemsSchema) || overviewFlag) {
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
        overviewFlag,
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

        return new Array(value?.length ?? 0)
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

    if (overviewFlag && !value?.length) {
        return <EmptyEntityValue />;
    }

    return (
        <EntityContainer stretch="by-child" gap={4} fill="by-child">
            {items?.length ? <Flex direction="column">{items}</Flex> : null}
            {addButton}
        </EntityContainer>
    );
};
