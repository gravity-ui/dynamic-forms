import React from 'react';

import {Slider, type SliderProps} from '@gravity-ui/uikit';

import type {JsonSchemaNumber, NodeEntity} from '../../../core';
import {EntityContainer} from '../../components';
import {getValidationState} from '../../utils';

export interface SliderInputProps
    extends Omit<
        SliderProps,
        | 'value'
        | 'onFocus'
        | 'onBlur'
        | 'onChange'
        | 'onUpdate'
        | 'errorMessage'
        | 'validationState'
        | 'qa'
    > {}

export const SliderInput: NodeEntity<JsonSchemaNumber, SliderInputProps> = ({
    input,
    meta,
    props,
    schema,
}) => {
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
        <EntityContainer stretch="max">
            <Slider
                min={schema.minimum}
                max={schema.maximum}
                step={1}
                marks={2}
                disabled={schema.readOnly}
                tooltipDisplay="on"
                {...props}
                value={value}
                onFocus={onFocus}
                onBlur={onBlur}
                onUpdate={onUpdate}
                errorMessage={undefined}
                validationState={getValidationState(meta)}
                qa={name}
            />
        </EntityContainer>
    );
};
