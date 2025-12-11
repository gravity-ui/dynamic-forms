import React from 'react';

import type {NumberInputProps as NumberInputBaseProps} from '@gravity-ui/uikit';
import {NumberInput as CommonNumberInput} from '@gravity-ui/uikit';
import isNil from 'lodash/isNil';

import type {FieldRenderProps, NumberInputProps} from '../../../../core';

export interface NumberProps
    extends Omit<
        NumberInputBaseProps,
        'value' | 'onBlur' | 'onFocus' | 'onUpdate' | 'disabled' | 'placeholder' | 'qa'
    > {}

export const NumInput = <T extends NumberInputProps<NumberProps>>({
    name,
    input: {value, onBlur, onChange, onFocus},
    spec,
    inputProps,
}: T) => {
    const props = {
        hasClear: true,
        ...inputProps,
        value: isNil(value) ? null : Number(value),
        defaultValue: isNil(inputProps?.defaultValue) ? null : Number(inputProps?.defaultValue),
        onBlur: onBlur,
        onFocus: onFocus,
        onUpdate: onChange as FieldRenderProps<number | undefined>['input']['onChange'],
        disabled: spec.viewSpec.disabled,
        placeholder: spec.viewSpec.placeholder,
        qa: name,
    };

    const handleUpdate = (value: number | null) => {
        props.onUpdate(value !== null ? value : undefined);
    };

    return <CommonNumberInput {...props} onUpdate={handleUpdate} allowDecimal />;
};
