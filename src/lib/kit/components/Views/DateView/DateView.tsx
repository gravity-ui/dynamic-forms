import React from 'react';

import {StringViewProps} from '../../../../core';
import {BaseView, DEFAULT_DATE_FORMAT} from '../../../components';
import {dateTimeParse} from '@gravity-ui/date-utils';
import isObject from 'lodash/isObject';

interface Timestamp {
    seconds: string;
    nanos?: number;
}

export const DateView: React.FC<StringViewProps> = ({value, spec, ...restProps}) => {
    const {
        printFormat = DEFAULT_DATE_FORMAT,
        outputFormat,
        timeZone,
    } = spec.viewSpec.dateInput || {};

    let formatedValue: string | number | undefined = value;

    if (isObject(value) && (value as Timestamp).seconds) {
        formatedValue = Number((value as unknown as Timestamp).seconds) * 1000;
    }

    if (formatedValue) {
        const date = dateTimeParse(formatedValue, {format: outputFormat, timeZone});

        if (date) {
            formatedValue = date.format(printFormat);
        }
    }

    return <BaseView spec={spec} value={String(formatedValue)} {...restProps} />;
};
