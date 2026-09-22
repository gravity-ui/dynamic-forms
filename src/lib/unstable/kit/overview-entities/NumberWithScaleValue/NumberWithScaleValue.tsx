import React from 'react';

import {Text} from '@gravity-ui/uikit';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';

import type {JsonSchemaNumber, NodeEntity} from '../../../core';
import {EmptyEntityValue, EntityContainer, LongValue, type LongValueProps} from '../../components';

export interface NumberWithScaleValueProps extends Omit<LongValueProps, 'qa' | 'value'> {
    scale?: Record<string, {title: string; factor: number}>;
    viewType?: string;
}
export const NumberWithScaleValue: NodeEntity<JsonSchemaNumber, NumberWithScaleValueProps> = ({
    input,
    props,
    settings,
}) => {
    const {scale, viewType, ...restProps} = props;

    const level = React.useMemo(() => {
        const determined = viewType ? get(scale, viewType) : undefined;
        let suggested: {title: string; factor: number} | undefined = isNumber(determined?.factor)
            ? determined
            : undefined;

        Object.values(scale || {}).forEach((item) => {
            if (
                isNumber(input.value) &&
                isNumber(item.factor) &&
                Math.abs(input.value / item.factor) >= 1 &&
                (!suggested || item.factor > suggested.factor)
            ) {
                suggested = item;
            }
        });

        return suggested;
    }, [input.value, scale, viewType]);

    if (!isNumber(input.value)) {
        return <EmptyEntityValue settings={settings} />;
    }

    return (
        <EntityContainer width="fit" fill="populated" direction="row" gap={0.5}>
            <LongValue
                variant={settings?.textVariant}
                {...restProps}
                value={input.value / (level?.factor || 1)}
                qa={input.name}
            />
            {level?.title ? (
                <Text variant={settings?.textVariant} color="secondary">
                    {level.title}
                </Text>
            ) : null}
        </EntityContainer>
    );
};
