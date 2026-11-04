import React from 'react';

import type {TextAreaProps as TextAreaBaseProps} from '@gravity-ui/uikit';
import {TextArea as TextAreaBase} from '@gravity-ui/uikit';

import type {StringInput} from '../../../../core';
import {getQaBase} from '../../../utils/qa';

export interface TextAreaProps
    extends Omit<
        TextAreaBaseProps,
        'value' | 'onBlur' | 'onFocus' | 'onUpdate' | 'disabled' | 'placeholder' | 'qa'
    > {}

export const TextArea: StringInput<TextAreaProps> = ({name, input, spec, inputProps}) => {
    const {value, onBlur, onChange, onFocus} = input;
    const qaBase = getQaBase(name, spec);

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
            qa={qaBase}
        />
    );
};
