import React from 'react';

import type {JsonSchemaArray, NodeEntity} from '../../../core';
import {EmptyEntityValue, EntityContainer, LongValue, type LongValueProps} from '../../components';

export interface PrimitiveArrayValueProps extends Omit<LongValueProps, 'qa' | 'value'> {
    direction?: 'column' | 'row';
    enumDescriptions?: Record<string, string>;
}

export const PrimitiveArrayValue: NodeEntity<JsonSchemaArray, PrimitiveArrayValueProps> = ({
    input,
    props,
}) => {
    const {direction = 'row', enumDescriptions, ...restProps} = props;

    const values = React.useMemo(() => {
        if (!Array.isArray(input.value)) {
            return [];
        }

        return input.value.map((item) => {
            const stringValue = String(item);

            return enumDescriptions?.[stringValue] || stringValue;
        });
    }, [enumDescriptions, input.value]);

    if (!values.length) {
        return <EmptyEntityValue />;
    }

    if (direction === 'column') {
        return (
            <EntityContainer stretch="fit" fill="populated" gap={0.5}>
                {values.map((item, index) => (
                    <LongValue
                        {...restProps}
                        key={`${item}-${index}`}
                        value={item}
                        qa={`${input.name}[${index}]`}
                    />
                ))}
            </EntityContainer>
        );
    }

    return (
        <EntityContainer stretch="fit" fill="populated">
            <LongValue {...restProps} value={values.join(', ')} qa={input.name} />
        </EntityContainer>
    );
};
