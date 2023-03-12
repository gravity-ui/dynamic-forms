import React from 'react';

import {Checkbox as CheckboxBase} from '@gravity-ui/uikit';

import {BooleanInput} from '../../../../core';
import {block} from '../../../utils';

import './Checkbox.scss';

const b = block('checkbox');

export const Checkbox: BooleanInput = ({input, spec}) => {
    const {value, onBlur, onChange, onFocus} = input;

    const handleChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.checked),
        [onChange],
    );

    return (
        <div className={b()}>
            <CheckboxBase
                checked={value}
                onChange={handleChange}
                onBlur={onBlur}
                onFocus={onFocus}
                disabled={spec.viewSpec.disabled}
            />
        </div>
    );
};
