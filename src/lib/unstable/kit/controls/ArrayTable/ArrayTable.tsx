import React from 'react';

import {Plus} from '@gravity-ui/icons';
import {Button, Flex, HelpMark, Icon, Text} from '@gravity-ui/uikit';

import {type Control, Entity, type JsonSchema, type JsonSchemaArray} from '../../../core';
import {ArrayRemoveButton, ControlError} from '../../components';
import {block, getValidationState} from '../../utils';

import './ArrayTable.scss';

const b = block('array-table');

export interface ArrayTableProps {
    order?: string[];
    addButtonText?: string;
    disabled?: boolean;
}

const Component: Control<JsonSchemaArray, ArrayTableProps> = ({
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

    const columns = React.useMemo(() => {
        const columns: {name: string | undefined; schema: JsonSchema<any>}[] = [];
        const itemsSchema = schema.items;

        if (itemsSchema) {
            const itemSchema = Array.isArray(itemsSchema) ? itemsSchema[0] : itemsSchema;

            if (
                'properties' in itemSchema &&
                itemSchema.properties &&
                Object.keys(itemSchema.properties).length > 0
            ) {
                const properties = itemSchema.properties;

                (controlProps.order || Object.keys(properties)).forEach((columnKey) => {
                    columns.push({name: columnKey, schema: properties[columnKey] || {}});
                });
            } else {
                columns.push({name: undefined, schema: itemSchema});
            }
        }

        return columns;
    }, [controlProps.order, schema.items]);

    const {head, rows} = React.useMemo(() => {
        let rowsCount = value?.length;
        let withRemoveButton = true;

        if (Array.isArray(schema.items)) {
            rowsCount = schema.items.length;
            withRemoveButton = false;
        }

        const head = (
            <div
                className={b('row', {'with-remove-button': withRemoveButton})}
                style={{'--columns-count': columns.length} as React.CSSProperties}
            >
                <div className={b('cell')}>
                    <Text className={b('index')} variant="subheader-1">
                        #
                    </Text>
                </div>
                {columns.map((column, cIndex) => (
                    <div className={b('cell')} key={cIndex}>
                        <div className={b('column-title')}>
                            {column.schema.title?.split(' ').map((word, wIndex, array) => (
                                <div className={b('column-title-word')} key={word}>
                                    <Text variant="subheader-1">{word}</Text>
                                    {wIndex + 1 === array.length && column.schema.description ? (
                                        <HelpMark>{column.schema.description}</HelpMark>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );

        const rows = new Array(rowsCount).fill(null).map((_, rIndex) => (
            <div
                className={b('row', {'with-remove-button': withRemoveButton})}
                style={{'--columns-count': columns.length} as React.CSSProperties}
                key={rIndex}
            >
                <div className={b('cell')}>
                    <Text className={b('index')} variant="subheader-1">
                        {rIndex + 1}
                    </Text>
                </div>
                {columns.map((column, cIndex) => (
                    <div className={b('cell')} key={cIndex}>
                        <Entity
                            name={`${name}[${rIndex}]${
                                column.name === undefined ? '' : `.${column.name}`
                            }`}
                            schema={column.schema}
                        />
                    </div>
                ))}
                {withRemoveButton ? (
                    <div className={b('cell')}>
                        <ArrayRemoveButton name={`${name}[${rIndex}]`} />
                    </div>
                ) : null}
            </div>
        ));

        return {head, rows};
    }, [columns, name, schema.items, value?.length]);

    return (
        <Flex direction="column">
            <Flex direction="column" gap={2}>
                <Flex direction="column" gap={2}>
                    {head}
                    {rows}
                </Flex>
                {addButton}
            </Flex>
            <ControlError errorMessage={meta.error} validationState={getValidationState(meta)} />
        </Flex>
    );
};

export const ArrayTable = React.memo(Component);
