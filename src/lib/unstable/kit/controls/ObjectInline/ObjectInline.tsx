import React from 'react';

import {Flex, Text} from '@gravity-ui/uikit';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';

import {type Control, Entity, type JsonSchemaObject} from '../../../core';
import {ControlContainer} from '../../components';
import {block} from '../../utils';

import './ObjectInline.scss';

const b = block('object-inline');

export interface ObjectInlineProps {
    delimiter?: string | Record<string, string>;
    disabled?: boolean;
    order?: string[];
}

const Component: Control<JsonSchemaObject, ObjectInlineProps> = ({controlProps, input, schema}) => {
    const {delimiter, order} = controlProps;
    const {name} = input;

    return (
        <ControlContainer stretch="max" className={b()}>
            <Flex className={b('items')} direction="row" alignItems="flex-start" gap={2}>
                {(order || Object.keys(schema.properties || {})).map(
                    (property: string, index: number, array: string[]) => (
                        <React.Fragment key={property}>
                            <Entity
                                name={`${name ? name + '.' : ''}${property}`}
                                schema={schema.properties?.[property]}
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
        </ControlContainer>
    );
};

export const ObjectInline = React.memo(Component);
