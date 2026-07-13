import React from 'react';

import {NumberInput, type NumberInputProps, Select} from '@gravity-ui/uikit';
import isNumber from 'lodash/isNumber';

import type {Control, JsonSchemaNumber} from '../../../core';
import {ControlContainer} from '../../components';
import {block, getBooleanValidationState, getValidationState} from '../../utils';

import './NumberWithScale.scss';

const b = block('number-with-scale');

export interface NumberWithScaleProps
    extends Omit<
        NumberInputProps,
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
    defaultType?: string;
    viewType?: string;
    scale?: Record<string, {title: string; factor: number}>;
}

const Component: Control<JsonSchemaNumber, NumberWithScaleProps> = ({
    controlProps,
    input,
    meta,
    schema,
}) => {
    const {name, onBlur, onChange, onFocus, value: inputValue} = input;
    const {defaultType, viewType, scale, max, min, step, ...restControlProps} = controlProps;

    const scaleKit = React.useMemo(() => {
        if (scale) {
            const preparedScale: Record<string, {title: string; factor: number}> = {};
            let minScaleLength = 0;

            Object.entries(scale).forEach(([key, value]) => {
                if (isNumber(value.factor)) {
                    preparedScale[key] = value;

                    if ((value.title || key).length * 12 > minScaleLength) {
                        minScaleLength = (value.title || key).length * 12;
                    }
                }
            });

            if (defaultType && preparedScale[defaultType]) {
                return {
                    scale: preparedScale,
                    defaultType,
                    viewType: viewType && preparedScale[viewType] ? [viewType] : [defaultType],
                    minScaleLength: `${minScaleLength + 42}px`,
                };
            }
        }

        return null;
    }, [defaultType, viewType, scale]);

    const [scaleValue, setScaleValue] = React.useState(scaleKit?.viewType || []);

    const scaleOptions = React.useMemo(() => {
        return Object.entries(scaleKit?.scale || {}).map(([key, value]) => ({
            value: key,
            content: value.title || key,
        }));
    }, [scaleKit?.scale]);

    const preparedInputProps = React.useMemo(() => {
        const factor = scaleKit?.scale?.[scaleValue[0]]?.factor;

        const result = {
            max: max || schema.maximum,
            min: min || schema.minimum,
            step: step || schema.multipleOf || 1,
            defaultValue: schema.default,
            value: inputValue,
            onUpdate: onChange,
        };

        if (factor) {
            return {
                max: result.max ? result.max / factor : result.max,
                min: result.min ? result.min / factor : result.min,
                step: result.step / factor,
                defaultValue: result.defaultValue
                    ? result.defaultValue / factor
                    : result.defaultValue,
                value: result.value ? result.value / factor : result.value,
                onUpdate: (value) => onChange(value ? value * factor : value),
            };
        }

        return result;
    }, [max, min, step, inputValue, onChange, scaleKit?.scale, scaleValue, schema]);

    return (
        <ControlContainer
            stretch="max"
            className={b({error: getBooleanValidationState(meta)})}
            direction="row"
            gap={2}
        >
            <div className={b('input')}>
                <NumberInput
                    placeholder={`${schema.examples?.[0] || ''}`}
                    disabled={schema.readOnly}
                    allowDecimal
                    hasClear
                    {...restControlProps}
                    {...preparedInputProps}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    errorMessage={undefined}
                    validationState={getValidationState(meta)}
                    qa={name}
                />
            </div>
            {scaleOptions.length ? (
                <div style={{width: scaleKit?.minScaleLength}}>
                    <Select
                        width="max"
                        options={scaleOptions}
                        value={scaleValue}
                        onUpdate={setScaleValue}
                        multiple={false}
                    />
                </div>
            ) : null}
        </ControlContainer>
    );
};

export const NumberWithScale = React.memo(Component);
