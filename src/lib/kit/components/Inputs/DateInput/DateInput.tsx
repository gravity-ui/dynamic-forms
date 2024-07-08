import React, {useCallback} from 'react';

import {DatePicker, DatePickerProps} from '@gravity-ui/date-components';
import {StringInputProps} from '../../../../core';
import {DateTime, dateTimeParse} from '@gravity-ui/date-utils';
import {block} from '../../../utils';

import './DateInput.scss';

export const DEFAULT_DATE_FORMAT = 'DD-MM-YYYY';

const b = block('date-input');

export interface DateProps
    extends Omit<DatePickerProps, 'value' | 'disabled' | 'placeholder' | 'qa'> {}

export const DateInput: React.FC<StringInputProps<DateProps>> = ({
    name,
    input,
    spec,
    inputProps,
}) => {
    const {value, onChange, onBlur, onFocus} = input;
    const dateInput = spec.viewSpec.dateInput;
    const outputFormat = dateInput?.outputFormat;

    const onUpdate = useCallback(
        (date: DateTime | null) => {
            if (!date) {
                onChange(undefined as any);
            } else {
                switch (outputFormat) {
                    case 'date_time':
                        onChange(date as any);
                        break;
                    case 'date':
                        onChange(date.toDate() as any);
                        break;
                    case 'timestamp':
                        onChange({
                            seconds: Math.floor(date?.toDate().getTime() / 1000),
                            nanos: 0,
                        } as any);
                        break;
                    case 'string':
                    case undefined:
                    case '':
                        onChange(date.toISOString());
                        break;
                    default:
                        onChange(date.format(outputFormat));
                        break;
                }
            }
        },
        [outputFormat],
    );

    const props: DatePickerProps = {
        hasClear: true,
        format: dateInput?.printFormat || DEFAULT_DATE_FORMAT,
        ...inputProps,
        onBlur: onBlur as (e: React.FocusEvent<HTMLElement>) => void,
        onFocus: onFocus as (e: React.FocusEvent<HTMLElement>) => void,
        value: value
            ? dateTimeParse((value as any).seconds ? (value as any).seconds * 1000 : value) || null
            : null,
        onUpdate,
        disabled: spec.viewSpec.disabled,
        placeholder: spec.viewSpec.placeholder,
    };

    return <DatePicker className={b()} data-qa={name} {...props} />;
};

export default DateInput;
