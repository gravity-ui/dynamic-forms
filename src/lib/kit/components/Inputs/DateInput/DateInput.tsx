import React, {useCallback} from 'react';

import {DatePicker, DatePickerProps} from '@gravity-ui/date-components';
import {FieldObjectValue, StringInputProps} from '../../../../core';
import {DateTime, dateTimeParse} from '@gravity-ui/date-utils';
import {block} from '../../../utils';

import './DateInput.scss';

const b = block('date-input');

export interface DateProps
    extends Omit<DatePickerProps, 'value' | 'disabled' | 'placeholder' | 'qa'> {}

export type DateValueProps = string | number | Date | FieldObjectValue | undefined;

export const DateInput: React.FC<StringInputProps<DateProps, DateValueProps>> = ({
    name,
    input,
    spec,
    inputProps,
}) => {
    const {value, onChange, onBlur, onFocus} = input;
    const {dateInput: {outputFormat, valueType} = {}} = spec.viewSpec;

    const onUpdate = useCallback(
        (date: DateTime | null) => {
            if (!date) {
                onChange('');
            } else if (outputFormat) {
                onChange(date.format(outputFormat));
            } else {
                switch (valueType) {
                    case 'date_time':
                        onChange(date as object as FieldObjectValue);
                        break;
                    case 'date':
                        onChange(date.toDate());
                        break;
                    case 'timestamp':
                        onChange({
                            seconds: date.second(),
                            nanos: 0,
                        } as FieldObjectValue);
                        break;
                    case 'string':
                    default:
                        onChange(date.toISOString());
                        break;
                }
            }
        },
        [outputFormat],
    );

    const props: DatePickerProps = {
        hasClear: true,
        ...inputProps,
        onBlur: onBlur as (e: React.FocusEvent<HTMLElement>) => void,
        onFocus: onFocus as (e: React.FocusEvent<HTMLElement>) => void,
        value: value ? dateTimeParse(value) || null : null,
        onUpdate,
        disabled: spec.viewSpec.disabled,
        placeholder: spec.viewSpec.placeholder,
    };

    return <DatePicker className={b()} data-qa={name} {...props} />;
};

export default DateInput;
