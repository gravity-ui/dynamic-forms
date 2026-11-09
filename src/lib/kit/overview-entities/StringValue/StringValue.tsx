import React from 'react';

import type {JsonSchemaString, NodeEntity} from '../../../core';
import {EmptyEntityValue, EntityContainer, LongValue, type LongValueProps} from '../../components';

export interface StringValueProps extends Omit<LongValueProps, 'qa' | 'value'> {}

export const StringValue: NodeEntity<JsonSchemaString, StringValueProps> = ({
    input,
    props,
    settings,
}) => {
    if (!input.value) {
        return <EmptyEntityValue />;
    }

    return (
        <EntityContainer width="fit" fill="populated">
            <LongValue
                variant={settings?.textVariant}
                {...props}
                value={input.value}
                qa={input.name}
            />
        </EntityContainer>
    );
};
