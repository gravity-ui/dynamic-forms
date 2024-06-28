import React, {useCallback} from 'react';

import {DatePicker, DatePickerProps} from '@gravity-ui/date-components';
import {StringInputProps} from '../../../../core';
import {DateTime, dateTimeParse} from '@gravity-ui/date-utils';
import {block} from '../../../utils';

import './DateInput.scss';

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

    const onUpdate = useCallback(
        (date: DateTime | null) => {
            if (!date) {
                onChange('');
            } else if (spec.viewSpec.dateInput?.outputFormat) {
                onChange(date.format(spec.viewSpec.dateInput.outputFormat));
            } else {
                onChange(date.toISOString());
            }
        },
        [spec.viewSpec.dateInput?.outputFormat],
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
