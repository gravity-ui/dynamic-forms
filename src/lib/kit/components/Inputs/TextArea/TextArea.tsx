import React from 'react';

import {TextArea as TextAreaBase} from '@gravity-ui/uikit';

import {StringInput} from '../../../../core';

export const TextArea: StringInput = ({name, input, spec}) => {
    const {value, onBlur, onChange, onFocus} = input;

    return (
        <TextAreaBase
            value={value || ''}
            onBlur={onBlur}
            onFocus={onFocus}
            onUpdate={onChange}
            maxRows={20}
            minRows={8}
            hasClear
            disabled={spec.viewSpec.disabled}
            placeholder={spec.viewSpec.placeholder}
            qa={name}
        />
    );
};
