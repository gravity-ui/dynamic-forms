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

export const RangeValue: NodeEntity<JsonSchemaObject, RangeValueProps> = ({
    input,
    props,
    settings,
}) => {
    const {propertyKeys, separator = DASH, ...restProps} = props;
    const [fromKey, toKey] = propertyKeys || ['from', 'to'];

    const from = input.value?.[fromKey];
    const to = input.value?.[toKey];

    if (!isNumber(from) || !isNumber(to)) {
        return <EmptyEntityValue settings={settings} />;
    }

    return (
        <EntityContainer width="fit" fill="populated" direction="row" gap={0.5} alignItems="center">
            <LongValue
                variant={settings?.textVariant}
                {...restProps}
                value={from}
                qa={`${input.name}.${fromKey}`}
            />
            <Text variant={settings?.textVariant} color="secondary">
                {separator}
            </Text>
            <LongValue
                variant={settings?.textVariant}
                {...restProps}
                value={to}
                qa={`${input.name}.${toKey}`}
            />
        </EntityContainer>
    );
};
