import React from 'react';

import {
    PasswordInput,
    TextInput,
    type TextInputProps as TextInputBaseProps,
} from '@gravity-ui/uikit';
import isNil from 'lodash/isNil';

import type {JsonSchemaNumber, JsonSchemaString, SimpleViewProps} from '../core/types';

export interface TextProps
    extends Omit<
        TextInputBaseProps,
        'value' | 'onBlur' | 'onFocus' | 'onUpdate' | 'disabled' | 'placeholder' | 'qa'
    > {}

const Component = <
    T extends
        | SimpleViewProps<JsonSchemaNumber, TextProps>
        | SimpleViewProps<JsonSchemaString, TextProps>,
>({
    input,
    meta,
    schema,
}: T) => {
    const props: TextInputBaseProps = {
        hasClear: true,
        // ...inputProps,
        value: isNil(input.value) ? '' : `${input.value}`,
        onBlur: input.onBlur,
        onFocus: input.onFocus,
        onUpdate: input.onChange,
        // disabled: spec.viewSpec.disabled,
        disabled: schema.readOnly,
        // placeholder: spec.viewSpec.placeholder,
        placeholder: `${schema.examples?.[0]}`,
        qa: input.name,
        error: meta.error,
        // errorMessage: meta.error,
    };

    // if (spec.viewSpec.type === 'password') {
    if (schema.entityParameters?.viewType === 'password') {
        return <PasswordInput {...props} autoComplete="new-password" />;
    }

    return <TextInput {...props} type="text" />;
};

export const Text = React.memo(Component);
