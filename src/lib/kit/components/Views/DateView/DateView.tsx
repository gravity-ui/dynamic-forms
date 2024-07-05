import React from 'react';

import {StringSpec, StringViewProps} from '../../../../core';
import {BaseView, DEFAULT_DATE_FORMAT} from '../../../components';
import {dateTimeParse} from '@gravity-ui/date-utils';
import isObject from 'lodash/isObject';
import {DatePickerProps} from '@gravity-ui/date-components/dist/esm/components/DatePicker/DatePicker';

interface Timestamp {
    seconds: string;
    nanos?: number;
}

export const DateView: React.FC<StringViewProps> = ({value, spec, ...restProps}) => {
    let formatedValue =
        value && isObject(value) && (value as object as Timestamp).seconds
            ? (value as any)?.seconds * 1000
            : value;

    const localSpec = (spec as StringSpec<any, DatePickerProps | undefined>)!.viewSpec;

    const format =
        localSpec.inputProps?.format || localSpec.dateInput?.printFormat || DEFAULT_DATE_FORMAT;

    if (formatedValue && format) {
        formatedValue = dateTimeParse(formatedValue)?.format(format) || formatedValue;
    }

    return <BaseView spec={spec} value={String(formatedValue)} {...restProps} />;
};
