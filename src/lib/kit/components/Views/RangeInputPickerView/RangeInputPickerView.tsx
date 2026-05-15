import React from 'react';

import {Text} from '@gravity-ui/uikit';
import isNil from 'lodash/isNil';

import type {ObjectIndependentView} from '../../../../core';
import type {RangeInputPickerInputProps} from '../../Inputs/RangeInputPicker';

export const RangeInputPickerView: ObjectIndependentView = ({
    value,
    spec,
    name,
    Layout,
    ...restProps
}) => {
    const separator =
        (spec.viewSpec.inputProps as RangeInputPickerInputProps | undefined)?.separator ?? '–';
    const from = value?.from;
    const to = value?.to;

    const formatted = (() => {
        if (isNil(from) && isNil(to)) {
            return '';
        }

        if (isNil(from)) {
            return `${separator} ${to}`;
        }

        if (isNil(to)) {
            return `${from} ${separator}`;
        }

        return `${from} ${separator} ${to}`;
    })();

    const content = <Text>{formatted}</Text>;

    if (Layout) {
        return (
            <Layout spec={spec} name={name} value={value} {...restProps}>
                {content}
            </Layout>
        );
    }

    return <React.Fragment>{content}</React.Fragment>;
};
