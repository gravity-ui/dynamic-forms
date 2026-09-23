import React from 'react';

import {Flex, Text} from '@gravity-ui/uikit';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';

import {
    type JsonSchemaObject,
    type NodeEntity,
    SchemaRendererMode,
    SchemaRendererNode,
} from '../../../core';
import {EmptyEntityValue, EntityContainer} from '../../components';
import {block} from '../../utils';

import './ObjectInline.scss';

const b = block('object-inline');

export interface ObjectInlineProps {
    delimiter?: string | Record<string, string>;
    order?: string[];
}

export const ObjectInline: NodeEntity<JsonSchemaObject, ObjectInlineProps> = ({
    headName,
    input,
    mode,
    props,
    schema,
    schemaPath,
    settings,
}) => {
    const {delimiter, order} = props;
    const {name} = input;

    const overviewFlag = mode === SchemaRendererMode.Overview;

    if (overviewFlag && !Object.keys(input.value || {}).length) {
        return <EmptyEntityValue />;
    }

    return (
        <EntityContainer width="by-child" className={b({size: settings?.size})} fill="by-child">
            <Flex
                className={b('items', {overview: overviewFlag})}
                direction="row"
                alignItems="center"
                gap={overviewFlag ? 1 : 2}
            >
                {(order || Object.keys(schema.properties || {})).map(
                    (property: string, index: number, array: string[]) => (
                        <React.Fragment key={property}>
                            <SchemaRendererNode
                                headName={headName}
                                name={`${name ? name + '.' : ''}${property}`}
                                schemaPath={`${schemaPath}/properties/${property}`}
                                key={property}
                            />
                            {isString(delimiter) && index + 1 !== array.length ? (
                                <Text className={b('delimiter')} variant={settings?.textVariant}>
                                    {delimiter}
                                </Text>
                            ) : null}
                            {isObject(delimiter) && delimiter[property] ? (
                                <Text className={b('delimiter')} variant={settings?.textVariant}>
                                    {delimiter[property]}
                                </Text>
                            ) : null}
                        </React.Fragment>
                    ),
                )}
            </Flex>
        </EntityContainer>
    );
};
