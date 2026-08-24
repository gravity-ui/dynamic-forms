import React from 'react';

import {PasswordInput, type PasswordInputProps} from '@gravity-ui/uikit';

import type {JsonSchemaString, NodeEntity} from '../../../core';
import {EntityContainer} from '../../components';
import {block, getBooleanValidationState, getValidationState} from '../../utils';

import './Password.scss';

const b = block('password');

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
        | 'qa'
    > {}

const PasswordComponent: NodeEntity<JsonSchemaString, PasswordProps> = ({
    input,
    meta,
    props,
    schema,
}) => {
    const {name, onBlur, onChange, onFocus, value} = input;

    return (
        <EntityContainer stretch="max" className={b({error: getBooleanValidationState(meta)})}>
            <PasswordInput
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

export const Password = React.memo(PasswordComponent);
