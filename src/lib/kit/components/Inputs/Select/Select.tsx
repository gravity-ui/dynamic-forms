import React from 'react';

import {Select as SelectBase} from '@gravity-ui/uikit';

import {StringInput} from '../../../../core';
import {block} from '../../../utils';

import './Select.scss';

const b = block('select');

export const Select: StringInput = ({input, spec}) => {
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

    const handleChange = React.useCallback((v: string[]) => onChange(v[0]), [onChange]);

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

    return (
        <SelectBase
            className={b()}
            width="max"
            value={[value]}
            options={options}
            onUpdate={handleChange}
            onOpenChange={handleToggle}
            disabled={spec.viewSpec.disabled}
            placeholder={spec.viewSpec.placeholder}
            filterable={filterable}
        />
    );
};
