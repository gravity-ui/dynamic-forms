import React from 'react';

import {DatePicker, type DatePickerProps} from '@gravity-ui/date-components';
import {type DateTime, isValidTimeZone} from '@gravity-ui/date-utils';

import type {JsonSchemaAny, NodeEntity} from '../../../core';
import {EntityContainer} from '../../components';
import {DEFAULT_DATE_FORMAT} from '../../constants';
import {block, getBooleanValidationState, parseDate} from '../../utils';

import './DateInput.scss';

const b = block('date-input');

export interface DateInputProps
    extends Omit<
        DatePickerProps,
        | 'value'
        | 'onFocus'
        | 'onBlur'
        | 'onChange'
        | 'onUpdate'
        | 'errorMessage'
        | 'validationState'
    > {
    outputFormat?: string;
}

export const DateInput: NodeEntity<JsonSchemaAny, DateInputProps> = ({
    input,
    meta,
    props,
    schema,
}) => {
    const {name, onBlur, onChange, onFocus, value: inputValue} = input;
    const {
        format = DEFAULT_DATE_FORMAT,
        outputFormat,
        timeZone: timeZoneProp,
        ...restEntityProps
    } = props;

    const timeZone = timeZoneProp && isValidTimeZone(timeZoneProp) ? timeZoneProp : undefined;

    const onUpdate = React.useCallback(
        (date: DateTime | null) => {
            if (!date) {
                onChange(undefined);

                return;
            }

            if (outputFormat === 'date_time') {
                onChange(date);

                return;
            }

            if (outputFormat === 'date') {
                onChange(date.toDate());

                return;
            }

            if (outputFormat === 'timestamp') {
                onChange({
                    seconds: Math.floor(date.toDate().getTime() / 1000),
                    nanos: 0,
                });

                return;
            }

            if (outputFormat === 'string' || !outputFormat) {
                onChange(date.toISOString());

                return;
            }

            onChange(date.format(outputFormat));
        },
        [outputFormat, onChange],
    );

    const value = React.useMemo(
        () => parseDate(inputValue, outputFormat, timeZone),
        [inputValue, outputFormat, timeZone],
    );

    return (
        <EntityContainer stretch="max" className={b({error: getBooleanValidationState(meta)})}>
            <DatePicker
                format={format}
                popupPlacement="bottom-start"
                placeholder={`${schema.examples?.[0]}`}
                disabled={schema.readOnly}
                hasClear
                {...restEntityProps}
                value={value}
                onFocus={onFocus as DatePickerProps['onFocus']}
                onBlur={onBlur as DatePickerProps['onBlur']}
                onUpdate={onUpdate}
                timeZone={timeZone}
                errorMessage={undefined}
                validationState={undefined}
                data-qa={name}
            />
        </EntityContainer>
    );
};
