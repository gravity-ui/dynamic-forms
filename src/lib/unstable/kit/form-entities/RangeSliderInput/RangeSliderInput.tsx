import React from 'react';

import {Slider, type SliderProps} from '@gravity-ui/uikit';

import type {JsonSchemaObject, NodeEntity} from '../../../core';
import {EntityContainer} from '../../components';
import {getValidationState} from '../../utils';

export interface RangeSliderInputProps
    extends Omit<
        SliderProps,
        | 'defaultValue'
        | 'value'
        | 'onFocus'
        | 'onBlur'
        | 'onChange'
        | 'onUpdate'
        | 'errorMessage'
        | 'validationState'
        | 'qa'
    > {
    propertyKeys?: [string, string];
}

export const RangeSliderInput: NodeEntity<JsonSchemaObject, RangeSliderInputProps> = ({
    input,
    meta,
    props,
    schema,
}) => {
    const {name, onBlur, onChange, onFocus, value: inputValue} = input;
    const {propertyKeys, ...restEntityProps} = props;

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
        <EntityContainer stretch="max">
            <Slider
                min={min}
                max={max}
                step={1}
                marks={2}
                disabled={schema.readOnly}
                tooltipDisplay="on"
                {...restEntityProps}
                defaultValue={defaultValue}
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
