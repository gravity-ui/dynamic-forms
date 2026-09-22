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
    settings,
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
        return <EmptyEntityValue settings={settings} />;
    }

    if (direction === 'column') {
        return (
            <EntityContainer width="fit" fill="populated" gap={0.5}>
                {values.map((item, index) => (
                    <LongValue
                        variant={settings?.textVariant}
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
        <EntityContainer width="fit" fill="populated">
            <LongValue
                variant={settings?.textVariant}
                {...restProps}
                value={values.join(', ')}
                qa={input.name}
            />
        </EntityContainer>
    );
};
