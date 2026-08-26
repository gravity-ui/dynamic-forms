import React from 'react';

import {Switch, type SwitchProps} from '@gravity-ui/uikit';

import type {JsonSchemaBoolean, NodeEntity} from '../../../core';
import {EntityContainer} from '../../components';
import {block, getBooleanValidationState} from '../../utils';

import './SwitchInput.scss';

const b = block('switch-input');

export interface SwitchInputProps
    extends Omit<SwitchProps, 'checked' | 'onFocus' | 'onBlur' | 'onChange' | 'onUpdate' | 'qa'> {}

export const SwitchInput: NodeEntity<JsonSchemaBoolean, SwitchInputProps> = ({
    input,
    meta,
    props,
    schema,
}) => {
    const {name, onBlur, onChange, onFocus, value} = input;

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
            stretch="fit"
            className={b({error: getBooleanValidationState(meta)})}
            justifyContent="center"
        >
            <Switch
                disabled={schema.readOnly}
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
