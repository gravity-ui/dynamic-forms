import React from 'react';

import {Select} from '@gravity-ui/uikit';

import {ArrayInput, FieldArrayValue, transformArrIn, transformArrOut} from '../../../../core';
import {block} from '../../../utils';

import './MultiSelect.scss';

const b = block('multi-select');

export const MultiSelect: ArrayInput = ({input, spec}) => {
    const {value, onBlur, onChange, onFocus} = input;

    const filterable = React.useMemo(() => (spec.enum?.length || 0) > 9, [spec.enum?.length]);

    const options = React.useMemo(
        () =>
            spec.enum?.map((id) => ({
                id,
                value: id,
                content: spec.description?.[id] || id,
                key: id,
            })),
        [spec.enum, spec.description],
    );

    const handleToggle = React.useCallback(
        (open: boolean) => {
            if (open) {
                onFocus();
            } else {
                onBlur();
            }
        },
        [onFocus, onBlur],
    );

    const _value = React.useMemo(() => transformArrOut<FieldArrayValue, string[]>(value), [value]);

    const handleChange = React.useCallback(
        (value: string[]) => onChange(transformArrIn<string[], FieldArrayValue>(value)),
        [onChange],
    );

    return (
        <Select
            width="max"
            className={b()}
            value={_value}
            options={options}
            onUpdate={handleChange}
            onOpenChange={handleToggle}
            disabled={spec.viewSpec.disabled}
            placeholder={spec.viewSpec.placeholder}
            filterable={filterable}
            multiple
        />
    );
};
