import React from 'react';

import type {CheckboxProps as CheckboxBaseProps} from '@gravity-ui/uikit';
import {Checkbox as CheckboxBase} from '@gravity-ui/uikit';

import type {BooleanInput} from '../../../../core';
import {block} from '../../../utils';

import './Checkbox.scss';

const b = block('checkbox');

export interface CheckboxProps
    extends Omit<
        CheckboxBaseProps,
        'checked' | 'onChange' | 'onBlur' | 'onFocus' | 'disabled' | 'qa'
    > {}

export const Checkbox: BooleanInput<CheckboxProps> = ({name, input, spec, inputProps}) => {
    const {value, onBlur, onChange, onFocus} = input;

    const handleChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.checked),
        [onChange],
    );

    return (
        <div className={b()}>
            <CheckboxBase
                {...inputProps}
                checked={value}
                onChange={handleChange}
                onBlur={onBlur}
                onFocus={onFocus}
                disabled={spec.viewSpec.disabled}
                qa={name}
            />
        </div>
    );
};
