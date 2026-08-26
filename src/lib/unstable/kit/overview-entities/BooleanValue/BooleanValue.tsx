import React from 'react';

import type {TextProps} from '@gravity-ui/uikit';
import isBoolean from 'lodash/isBoolean';

import type {JsonSchemaBoolean, NodeEntity} from '../../../core';
import {EmptyEntityValue, EntityContainer, LongValue, type LongValueProps} from '../../components';

export interface BooleanValueProps extends Omit<LongValueProps, 'qa' | 'value'> {
    valueDescriptions?: {
        true?: string;
        false?: string;
    };
    viewColor?: {
        true?: TextProps['color'];
        false?: TextProps['color'];
    };
}

export const BooleanValue: NodeEntity<JsonSchemaBoolean, BooleanValueProps> = ({input, props}) => {
    const {valueDescriptions, viewColor, ...entityRestProps} = props;

    if (!isBoolean(input.value)) {
        return <EmptyEntityValue />;
    }

    const stringValue = String(input.value) as 'true' | 'false';
    let value: string = stringValue;
    let color = entityRestProps.color;

    if (valueDescriptions?.[stringValue]) {
        value = valueDescriptions[stringValue];
    }

    if (viewColor?.[stringValue]) {
        color = viewColor[stringValue];
    }

    return (
        <EntityContainer stretch="fit" fill="populated">
            <LongValue {...entityRestProps} value={value} color={color} qa={input.name} />
        </EntityContainer>
    );
};
