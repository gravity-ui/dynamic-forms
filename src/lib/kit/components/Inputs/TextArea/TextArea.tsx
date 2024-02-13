import React from 'react';

import {TextArea as TextAreaBase, TextAreaProps as TextAreaBaseProps} from '@gravity-ui/uikit';

import {StringInput} from '../../../../core';

export interface TextAreaProps
    extends Omit<
        TextAreaBaseProps,
        'value' | 'onBlur' | 'onFocus' | 'onUpdate' | 'disabled' | 'placeholder' | 'qa'
    > {}

export const TextArea: StringInput<TextAreaProps> = ({name, input, spec, inputProps}) => {
    const {value, onBlur, onChange, onFocus} = input;

    return (
        <TextAreaBase
            maxRows={20}
            minRows={8}
            hasClear
            {...inputProps}
            value={value || ''}
            onBlur={onBlur}
            onFocus={onFocus}
            onUpdate={onChange}
            disabled={spec.viewSpec.disabled}
            placeholder={spec.viewSpec.placeholder}
            qa={name}
        />
    );
};
