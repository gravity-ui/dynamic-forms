import React from 'react';

import {DatePicker, type DatePickerProps} from '@gravity-ui/date-components';
import {type DateTime, dateTimeParse, isValidTimeZone} from '@gravity-ui/date-utils';
import {Flex} from '@gravity-ui/uikit';

import type {Control, JsonSchemaAny} from '../../../core';
import {ControlError} from '../../components';
import {block, getValidationState} from '../../utils';

import './DateInput.scss';

const b = block('date-input');

export const DEFAULT_DATE_FORMAT = 'DD.MM.YYYY HH:mm';

export interface DateInputProps
    extends Omit<DatePickerProps, 'value' | 'onFocus' | 'onBlur' | 'onChange' | 'onUpdate' | 'qa'> {
    outputFormat?: string;
}

const Component: Control<JsonSchemaAny, DateInputProps> = ({controlProps, input, meta, schema}) => {
    const {name, onBlur, onChange, onFocus, value: inputValue} = input;
    const {outputFormat, timeZone: timeZoneProp, ...restControlProps} = controlProps;

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

    const value = React.useMemo(() => {
        if (!inputValue) {
            return null;
        }

        let raw = inputValue as {seconds?: number} | string | number | Date | null | undefined;

        if (typeof raw === 'object' && raw !== null && 'seconds' in raw && raw.seconds) {
            raw = raw.seconds * 1000;
        }

        return dateTimeParse(raw, {format: outputFormat, timeZone}) || null;
    }, [inputValue, outputFormat, timeZone]);

    return (
        <Flex className={b({error: getValidationState(meta)})} width="100%" direction="column">
            <DatePicker
                format={DEFAULT_DATE_FORMAT}
                popupPlacement="bottom-start"
                disabled={schema.readOnly}
                hasClear
                {...restControlProps}
                value={value}
                onFocus={onFocus as DatePickerProps['onFocus']}
                onBlur={onBlur as DatePickerProps['onBlur']}
                onUpdate={onUpdate}
                placeholder={`${schema.examples?.[0]}`}
                timeZone={timeZone}
                data-qa={name}
            />
            <ControlError errorMessage={meta.error} validationState={getValidationState(meta)} />
        </Flex>
    );
};

export const DateInput = React.memo(Component);
