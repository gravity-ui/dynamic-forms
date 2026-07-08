import React from 'react';

import {Slider as UIKitSlider, type SliderProps as UIKitSliderProps} from '@gravity-ui/uikit';

import type {Control, JsonSchemaNumber} from '../../../core';
import {ControlContainer} from '../../components';
import {getValidationState} from '../../utils';

export interface SliderProps
    extends Omit<
        UIKitSliderProps,
        | 'value'
        | 'onFocus'
        | 'onBlur'
        | 'onChange'
        | 'onUpdate'
        | 'errorMessage'
        | 'validationState'
        | 'qa'
    > {}

const Component: Control<JsonSchemaNumber, SliderProps> = ({controlProps, input, meta, schema}) => {
    const {name, onBlur, onChange, onFocus, value: inputValue} = input;

    const value = isNaN(Number(inputValue)) ? undefined : Number(inputValue);

    const onUpdate = React.useCallback(
        (next: number | [number, number]) => {
            if (Array.isArray(next)) {
                return;
            }

            onChange(next);
        },
        [onChange],
    );

    return (
        <ControlContainer stretch="max">
            <UIKitSlider
                min={schema.minimum}
                max={schema.maximum}
                step={1}
                marks={2}
                disabled={schema.readOnly}
                tooltipDisplay="on"
                {...controlProps}
                value={value}
                onFocus={onFocus}
                onBlur={onBlur}
                onUpdate={onUpdate}
                errorMessage={undefined}
                validationState={getValidationState(meta)}
                qa={name}
            />
        </ControlContainer>
    );
};

export const Slider = React.memo(Component);
