import React from 'react';

import {type DatePickerProps} from '@gravity-ui/date-components';
import {isValidTimeZone} from '@gravity-ui/date-utils';

import type {JsonSchemaAny, NodeEntity} from '../../../core';
import {EmptyEntityValue, EntityContainer, LongValue, type LongValueProps} from '../../components';
import {DEFAULT_DATE_FORMAT} from '../../constants';
import {parseDate} from '../../utils';

export interface DateValueProps extends Omit<LongValueProps, 'qa' | 'value'> {
    format?: DatePickerProps['format'];
    outputFormat?: string;
    timeZone?: DatePickerProps['timeZone'];
}

export const DateValue: NodeEntity<JsonSchemaAny, DateValueProps> = ({input, props}) => {
    const {
        format = DEFAULT_DATE_FORMAT,
        outputFormat,
        timeZone: timeZoneProp,
        ...restProps
    } = props;
    const timeZone = timeZoneProp && isValidTimeZone(timeZoneProp) ? timeZoneProp : undefined;

    const date = React.useMemo(
        () => parseDate(input.value, outputFormat, timeZone),
        [input.value, outputFormat, timeZone],
    );

    if (!date) {
        return <EmptyEntityValue />;
    }

    return (
        <EntityContainer stretch="fit" fill="populated">
            <LongValue {...restProps} value={date.format(format)} qa={input.name} />
        </EntityContainer>
    );
};
