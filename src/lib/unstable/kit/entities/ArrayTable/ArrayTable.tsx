import React from 'react';

import {Plus} from '@gravity-ui/icons';
import {Button, HelpMark, Icon, Text} from '@gravity-ui/uikit';

import {
    type JsonSchema,
    type JsonSchemaArray,
    type NodeEntity,
    SchemaRendererMode,
    SchemaRendererNode,
} from '../../../core';
import {ArrayRemoveButton, EmptyEntityValue, EntityContainer, HTMLContent} from '../../components';
import {block} from '../../utils';

import './ArrayTable.scss';

const b = block('array-table');

export interface ArrayTableProps {
    order?: string[];
    addButtonText?: string;
    disabled?: boolean;
}

export const ArrayTable: NodeEntity<JsonSchemaArray, ArrayTableProps> = ({
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
                className={b('add-button')}
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

    const columns = React.useMemo(() => {
        const columns: {name: string | undefined; schema: JsonSchema}[] = [];
        const itemsSchema = schema.items;

        if (itemsSchema) {
            const itemSchema = Array.isArray(itemsSchema) ? itemsSchema[0] : itemsSchema;

            if (
                'properties' in itemSchema &&
                itemSchema.properties &&
                Object.keys(itemSchema.properties).length > 0
            ) {
                const properties = itemSchema.properties;

                (props.order || Object.keys(properties)).forEach((columnKey) => {
                    columns.push({name: columnKey, schema: properties[columnKey] || {}});
                });
            } else {
                columns.push({name: undefined, schema: itemSchema});
            }
        }

        return columns;
    }, [props.order, schema.items]);

    const {head, rows} = React.useMemo(() => {
        let tupleItems = false;
        let rowsCount = value?.length;
        let withRemoveButton = true;

        const getItemName = (index: number, property?: string) =>
            `${name}[${index}]${property === undefined ? '' : `.${property}`}`;
        const getItemSchemaPath = (index: number, property?: string) =>
            `${schemaPath}/items${tupleItems ? `/${index}` : ''}${
                property === undefined ? '' : `/properties/${property}`
            }`;

        if (Array.isArray(schema.items)) {
            tupleItems = true;
            rowsCount = schema.items.length;
            withRemoveButton = false;
        }

        if (overviewFlag) {
            withRemoveButton = false;
        }

        const head = (
            <div
                className={b('row', {'with-remove-button': withRemoveButton, head: true})}
                style={{'--columns-count': columns.length} as React.CSSProperties}
            >
                <div className={b('cell', {head: true})}>
                    <Text className={b('index')} variant="subheader-1">
                        #
                    </Text>
                </div>
                {columns.map((column, cIndex) => (
                    <div className={b('cell', {head: true})} key={cIndex}>
                        <div className={b('column-title')}>
                            {column.schema.title?.split(' ').map((word, wIndex, array) => (
                                <div className={b('column-title-word')} key={word}>
                                    <Text variant="subheader-1">{word}</Text>
                                    {wIndex + 1 === array.length && column.schema.description ? (
                                        <HelpMark>
                                            <HTMLContent html={column.schema.description} />
                                        </HelpMark>
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
                        <SchemaRendererNode
                            headName={headName}
                            name={getItemName(rIndex, column.name)}
                            schemaPath={getItemSchemaPath(rIndex, column.name)}
                        />
                    </div>
                ))}
                {withRemoveButton ? (
                    <div className={b('cell')}>
                        <ArrayRemoveButton name={`${name}[${rIndex}]`} headName={headName} />
                    </div>
                ) : null}
            </div>
        ));

        return {head, rows};
    }, [columns, headName, name, overviewFlag, schema.items, schemaPath, value?.length]);

    if (overviewFlag && !value?.length) {
        return <EmptyEntityValue />;
    }

    return (
        <EntityContainer stretch="by-child" gap={2} fill="by-child">
            <div>
                {head}
                {rows}
            </div>
            {addButton}
        </EntityContainer>
    );
};
