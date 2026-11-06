import React from 'react';

import {Select, TextInput} from '@gravity-ui/uikit';

import type {StringInputProps} from '../../../../core';
import {block, divide, isCorrectSizeParams, multiply} from '../../../utils';

import {useInitial} from './useInitial';

import './NumberWithScale.scss';

const b = block('number-with-scale');

const NumberWithScaleBase: React.FC<StringInputProps> = ({name, input, spec}) => {
    const {value = '', onBlur, onFocus, onChange} = input;
    const {sizeParams, disabled, placeholder} = spec.viewSpec;
    const {defaultType, scale} = sizeParams!;
    const {initialValue, initialType} = useInitial(value || '', spec);

    const [scaleValue, setScaleValue] = React.useState(initialType);
    const [preparedValue, setPreparedValue] = React.useState(initialValue);

    const scaleOptions = React.useMemo(
        () =>
            Object.keys(scale)
                .sort((a, b) => (BigInt(scale[a].factor) > BigInt(scale[b].factor) ? 0 : -1))
                .map((type) => ({
                    value: type,
                    content: scale[type].title,
                })),
        [scale],
    );

    const incorrectStringNumber = React.useMemo(
        () => (value !== '' && value !== '0' ? divide(value, value) === null : false),
        [value],
    );

    const handleChange = React.useCallback(
        (value: string) => {
            let _value: string | null = value;

            if (value !== '') {
                if (scaleValue !== defaultType) {
                    const cur = scale[scaleValue].factor;
                    const def = scale[defaultType].factor;

                    if (BigInt(cur) > BigInt(def)) {
                        _value = multiply(value, divide(cur, def)!, 2);
                    } else {
                        _value = divide(value, divide(def, cur)!, 2);
                    }
                } else {
                    _value = multiply(value, '1');
                }
            }

            setPreparedValue(value);
            onChange(_value === null ? value : _value);
        },
        [onChange, setPreparedValue, scaleValue, defaultType, scale],
    );

    const handleScaleChange = React.useCallback(
        ([valueSelect]: string[]) => {
            if (!incorrectStringNumber) {
                if (value !== '') {
                    if (valueSelect !== defaultType) {
                        const next = scale[valueSelect].factor;
                        const def = scale[defaultType].factor;
                        let _value;

                        if (BigInt(next) > BigInt(def)) {
                            _value = divide(value, divide(next, def)!, 2);
                        } else {
                            _value = multiply(value, divide(def, next)!, 2);
                        }

                        setPreparedValue(_value === null ? value : _value);
                    } else {
                        setPreparedValue(value);
                    }
                }

                setScaleValue(valueSelect);
            }
        },
        [setPreparedValue, setScaleValue, incorrectStringNumber, value, scale, defaultType],
    );

    return (
        <div className={b('wrapper')}>
            <TextInput
                value={preparedValue}
                onBlur={onBlur}
                onFocus={onFocus}
                onUpdate={handleChange}
                placeholder={placeholder}
                disabled={disabled}
                qa={name}
            />
            <Select
                width="max"
                className={b('select', 'df-error-wrapper-ignore')}
                value={[scaleValue]}
                options={scaleOptions}
                onUpdate={handleScaleChange}
                disabled={disabled || incorrectStringNumber}
                qa={`${name}-scale`}
            />
        </div>
    );
};

export const NumberWithScale: React.FC<StringInputProps> = (props) =>
    isCorrectSizeParams(props.spec) ? <NumberWithScaleBase {...props} /> : null;
