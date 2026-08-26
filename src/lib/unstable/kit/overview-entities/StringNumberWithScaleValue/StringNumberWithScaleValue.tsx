import React from 'react';

import {Text} from '@gravity-ui/uikit';
import Decimal from 'decimal.js';
import get from 'lodash/get';

import type {JsonSchemaString, NodeEntity} from '../../../core';
import {EmptyEntityValue, EntityContainer, LongValue, type LongValueProps} from '../../components';
import {isStringNumber} from '../../utils';

export interface StringNumberWithScaleValueProps extends Omit<LongValueProps, 'qa' | 'value'> {
    scale?: Record<string, {title: string; factor: string}>;
    viewType?: string;
}
export const StringNumberWithScaleValue: NodeEntity<
    JsonSchemaString,
    StringNumberWithScaleValueProps
> = ({input, props}) => {
    const {scale, viewType, ...restProps} = props;

    const level = React.useMemo(() => {
        const determined = viewType ? get(scale, viewType) : undefined;
        let suggested: {title: string; factor: string} | undefined = isStringNumber(
            determined?.factor,
        )
            ? determined
            : undefined;

        Object.values(scale || {}).forEach((item) => {
            if (
                isStringNumber(input.value) &&
                isStringNumber(item.factor) &&
                new Decimal(input.value).div(item.factor).abs().gte(1) &&
                (!suggested || new Decimal(item.factor).gt(suggested.factor))
            ) {
                suggested = item;
            }
        });

        return suggested;
    }, [input.value, scale, viewType]);

    if (!isStringNumber(input.value)) {
        return <EmptyEntityValue />;
    }

    return (
        <EntityContainer stretch="fit" fill="populated" direction="row" gap={0.5}>
            <LongValue
                {...restProps}
                value={new Decimal(input.value).div(level?.factor || 1).toString()}
                qa={input.name}
            />
            {level?.title ? <Text color="secondary">{level.title}</Text> : null}
        </EntityContainer>
    );
};
