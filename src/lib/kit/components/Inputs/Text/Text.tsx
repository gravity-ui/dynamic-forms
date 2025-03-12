import React from 'react';

import type {TextInputProps as TextInputBaseProps} from '@gravity-ui/uikit';
import {PasswordInput, TextInput} from '@gravity-ui/uikit';
import isNil from 'lodash/isNil';

import type {FieldRenderProps, NumberInputProps, StringInputProps} from '../../../../core';

export interface TextProps
    extends Omit<
        TextInputBaseProps,
        'value' | 'onBlur' | 'onFocus' | 'onUpdate' | 'disabled' | 'placeholder' | 'qa'
    > {}

export const Text = <T extends NumberInputProps<TextProps> | StringInputProps<TextProps>>({
    name,
    input: {value, onBlur, onChange, onFocus},
    spec,
    inputProps,
}: T) => {
    const props = {
        hasClear: true,
        ...inputProps,
        value: isNil(value) ? '' : `${value}`,
        onBlur: onBlur,
        onFocus: onFocus,
        onUpdate: onChange as FieldRenderProps<string>['input']['onChange'],
        disabled: spec.viewSpec.disabled,
        placeholder: spec.viewSpec.placeholder,
        qa: name,
    };

    if (spec.viewSpec.type === 'password') {
        return <PasswordInput {...props} autoComplete="new-password" />;
    }

    return <TextInput {...props} type="text" />;
};
