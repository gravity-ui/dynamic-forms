import React from 'react';

import {Switch as UIKitSwitch, type SwitchProps as UIKitSwitchProps} from '@gravity-ui/uikit';

import type {JsonSchemaBoolean, NodeEntity} from '../../../core';
import {EntityContainer} from '../../components';
import {block, getBooleanValidationState} from '../../utils';

import './Switch.scss';

const b = block('switch');

export interface SwitchProps
    extends Omit<
        UIKitSwitchProps,
        'checked' | 'onFocus' | 'onBlur' | 'onChange' | 'onUpdate' | 'qa'
    > {}

const SwitchComponent: NodeEntity<JsonSchemaBoolean, SwitchProps> = ({
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
            <UIKitSwitch
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

export const Switch = React.memo(SwitchComponent);
