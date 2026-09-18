import React from 'react';

import {Plus} from '@gravity-ui/icons';
import {Button, Icon, Text} from '@gravity-ui/uikit';

import {
    type JsonSchema,
    type JsonSchemaArray,
    type NodeEntity,
    SchemaRendererMode,
    SchemaRendererNode,
} from '../../../core';
import {
    ArrayRemoveButton,
    EmptyEntityValue,
    EntityContainer,
    HelpMark,
    LayoutContainer,
} from '../../components';
import {block} from '../../utils';

import './ArrayTable.scss';

const b = block('array-table');

export interface ArrayTableProps {
    order?: string[];
    addButtonText?: string;
}

export const ArrayTable: NodeEntity<JsonSchemaArray, ArrayTableProps> = ({
    headName,
    input,
    mode,
    props,
    schema,
    schemaPath,
    settings,
}) => {
    const {name, onBlur, onChange, onFocus, value} = input;
    const {disabled, required} = schema.nodeParameters?.flags || {};

    const overviewFlag = mode === SchemaRendererMode.Overview;

    const initButton = React.useMemo(() => {
        if (required || value !== undefined || overviewFlag) {
            return null;
        }

        const itemsSchema = schema.items;
        const initValue = Array.isArray(itemsSchema)
            ? itemsSchema.map(() => undefined)
            : [undefined];

        const onClick = () => {
            onFocus();
            onChange(initValue);
            onBlur();
        };

        return (
            <Button
                className={b('init-button')}
                onClick={onClick}
                disabled={disabled || schema.readOnly}
                qa={`${name}-init-button`}
                size={settings?.size}
            >
                <Icon data={Plus} size={14} />
                {props.addButtonText || null}
            </Button>
        );
    }, [
        props.addButtonText,
        disabled,
        name,
        onBlur,
        onChange,
        onFocus,
        overviewFlag,
        required,
        schema.items,
        schema.readOnly,
        settings?.size,
        value,
    ]);

    const addButton = React.useMemo(() => {
        const itemsSchema = schema.items;

        if (Array.isArray(itemsSchema) || overviewFlag) {
            return null;
        }

        const onClick = () => {
            onFocus();
            onChange([...(value || []), undefined]);
            onBlur();
        };

        return (
            <Button
                className={b('add-button')}
                onClick={onClick}
                disabled={disabled || schema.readOnly}
                qa={`${name}-add-button`}
                size={settings?.size}
            >
                <Icon data={Plus} size={14} />
                {props.addButtonText || null}
            </Button>
        );
    }, [
        props.addButtonText,
        disabled,
        name,
        onBlur,
        onChange,
        onFocus,
        overviewFlag,
        schema.items,
        schema.readOnly,
        settings?.size,
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
        let rowsCount = value?.length || 0;
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
                    <Text className={b('index')} variant={settings?.titleVariant}>
                        #
                    </Text>
                </div>
                {columns.map((column, cIndex) => (
                    <div className={b('cell', {head: true})} key={cIndex}>
                        <div className={b('column-title')}>
                            {column.schema.title?.split(' ').map((word, wIndex, array) => (
                                <div className={b('column-title-word')} key={word}>
                                    <Text variant={settings?.titleVariant}>{word}</Text>
                                    {wIndex + 1 === array.length && column.schema.description ? (
                                        <HelpMark
                                            settings={settings}
                                            content={column.schema.description}
                                            headName={headName}
                                        />
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );

        const rows = new Array(rowsCount).fill(null).map((_, rIndex) => (
            <React.Fragment key={rIndex}>
                <div className={b('row-divider')} />
                <LayoutContainer>
                    <div
                        className={b('row', {'with-remove-button': withRemoveButton})}
                        style={{'--columns-count': columns.length} as React.CSSProperties}
                    >
                        <div className={b('cell')}>
                            <Text className={b('index')} variant={settings?.textVariant}>
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
                                <ArrayRemoveButton
                                    name={`${name}[${rIndex}]`}
                                    headName={headName}
                                    mode={mode}
                                    size={settings?.size}
                                />
                            </div>
                        ) : null}
                    </div>
                </LayoutContainer>
            </React.Fragment>
        ));

        return {head, rows};
    }, [
        columns,
        headName,
        mode,
        name,
        overviewFlag,
        schema.items,
        schemaPath,
        settings,
        value?.length,
    ]);

    if (overviewFlag && !value?.length) {
        return <EmptyEntityValue />;
    }

    return (
        <EntityContainer
            className={b({size: settings?.size})}
            stretch="by-child"
            gap={4}
            fill="by-child"
            droppable
        >
            {initButton ? (
                initButton
            ) : (
                <React.Fragment>
                    {rows.length ? (
                        <div>
                            {head}
                            {rows}
                        </div>
                    ) : null}
                    {addButton}
                </React.Fragment>
            )}
        </EntityContainer>
    );
};
