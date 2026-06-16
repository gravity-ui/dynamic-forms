import React from 'react';

import {Slider as SliderBase, type SliderProps as SliderBaseProps} from '@gravity-ui/uikit';

import type {Control, JsonSchemaNumber} from '../../../core';
import {block, getValidationState} from '../../utils';

import './Slider.scss';

const b = block('slider');

export interface SliderProps
    extends Omit<
        SliderBaseProps,
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
    const value = isNaN(Number(input.value)) ? undefined : Number(input.value);

    const onUpdate = React.useCallback(
        (next: number | [number, number]) => {
            if (Array.isArray(next)) {
                return;
            }

            input.onChange(next);
        },
        [input.onChange],
    );

    return (
        <SliderBase
            className={b()}
            min={schema.minimum}
            max={schema.maximum}
            step={1}
            marks={2}
            disabled={schema.readOnly}
            tooltipDisplay="on"
            {...controlProps}
            value={value}
            onFocus={input.onFocus}
            onBlur={input.onBlur}
            onUpdate={onUpdate}
            errorMessage={meta.error}
            validationState={getValidationState(meta)}
            qa={`${input.name}`}
        />
    );
};

export const Slider = React.memo(Component);
