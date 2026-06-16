import React from 'react';

import {Slider as SliderBase, type SliderProps as SliderBaseProps} from '@gravity-ui/uikit';

import type {Control, JsonSchemaObject} from '../../../core';
import {block, getValidationState} from '../../utils';

import './RangeSlider.scss';

const b = block('range-slider');

export interface RangeSliderProps
    extends Omit<SliderBaseProps, 'value' | 'onFocus' | 'onBlur' | 'onChange' | 'onUpdate' | 'qa'> {
    propertyKeys?: [string, string];
}

const Component: Control<JsonSchemaObject, RangeSliderProps> = ({
    controlProps,
    input,
    meta,
    schema,
}) => {
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
        isNaN(Number(input.value?.[fromKey])) || isNaN(Number(input.value?.[toKey]))
            ? undefined
            : [Number(input.value?.[fromKey]), Number(input.value?.[toKey])];
    const defaultValue: [number, number] | undefined =
        isNaN(Number(schema.default?.[fromKey])) || isNaN(Number(schema.default?.[toKey]))
            ? undefined
            : [Number(schema.default?.[fromKey]), Number(schema.default?.[toKey])];

    const onUpdate = React.useCallback(
        (next: number | [number, number]) => {
            if (!Array.isArray(next)) {
                return;
            }

            input.onChange({[fromKey]: next[0], [toKey]: next[1]});
        },
        [fromKey, toKey, input.onChange],
    );

    return (
        <SliderBase
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
            onFocus={input.onFocus}
            onBlur={input.onBlur}
            onUpdate={onUpdate}
            errorMessage={meta.error}
            validationState={getValidationState(meta)}
            qa={input.name}
        />
    );
};

export const RangeSlider = React.memo(Component);
