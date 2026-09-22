import React from 'react';

import {Plus} from '@gravity-ui/icons';
import {Button, Icon} from '@gravity-ui/uikit';

import {
    type JsonSchemaObject,
    type NodeEntity,
    SchemaRendererMode,
    SchemaRendererNode,
} from '../../../core';
import {EntityContainer} from '../../components';
import {block} from '../../utils';

import './ObjectEntity.scss';

const b = block('object-entity');

export interface ObjectEntityProps {
    order?: string[];
}

export const ObjectEntity: NodeEntity<JsonSchemaObject, ObjectEntityProps> = ({
    Layout,
    headName,
    input,
    layoutProps,
    meta,
    mode,
    props,
    schema,
    schemaPath,
    settings,
}) => {
    const {onFocus, onChange, onBlur, value} = input;
    const {disabled, required} = schema.nodeParameters?.flags || {};
    const overviewFlag = mode === SchemaRendererMode.Overview;
    const {name} = input;

    const initButton = React.useMemo(() => {
        if (required || value !== undefined || overviewFlag) {
            return null;
        }

        const onClick = () => {
            onFocus();
            onChange({});
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
                {schema.title || null}
            </Button>
        );
    }, [
        disabled,
        name,
        onBlur,
        onChange,
        onFocus,
        overviewFlag,
        required,
        schema.title,
        schema.readOnly,
        settings?.size,
        value,
    ]);

    if (!Object.keys(schema.properties || {}).length) {
        return null;
    }

    let content = (
        <EntityContainer width="by-child" fill="by-child" droppable>
            {initButton ? (
                initButton
            ) : (
                <React.Fragment>
                    {(props.order || Object.keys(schema.properties || {})).map(
                        (property: string) => (
                            <SchemaRendererNode
                                headName={headName}
                                name={`${name ? name + '.' : ''}${property}`}
                                schemaPath={`${schemaPath}/properties/${property}`}
                                key={property}
                            />
                        ),
                    )}
                </React.Fragment>
            )}
        </EntityContainer>
    );

    if (Layout) {
        content = (
            <Layout
                headName={headName}
                input={input}
                meta={meta}
                mode={mode}
                schema={schema}
                schemaPath={schemaPath}
                settings={settings}
                props={layoutProps || {}}
            >
                {content}
            </Layout>
        );
    }

    return content;
};
