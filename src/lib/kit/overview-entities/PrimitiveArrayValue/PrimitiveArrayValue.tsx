import React from 'react';

import type {JsonSchemaArray, NodeEntity} from '../../../core';
import {EmptyEntityValue, EntityContainer, LongValue, type LongValueProps} from '../../components';
import {getQaBase} from '../../utils/qa';

export interface PrimitiveArrayValueProps extends Omit<LongValueProps, 'qa' | 'value'> {
    direction?: 'column' | 'row';
    enumDescriptions?: Record<string, string>;
}

export const PrimitiveArrayValue: NodeEntity<JsonSchemaArray, PrimitiveArrayValueProps> = ({
    input,
    schema,
    props,
    settings,
}) => {
    const qaBase = getQaBase(input.name, schema);
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
            <EntityContainer width="fit" fill="populated" gap="spacing-half">
                {values.map((item, index) => (
                    <LongValue
                        variant={settings?.textVariant}
                        {...restProps}
                        key={`${item}-${index}`}
                        value={item}
                        qa={getQaBase(
                            `${input.name}[${index}]`,
                            Array.isArray(schema.items) ? schema.items[index] : schema.items,
                        )}
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
                qa={qaBase}
            />
        </EntityContainer>
    );
};
