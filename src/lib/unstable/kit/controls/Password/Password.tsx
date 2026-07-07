import React from 'react';

import {PasswordInput, type PasswordInputProps} from '@gravity-ui/uikit';

import type {Control, JsonSchemaString} from '../../../core';
import {getValidationState} from '../../utils';

export interface PasswordProps
    extends Omit<
        PasswordInputProps,
        | 'value'
        | 'onFocus'
        | 'onBlur'
        | 'onChange'
        | 'onUpdate'
        | 'errorMessage'
        | 'validationState'
        | 'placeholder'
        | 'qa'
    > {}

const Component: Control<JsonSchemaString, PasswordProps> = ({
    controlProps,
    input,
    meta,
    schema,
}) => {
    const {name, onBlur, onChange, onFocus, value} = input;

    return (
        <PasswordInput
            autoComplete="new-password"
            hasClear
            disabled={schema.readOnly}
            {...controlProps}
            value={value ?? ''}
            onFocus={onFocus}
            onBlur={onBlur}
            onUpdate={onChange}
            errorMessage={meta.error}
            validationState={getValidationState(meta)}
            placeholder={schema.examples?.[0]}
            qa={name}
        />
    );
};

export const Password = React.memo(Component);
