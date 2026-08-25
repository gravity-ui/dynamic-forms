import React from 'react';

import type {JsonSchemaString, NodeEntity} from '../../../core';
import {EmptyEntityValue, EntityContainer, LongValue, type LongValueProps} from '../../components';

export interface OverviewStringBaseProps extends Omit<LongValueProps, 'qa' | 'value'> {}

const OverviewStringBaseComponent: NodeEntity<JsonSchemaString, OverviewStringBaseProps> = ({
    input,
    props,
}) => {
    if (!input.value) {
        return <EmptyEntityValue />;
    }

    return (
        <EntityContainer stretch="fit" fill="populated">
            <LongValue {...props} value={input.value} qa={input.name} />
        </EntityContainer>
    );
};

export const OverviewStringBase = React.memo(OverviewStringBaseComponent);
