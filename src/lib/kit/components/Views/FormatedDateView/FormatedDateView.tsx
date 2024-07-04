import React from 'react';

import isString from 'lodash/isString';

import {StringSpec, ViewProps} from '../../../../core';
import {BaseView, DateValueProps} from '../../../components';
import {dateTimeParse} from '@gravity-ui/date-utils';
import isObject from 'lodash/isObject';

interface Timestamp {
    seconds: string;
    nanos?: number;
}

export const FormatedDateView: React.FC<ViewProps<DateValueProps, StringSpec>> = ({
    value,
    spec,
    ...restProps
}) => {
    let formatedValue =
        value && isObject(value) && (value as object as Timestamp).seconds
            ? (value as object as Timestamp)?.seconds
            : value;

    const dateSpec = spec.viewSpec.dateInput;
    const format = dateSpec && (dateSpec.printFormat || dateSpec.outputFormat);
    if (isString(value) && format) {
        formatedValue = dateTimeParse(value)?.format(format) || formatedValue;
    }

    return <BaseView spec={spec} value={String(formatedValue)} {...restProps} />;
};
