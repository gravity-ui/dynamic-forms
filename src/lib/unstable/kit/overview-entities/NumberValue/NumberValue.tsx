import React from 'react';

import isNumber from 'lodash/isNumber';

import type {JsonSchemaNumber, NodeEntity} from '../../../core';
import {EmptyEntityValue, EntityContainer, LongValue, type LongValueProps} from '../../components';

export interface NumberValueProps extends Omit<LongValueProps, 'qa' | 'value'> {}

export const NumberValue: NodeEntity<JsonSchemaNumber, NumberValueProps> = ({input, props}) => {
    if (!isNumber(input.value)) {
        return <EmptyEntityValue />;
    }

    return (
        <EntityContainer stretch="fit" fill="populated">
            <LongValue {...props} value={input.value} qa={input.name} />
        </EntityContainer>
    );
};
