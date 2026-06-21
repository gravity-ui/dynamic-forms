import React from 'react';

import {Text} from '@gravity-ui/uikit';
import isNil from 'lodash/isNil';

import type {ObjectView} from '../../../../core';
import {RANGE_INPUT_PICKER_DEFAULT_SEPARATOR} from '../../../constants/common';
import type {RangeInputPickerInputProps} from '../../Inputs/RangeInputPicker';

export const RangeInputPickerView: ObjectView = ({value, spec}) => {
    const separator =
        (spec.viewSpec.inputProps as RangeInputPickerInputProps | undefined)?.separator ??
        RANGE_INPUT_PICKER_DEFAULT_SEPARATOR;
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

    return <Text>{formatted}</Text>;
};
