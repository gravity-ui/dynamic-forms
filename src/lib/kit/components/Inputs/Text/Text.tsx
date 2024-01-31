import React from 'react';

import {PasswordInput} from '@gravity-ui/components';
import {TextInput, TextInputProps as TextInputBaseProps} from '@gravity-ui/uikit';
import _ from 'lodash';

import {FieldRenderProps, NumberInputProps, StringInputProps} from '../../../../core';

export const Text = <
    T extends NumberInputProps<TextInputBaseProps> | StringInputProps<TextInputBaseProps>,
>({
    name,
    input: {value, onBlur, onChange, onFocus},
    spec,
    inputProps,
}: T) => {
    const props = {
        value: _.isNil(value) ? '' : `${value}`,
        hasClear: true,
        onBlur: onBlur,
        onFocus: onFocus,
        onUpdate: onChange as FieldRenderProps<string>['input']['onChange'],
        disabled: spec.viewSpec.disabled,
        placeholder: spec.viewSpec.placeholder,
        qa: name,
        ...inputProps,
    };

    if (spec.viewSpec.type === 'password') {
        return (
            <PasswordInput {...props} autoComplete="new-password" showCopyButton showRevealButton />
        );
    }

    return <TextInput {...props} type="text" />;
};
