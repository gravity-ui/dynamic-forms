import React from 'react';

import {Flex, Text} from '@gravity-ui/uikit';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';

import {type JsonSchemaObject, type NodeEntity, SchemaRendererNode} from '../../../core';
import {EntityContainer} from '../../components';
import {block} from '../../utils';

import './ObjectInline.scss';

const b = block('object-inline');

export interface ObjectInlineProps {
    delimiter?: string | Record<string, string>;
    disabled?: boolean;
    order?: string[];
}

const ObjectInlineComponent: NodeEntity<JsonSchemaObject, ObjectInlineProps> = ({
    headName,
    input,
    props,
    schema,
    schemaPath,
}) => {
    const {delimiter, order} = props;
    const {name} = input;

    return (
        <EntityContainer stretch="max" className={b()}>
            <Flex className={b('items')} direction="row" alignItems="flex-start" gap={2}>
                {(order || Object.keys(schema.properties || {})).map(
                    (property: string, index: number, array: string[]) => (
                        <React.Fragment key={property}>
                            <SchemaRendererNode
                                headName={headName}
                                name={`${name ? name + '.' : ''}${property}`}
                                schemaPath={`${schemaPath}/properties/${property}`}
                            />
                            {isString(delimiter) && index + 1 !== array.length ? (
                                <Text className={b('delimiter')}>{delimiter}</Text>
                            ) : null}
                            {isObject(delimiter) && delimiter[property] ? (
                                <Text className={b('delimiter')}>{delimiter[property]}</Text>
                            ) : null}
                        </React.Fragment>
                    ),
                )}
            </Flex>
        </EntityContainer>
    );
};

export const ObjectInline = React.memo(ObjectInlineComponent);
