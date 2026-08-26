import React from 'react';

import {
    PasswordInput as UIKitPasswordInput,
    type PasswordInputProps as UIKitPasswordInputProps,
} from '@gravity-ui/uikit';

import type {JsonSchemaString, NodeEntity} from '../../../core';
import {EntityContainer} from '../../components';
import {block, getBooleanValidationState, getValidationState} from '../../utils';

import './PasswordInput.scss';

const b = block('password-input');

export interface PasswordInputProps
    extends Omit<
        UIKitPasswordInputProps,
        | 'value'
        | 'onFocus'
        | 'onBlur'
        | 'onChange'
        | 'onUpdate'
        | 'errorMessage'
        | 'validationState'
        | 'qa'
    > {}

export const PasswordInput: NodeEntity<JsonSchemaString, PasswordInputProps> = ({
    input,
    meta,
    props,
    schema,
}) => {
    const {name, onBlur, onChange, onFocus, value} = input;

    return (
        <EntityContainer stretch="max" className={b({error: getBooleanValidationState(meta)})}>
            <UIKitPasswordInput
                autoComplete="new-password"
                placeholder={schema.examples?.[0]}
                disabled={schema.readOnly}
                hasClear
                {...props}
                value={value ?? ''}
                onFocus={onFocus}
                onBlur={onBlur}
                onUpdate={onChange}
                errorMessage={undefined}
                validationState={getValidationState(meta)}
                qa={name}
            />
        </EntityContainer>
    );
};
