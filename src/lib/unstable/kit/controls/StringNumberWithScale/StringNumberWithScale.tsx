import React from 'react';

import {Select, TextInput, type TextInputProps} from '@gravity-ui/uikit';
import Decimal from 'decimal.js';

import type {Control, JsonSchemaString} from '../../../core';
import {ControlContainer} from '../../components';
import {block, getBooleanValidationState, getValidationState, isStringNumber} from '../../utils';

import './StringNumberWithScale.scss';

const b = block('string-number-with-scale');

export interface StringNumberWithScaleProps
    extends Omit<
        TextInputProps,
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
    scale?: Record<string, {title: string; factor: string}>;
}

const Component: Control<JsonSchemaString, StringNumberWithScaleProps> = ({
    controlProps,
    input,
    meta,
    schema,
}) => {
    const {name, onBlur, onChange, onFocus, value: inputValue} = input;
    const {defaultType, viewType, scale, ...restControlProps} = controlProps;

    const scaleKit = React.useMemo(() => {
        if (scale) {
            const preparedScale: Record<string, {title: string; factor: string}> = {};
            let minScaleLength = 0;

            Object.entries(scale).forEach(([key, value]) => {
                if (isStringNumber(value.factor)) {
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
            max: isStringNumber(schema.stringNumber?.maximum)
                ? schema.stringNumber?.maximum
                : undefined,
            min: isStringNumber(schema.stringNumber?.minimum)
                ? schema.stringNumber?.minimum
                : undefined,
            step: isStringNumber(schema.stringNumber?.multipleOf)
                ? schema.stringNumber?.multipleOf
                : '1',
            defaultValue: isStringNumber(schema.default) ? schema.default : undefined,
            value: inputValue || '',
            onUpdate: onChange,
        };

        if (factor) {
            return {
                max: result.max ? new Decimal(result.max).div(factor).toString() : undefined,
                min: result.min ? new Decimal(result.min).div(factor).toString() : undefined,
                step: new Decimal(result.step).div(factor).toString(),
                defaultValue: result.defaultValue
                    ? new Decimal(result.defaultValue).div(factor).toString()
                    : undefined,
                value: isStringNumber(result.value)
                    ? new Decimal(result.value).div(factor).toString()
                    : result.value,
                onUpdate: (value) =>
                    onChange(
                        isStringNumber(value) ? new Decimal(value).mul(factor).toString() : value,
                    ),
            };
        }

        return result;
    }, [inputValue, onChange, scaleKit?.scale, scaleValue, schema]);

    return (
        <ControlContainer
            stretch="max"
            className={b({error: getBooleanValidationState(meta)})}
            direction="row"
            gap={2}
        >
            <div className={b('input')}>
                <TextInput
                    placeholder={`${schema.examples?.[0] || ''}`}
                    disabled={schema.readOnly}
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
                        disabled={schema.readOnly || meta.error}
                        qa={`${name}-scale`}
                    />
                </div>
            ) : null}
        </ControlContainer>
    );
};

export const StringNumberWithScale = React.memo(Component);
