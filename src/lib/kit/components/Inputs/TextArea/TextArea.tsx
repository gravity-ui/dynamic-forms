import React from 'react';

import {TextArea as TextAreaBase, TextAreaProps as TextAreaBaseProps} from '@gravity-ui/uikit';

import {StringInput} from '../../../../core';

export const TextArea: StringInput<TextAreaBaseProps> = ({name, input, spec, inputProps}) => {
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
            {...inputProps}
        />
    );
};
