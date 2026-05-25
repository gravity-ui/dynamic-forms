import React from 'react';

import {NumberInput, Slider} from '@gravity-ui/uikit';
import isNil from 'lodash/isNil';

import type {FieldRenderProps, NumberInputProps} from '../../../../core';
import {
    RANGE_INPUT_PICKER_DEFAULT_MARKS,
    RANGE_INPUT_PICKER_DEFAULT_MAX,
    RANGE_INPUT_PICKER_DEFAULT_MIN,
    RANGE_INPUT_PICKER_DEFAULT_STEP,
} from '../../../constants/common';
import {block, clampRangeInputPickerValue, resolveRangeInputPickerBound} from '../../../utils';

import type {RangeInputPickerInputProps} from './types';

import './RangeInputPicker.scss';

const b = block('range-input-picker');

export const RangeInputPickerNumber = ({
    name,
    input: {value, onBlur, onChange, onFocus},
    spec,
}: NumberInputProps<RangeInputPickerInputProps>) => {
    const {disabled, placeholder, inputProps} = spec.viewSpec;
    const sliderParams = inputProps?.sliderParams;
    const showSlider = inputProps?.showSlider ?? true;
    const showInputs = inputProps?.showInputs ?? true;

    const sliderMin = resolveRangeInputPickerBound(
        sliderParams?.min,
        spec.minimum,
        RANGE_INPUT_PICKER_DEFAULT_MIN,
    );
    const sliderMax = resolveRangeInputPickerBound(
        sliderParams?.max,
        spec.maximum,
        RANGE_INPUT_PICKER_DEFAULT_MAX,
    );
    const sliderStep = sliderParams?.step ?? RANGE_INPUT_PICKER_DEFAULT_STEP;
    const sliderMarks = sliderParams?.marks ?? RANGE_INPUT_PICKER_DEFAULT_MARKS;

    const numericValue = isNil(value) ? undefined : Number(value);
    const sliderValue = isNil(numericValue) ? sliderMin : numericValue;

    const onChangeAllowUndefined = onChange as FieldRenderProps<
        number | undefined
    >['input']['onChange'];

    const handleSliderUpdate = React.useCallback(
        (next: number | [number, number]) => {
            if (Array.isArray(next)) {
                return;
            }

            onChangeAllowUndefined(next);
        },
        [onChangeAllowUndefined],
    );

    const handleInputUpdate = React.useCallback(
        (next: number | null) => {
            if (next === null) {
                onChangeAllowUndefined(undefined);

                return;
            }

            onChangeAllowUndefined(clampRangeInputPickerValue(next, sliderMin, sliderMax));
        },
        [onChangeAllowUndefined, sliderMin, sliderMax],
    );

    return (
        <div className={b()}>
            {showSlider ? (
                <div className={b('slider')}>
                    <Slider
                        value={sliderValue}
                        min={sliderMin}
                        max={sliderMax}
                        step={sliderStep}
                        marks={sliderMarks}
                        disabled={disabled}
                        onUpdate={handleSliderUpdate}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        qa={`${name}-slider`}
                        tooltipDisplay="off"
                    />
                </div>
            ) : null}
            {showInputs ? (
                <div className={b('inputs')}>
                    <NumberInput
                        className={b('input')}
                        value={isNil(numericValue) ? null : numericValue}
                        min={sliderMin}
                        max={sliderMax}
                        step={sliderStep}
                        disabled={disabled}
                        placeholder={placeholder}
                        onUpdate={handleInputUpdate}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        hasClear
                        allowDecimal
                        qa={name}
                    />
                </div>
            ) : null}
        </div>
    );
};
