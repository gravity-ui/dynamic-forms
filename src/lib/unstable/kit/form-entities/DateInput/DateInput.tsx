import React from 'react';

import {DatePicker, type DatePickerProps} from '@gravity-ui/date-components';
import {type DateTime, dateTimeParse, isValidTimeZone} from '@gravity-ui/date-utils';

import type {JsonSchemaAny, NodeEntity} from '../../../core';
import {EntityContainer} from '../../components';
import {block, getBooleanValidationState} from '../../utils';

import './DateInput.scss';

const b = block('date-input');

export const DEFAULT_DATE_FORMAT = 'DD.MM.YYYY HH:mm';

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

const DateInputComponent: NodeEntity<JsonSchemaAny, DateInputProps> = ({
    input,
    meta,
    props,
    schema,
}) => {
    const {name, onBlur, onChange, onFocus, value: inputValue} = input;
    const {outputFormat, timeZone: timeZoneProp, ...restEntityProps} = props;

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
        <EntityContainer stretch="max" className={b({error: getBooleanValidationState(meta)})}>
            <DatePicker
                format={DEFAULT_DATE_FORMAT}
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

export const DateInput = React.memo(DateInputComponent);
