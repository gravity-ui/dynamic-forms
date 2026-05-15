import React from 'react';

import {NumberInput, Slider} from '@gravity-ui/uikit';
import isNil from 'lodash/isNil';
import set from 'lodash/set';

import type {
    FieldValue,
    NumberSpec,
    ObjectIndependentInputProps,
    ValidateError,
} from '../../../../core';
import {isNumberSpec} from '../../../../core';
import {FROM, TO} from '../../../constants/common';
import {block} from '../../../utils';

import type {RangeInputPickerInputProps, RangeInputPickerValue} from './types';

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

export const RangeInputPicker = (
    props: ObjectIndependentInputProps<RangeInputPickerInputProps>,
) => {
    const {spec, input, name, Layout} = props;
    const {disabled, inputProps} = spec.viewSpec;
    const sliderParams = inputProps?.sliderParams;
    const showSlider = inputProps?.showSlider ?? true;
    const showInputs = inputProps?.showInputs ?? true;

    const [fromSpec, toSpec] = React.useMemo(
        () =>
            [FROM, TO].map((key) =>
                isNumberSpec(spec.properties?.[key])
                    ? (spec.properties?.[key] as NumberSpec<any, undefined, undefined>)
                    : undefined,
            ),
        [spec.properties],
    );

    const sliderMin = resolveBound(sliderParams?.min, fromSpec?.minimum, DEFAULT_MIN);
    const sliderMax = resolveBound(sliderParams?.max, toSpec?.maximum, DEFAULT_MAX);
    const sliderStep = sliderParams?.step ?? 1;
    const sliderMarks = sliderParams?.marks ?? 2;

    const value = (input.value as RangeInputPickerValue | undefined) ?? {};
    const fromValue = isNil(value.from) ? undefined : Number(value.from);
    const toValue = isNil(value.to) ? undefined : Number(value.to);

    const sliderValue: [number, number] = [
        isNil(fromValue) ? sliderMin : fromValue,
        isNil(toValue) ? sliderMax : toValue,
    ];

    const parentOnChange = React.useCallback(
        (childName: string, childValue: FieldValue, childErrors?: Record<string, ValidateError>) =>
            input.onChange(
                (currentValue) =>
                    set({...currentValue}, childName.split(`${name}.`).join(''), childValue),
                childErrors,
            ),
        [input, name],
    );

    const handleSliderUpdate = React.useCallback(
        (next: number | [number, number]) => {
            if (!Array.isArray(next)) {
                return;
            }

            input.onChange(() => ({
                ...value,
                [FROM]: next[0],
                [TO]: next[1],
            }));
        },
        [input, value],
    );

    const handleFromUpdate = React.useCallback(
        (next: number | null) => {
            const safe =
                next === null
                    ? undefined
                    : clamp(next, sliderMin, isNil(toValue) ? sliderMax : toValue);

            parentOnChange(`${name}.${FROM}`, safe);
        },
        [name, parentOnChange, sliderMin, sliderMax, toValue],
    );

    const handleToUpdate = React.useCallback(
        (next: number | null) => {
            const safe =
                next === null
                    ? undefined
                    : clamp(next, isNil(fromValue) ? sliderMin : fromValue, sliderMax);

            parentOnChange(`${name}.${TO}`, safe);
        },
        [name, parentOnChange, sliderMin, sliderMax, fromValue],
    );

    const content = (
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
                        onBlur={input.onBlur}
                        onFocus={input.onFocus}
                        qa={`${name}-slider`}
                        tooltipDisplay="off"
                    />
                </div>
            ) : null}
            {showInputs ? (
                <div className={b('inputs')}>
                    <NumberInput
                        className={b('input')}
                        value={isNil(fromValue) ? null : fromValue}
                        min={sliderMin}
                        max={sliderMax}
                        step={sliderStep}
                        disabled={disabled || fromSpec?.viewSpec.disabled}
                        placeholder={fromSpec?.viewSpec.placeholder}
                        onUpdate={handleFromUpdate}
                        onBlur={input.onBlur}
                        onFocus={input.onFocus}
                        hasClear
                        allowDecimal
                        qa={`${name}-from`}
                    />
                    <span className={b('separator')}>{inputProps?.separator ?? '–'}</span>
                    <NumberInput
                        className={b('input')}
                        value={isNil(toValue) ? null : toValue}
                        min={sliderMin}
                        max={sliderMax}
                        step={sliderStep}
                        disabled={disabled || toSpec?.viewSpec.disabled}
                        placeholder={toSpec?.viewSpec.placeholder}
                        onUpdate={handleToUpdate}
                        onBlur={input.onBlur}
                        onFocus={input.onFocus}
                        hasClear
                        allowDecimal
                        qa={`${name}-to`}
                    />
                </div>
            ) : null}
        </div>
    );

    if (Layout) {
        return <Layout {...props}>{content}</Layout>;
    }

    return <React.Fragment>{content}</React.Fragment>;
};
