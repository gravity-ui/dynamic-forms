import React from 'react';

import type {DatePickerProps} from '@gravity-ui/date-components';
import {DatePicker} from '@gravity-ui/date-components';
import type {DateTime} from '@gravity-ui/date-utils';
import {dateTimeParse, isValidTimeZone} from '@gravity-ui/date-utils';

import type {Control, JsonSchemaAny} from '../../../core';
import {ControlError} from '../../components';
import {block, getValidationState} from '../../utils';

import './DateInput.scss';

export const DEFAULT_DATE_FORMAT = 'DD.MM.YYYY HH:mm';

const b = block('date-input');

export interface DateInputProps
    extends Omit<DatePickerProps, 'value' | 'onFocus' | 'onBlur' | 'onChange' | 'onUpdate' | 'qa'> {
    outputFormat?: string;
}

const Component: Control<JsonSchemaAny, DateInputProps> = ({controlProps, input, meta, schema}) => {
    const {outputFormat, timeZone: timeZoneProp, ...restControlProps} = controlProps;

    const timeZone = timeZoneProp && isValidTimeZone(timeZoneProp) ? timeZoneProp : undefined;

    const onUpdate = React.useCallback(
        (date: DateTime | null) => {
            if (!date) {
                input.onChange(undefined);

                return;
            }

            if (outputFormat === 'date_time') {
                input.onChange(date);

                return;
            }

            if (outputFormat === 'date') {
                input.onChange(date.toDate());

                return;
            }

            if (outputFormat === 'timestamp') {
                input.onChange({
                    seconds: Math.floor(date.toDate().getTime() / 1000),
                    nanos: 0,
                });

                return;
            }

            if (outputFormat === 'string' || !outputFormat) {
                input.onChange(date.toISOString());

                return;
            }

            input.onChange(date.format(outputFormat));
        },
        [outputFormat, input.onChange],
    );

    const value = React.useMemo(() => {
        if (!input.value) {
            return null;
        }

        let raw = input.value as {seconds?: number} | string | number | Date | null | undefined;

        if (typeof raw === 'object' && raw !== null && 'seconds' in raw && raw.seconds) {
            raw = raw.seconds * 1000;
        }

        return dateTimeParse(raw, {format: outputFormat, timeZone}) || null;
    }, [input.value, outputFormat, timeZone]);

    return (
        <ControlError errorMessage={meta.error} validationState={getValidationState(meta)}>
            <DatePicker
                className={b()}
                format={DEFAULT_DATE_FORMAT}
                popupPlacement="bottom-start"
                disabled={schema.readOnly}
                hasClear
                {...restControlProps}
                value={value}
                onFocus={input.onFocus as DatePickerProps['onFocus']}
                onBlur={input.onBlur as DatePickerProps['onBlur']}
                onUpdate={onUpdate}
                placeholder={`${schema.examples?.[0]}`}
                timeZone={timeZone}
                data-qa={input.name}
            />
        </ControlError>
    );
};

export const DateInput = React.memo(Component);
