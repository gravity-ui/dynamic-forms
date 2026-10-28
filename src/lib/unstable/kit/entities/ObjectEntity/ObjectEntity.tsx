import React from 'react';

import {type JsonSchemaObject, type NodeEntity, NodeType, SchemaRendererNode} from '../../../core';
import {EntityContainer} from '../../components';

export interface ObjectEntityProps {
    groups?: {
        order: {name: string; schemaPath: string}[];
        title: string;
        description?: string;
        layout: string;
    }[];
    order?: (string | {name: string; schemaPath: string})[];
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
    const {groups, order} = props;
    const {name} = input;

    const content = React.useMemo(() => {
        if (!Object.keys(schema.properties || {}).length) {
            return null;
        }

        return (
            <React.Fragment>
                {(order || Object.keys(schema.properties || {})).map((item) => {
                    let itemName;
                    let itemSchemaPath;

                    if (typeof item === 'string') {
                        itemName = `${name ? name + '.' : ''}${item}`;
                        itemSchemaPath = `${schemaPath}/properties/${item}`;
                    } else {
                        itemName = `${name ? name + '.' : ''}${item.name}`;
                        itemSchemaPath = `${schemaPath}/${item.schemaPath}`;
                    }

                    return (
                        <SchemaRendererNode
                            headName={headName}
                            name={itemName}
                            schemaPath={itemSchemaPath}
                            key={itemName}
                        />
                    );
                })}
            </React.Fragment>
        );
    }, [headName, name, schema.properties, schemaPath, order]);

    const groupContent = React.useMemo(() => {
        if (!groups?.length) {
            return null;
        }

        return (
            <React.Fragment>
                {groups.map((group, index) => {
                    const groupName = `___group${index}___`;
                    const groupSchema: JsonSchemaObject = {
                        title: group.title,
                        description: group.description,
                        nodeParameters: {
                            type: NodeType.Object,
                            entity: () => (
                                <React.Fragment>
                                    {group.order.map((item) => (
                                        <SchemaRendererNode
                                            headName={headName}
                                            name={`${name ? name + '.' : ''}${item.name}`}
                                            schemaPath={`${schemaPath}/${item.schemaPath}`}
                                            key={item.name}
                                        />
                                    ))}
                                </React.Fragment>
                            ),
                            layout: group.layout,
                        },
                    };

                    return (
                        <SchemaRendererNode
                            headName={headName}
                            name={`${name ? name + '.' : ''}.${groupName}`}
                            schemaPath={`${schemaPath}/${groupName}`}
                            schemaOverride={groupSchema}
                            withoutRegister
                            key={groupName}
                        />
                    );
                })}
            </React.Fragment>
        );
    }, [headName, name, schemaPath, groups]);

    if (!content && !groupContent) {
        return null;
    }

    let result = (
        <EntityContainer width="by-child" fill="by-child" droppable>
            {groupContent || content}
        </EntityContainer>
    );

    if (Layout) {
        result = (
            <Layout
                headName={headName}
                input={input}
                meta={meta}
                mode={mode}
                props={layoutProps || {}}
                schema={schema}
                schemaPath={schemaPath}
                settings={settings}
            >
                {result}
            </Layout>
        );
    }

    return result;
};
