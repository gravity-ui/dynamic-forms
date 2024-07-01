import React from 'react';

import isString from 'lodash/isString';

import {StringViewProps} from '../../../../core';
import {BaseView} from '../../../components';
import {dateTimeParse} from '@gravity-ui/date-utils';

export const FormatedDateView = <T extends StringViewProps>({
    value,
    spec,
    ...restProps
}: React.PropsWithChildren<T>) => {
    let formatedValue = value;

    const dateSpec = spec.viewSpec.dateInput;
    const format = dateSpec && (dateSpec.printFormat || dateSpec.outputFormat);
    if (isString(value) && format) {
        formatedValue = dateTimeParse(value)?.format(format) || formatedValue;
    }

    return <BaseView spec={spec} value={formatedValue} {...restProps} />;
};
