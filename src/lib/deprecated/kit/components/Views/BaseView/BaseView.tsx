import React from 'react';

import isString from 'lodash/isString';

import {LongValue} from '../..';
import {
    type BooleanViewProps,
    type NumberViewProps,
    type StringSpec,
    type StringViewProps,
    isBooleanSpec,
} from '../../../../core';

/** @deprecated Use the SchemaRenderer API. */
export const BaseView = <T extends BooleanViewProps | NumberViewProps | StringViewProps>({
    value,
    spec,
    linkValue,
}: React.PropsWithChildren<T>) => {
    const stringValue = String(value);
    const color =
        (isBooleanSpec(spec) &&
            spec.viewSpec.viewColor?.[stringValue as keyof typeof spec.viewSpec.viewColor]) ||
        undefined;

    if (isString(value) && linkValue) {
        return <>{linkValue}</>;
    }

    return (
        <LongValue
            value={(spec as StringSpec)?.description?.[stringValue] || stringValue}
            color={color}
        />
    );
};
