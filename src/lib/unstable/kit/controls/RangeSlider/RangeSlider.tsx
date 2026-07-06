import React from 'react';

import {Slider as UIKitSlider, type SliderProps as UIKitSliderProps} from '@gravity-ui/uikit';

import type {Control, JsonSchemaObject} from '../../../core';
import {block, getValidationState} from '../../utils';

import './RangeSlider.scss';

const b = block('range-slider');

export interface RangeSliderProps
    extends Omit<
        UIKitSliderProps,
        'value' | 'onFocus' | 'onBlur' | 'onChange' | 'onUpdate' | 'qa'
    > {
    propertyKeys?: [string, string];
}

const Component: Control<JsonSchemaObject, RangeSliderProps> = ({
    controlProps,
    input,
    meta,
    schema,
}) => {
    const {name, onBlur, onChange, onFocus, value: inputValue} = input;
    const {propertyKeys, ...restControlProps} = controlProps;

    const [fromKey, toKey] = propertyKeys || ['from', 'to'];

    const min =
        schema.properties?.[fromKey] && 'minimum' in schema.properties[fromKey]
            ? schema.properties?.[fromKey]?.minimum
            : undefined;
    const max =
        schema.properties?.[toKey] && 'maximum' in schema.properties[toKey]
            ? schema.properties?.[toKey]?.maximum
            : undefined;

    const value: [number, number] | undefined =
        isNaN(Number(inputValue?.[fromKey])) || isNaN(Number(inputValue?.[toKey]))
            ? undefined
            : [Number(inputValue?.[fromKey]), Number(inputValue?.[toKey])];
    const defaultValue: [number, number] | undefined =
        isNaN(Number(schema.default?.[fromKey])) || isNaN(Number(schema.default?.[toKey]))
            ? undefined
            : [Number(schema.default?.[fromKey]), Number(schema.default?.[toKey])];

    const onUpdate = React.useCallback(
        (next: number | [number, number]) => {
            if (!Array.isArray(next)) {
                return;
            }

            onChange({[fromKey]: next[0], [toKey]: next[1]});
        },
        [fromKey, toKey, onChange],
    );

    return (
        <UIKitSlider
            className={b()}
            min={min}
            max={max}
            step={1}
            marks={2}
            disabled={schema.readOnly}
            tooltipDisplay="on"
            {...restControlProps}
            defaultValue={defaultValue}
            value={value}
            onFocus={onFocus}
            onBlur={onBlur}
            onUpdate={onUpdate}
            errorMessage={meta.error}
            validationState={getValidationState(meta)}
            qa={name}
        />
    );
};

export const RangeSlider = React.memo(Component);
