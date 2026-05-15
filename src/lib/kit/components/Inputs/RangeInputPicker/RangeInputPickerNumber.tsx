import React from 'react';

import {NumberInput, Slider} from '@gravity-ui/uikit';
import isNil from 'lodash/isNil';

import type {FieldRenderProps, NumberInputProps} from '../../../../core';
import {block} from '../../../utils';

import type {RangeInputPickerInputProps} from './types';

import './RangeInputPicker.scss';

const b = block('range-input-picker');

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const resolveBound = (
    inputBound: number | undefined,
    specBound: number | undefined,
    fallback: number,
) => {
    if (!isNil(inputBound)) {
        return inputBound;
    }

    if (!isNil(specBound)) {
        return specBound;
    }

    return fallback;
};

export const RangeInputPickerNumber = ({
    name,
    input: {value, onBlur, onChange, onFocus},
    spec,
}: NumberInputProps<RangeInputPickerInputProps>) => {
    const {disabled, placeholder, inputProps} = spec.viewSpec;
    const sliderParams = inputProps?.sliderParams;
    const showSlider = inputProps?.showSlider ?? true;
    const showInputs = inputProps?.showInputs ?? true;

    const sliderMin = resolveBound(sliderParams?.min, spec.minimum, DEFAULT_MIN);
    const sliderMax = resolveBound(sliderParams?.max, spec.maximum, DEFAULT_MAX);
    const sliderStep = sliderParams?.step ?? 1;
    const sliderMarks = sliderParams?.marks ?? 2;

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

            onChangeAllowUndefined(clamp(next, sliderMin, sliderMax));
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
