import React from 'react';

import {TextInput as TextInputBase} from '@gravity-ui/uikit';

import {StringInput} from '../../../../core';

export const TextArea: StringInput = ({input, spec}) => {
    const {value, onBlur, onChange, onFocus} = input;

    return (
        <TextInputBase
            value={value}
            onBlur={onBlur}
            onFocus={onFocus}
            onUpdate={onChange}
            maxRows={20}
            minRows={8}
            hasClear
            disabled={spec.viewSpec.disabled}
            multiline
            placeholder={spec.viewSpec.placeholder}
        />
    );
};
