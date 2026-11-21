import React from 'react';

import isNumber from 'lodash/isNumber';

import type {JsonSchemaNumber, NodeEntity} from '../../../core';
import {EmptyEntityValue, EntityContainer, LongValue, type LongValueProps} from '../../components';
import {getQaBase} from '../../utils/qa';

export interface NumberValueProps extends Omit<LongValueProps, 'qa' | 'value'> {}

export const NumberValue: NodeEntity<JsonSchemaNumber, NumberValueProps> = ({
    input,
    schema,
    props,
    settings,
}) => {
    const qaBase = getQaBase(input.name, schema);
    if (!isNumber(input.value)) {
        return <EmptyEntityValue />;
    }

    return (
        <EntityContainer width="fit" fill="populated">
            <LongValue variant={settings?.textVariant} {...props} value={input.value} qa={qaBase} />
        </EntityContainer>
    );
};
