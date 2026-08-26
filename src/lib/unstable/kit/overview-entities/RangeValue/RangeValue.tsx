import React from 'react';

import {Text} from '@gravity-ui/uikit';
import isNumber from 'lodash/isNumber';

import type {JsonSchemaObject, NodeEntity} from '../../../core';
import {EmptyEntityValue, EntityContainer, LongValue, type LongValueProps} from '../../components';
import {DASH} from '../../constants';

export interface RangeValueProps extends Omit<LongValueProps, 'qa' | 'value'> {
    propertyKeys?: [string, string];
    separator?: string;
}

export const RangeValue: NodeEntity<JsonSchemaObject, RangeValueProps> = ({input, props}) => {
    const {propertyKeys, separator = DASH, ...restProps} = props;
    const [fromKey, toKey] = propertyKeys || ['from', 'to'];

    const from = input.value?.[fromKey];
    const to = input.value?.[toKey];

    if (!isNumber(from) || !isNumber(to)) {
        return <EmptyEntityValue />;
    }

    return (
        <EntityContainer
            stretch="fit"
            fill="populated"
            direction="row"
            gap={0.5}
            alignItems="center"
        >
            <LongValue {...restProps} value={from} qa={`${input.name}.${fromKey}`} />
            <Text color="secondary">{separator}</Text>
            <LongValue {...restProps} value={to} qa={`${input.name}.${toKey}`} />
        </EntityContainer>
    );
};
