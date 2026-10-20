import React from 'react';

import {Text} from '@gravity-ui/uikit';
import isNil from 'lodash/isNil';

import type {NumberView} from '../../../../core';

/** @deprecated Use the SchemaRenderer API. */
export const RangeInputPickerNumberView: NumberView = ({value}) => {
    if (isNil(value)) {
        return null;
    }

    return <Text>{String(value)}</Text>;
};
