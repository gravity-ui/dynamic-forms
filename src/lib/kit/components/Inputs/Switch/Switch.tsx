import React from 'react';

import {Switch as SwitchBase} from '@gravity-ui/uikit';

import type {BooleanInput} from '../../../../core';
import {block} from '../../../utils';

import './Switch.scss';

const b = block('switch');

export const Switch: BooleanInput = ({name, input, spec}) => {
    const {value, onBlur, onChange, onFocus} = input;

    const handleChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.checked),
        [onChange],
    );

    return (
        <SwitchBase
            checked={value}
            onChange={handleChange}
            onBlur={onBlur}
            onFocus={onFocus}
            disabled={spec.viewSpec.disabled}
            className={b()}
            qa={name}
        />
    );
};
