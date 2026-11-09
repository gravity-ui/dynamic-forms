import React from 'react';

import {Checkbox, type CheckboxProps} from '@gravity-ui/uikit';

import type {JsonSchemaBoolean, NodeEntity} from '../../../core';
import {EntityContainer} from '../../components';
import {block, getBooleanValidationState} from '../../utils';

import './CheckboxInput.scss';

const b = block('checkbox-input');

export interface CheckboxInputProps
    extends Omit<
        CheckboxProps,
        'checked' | 'onFocus' | 'onBlur' | 'onChange' | 'onUpdate' | 'qa'
    > {}

export const CheckboxInput: NodeEntity<JsonSchemaBoolean, CheckboxInputProps> = ({
    input,
    props,
    meta,
    schema,
    settings,
}) => {
    const {name, onBlur, onChange, onFocus, value} = input;
    const {disabled} = schema.nodeParameters?.flags || {};

    const onUpdate = React.useCallback(
        (value: boolean) => {
            onFocus();
            onChange(value);
            onBlur();
        },
        [onBlur, onChange, onFocus],
    );

    return (
        <EntityContainer
            width="fit"
            className={b({error: getBooleanValidationState(meta), size: settings?.size})}
        >
            <Checkbox
                disabled={disabled || schema.readOnly}
                size={settings?.size === 'xl' ? 'l' : 'm'}
                {...props}
                checked={value ?? false}
                onFocus={onFocus}
                onBlur={onBlur}
                onUpdate={onUpdate}
                qa={name}
            />
        </EntityContainer>
    );
};
