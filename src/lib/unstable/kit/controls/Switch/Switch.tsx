import React from 'react';

import {Switch as UIKitSwitch, type SwitchProps as UIKitSwitchProps} from '@gravity-ui/uikit';

import type {Control, JsonSchemaBoolean} from '../../../core';
import {ControlContainer} from '../../components';
import {block, getBooleanValidationState} from '../../utils';

import './Switch.scss';

const b = block('switch');

export interface SwitchProps
    extends Omit<
        UIKitSwitchProps,
        'checked' | 'onFocus' | 'onBlur' | 'onChange' | 'onUpdate' | 'qa'
    > {}

const Component: Control<JsonSchemaBoolean, SwitchProps> = ({
    controlProps,
    input,
    schema,
    meta,
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
        <ControlContainer
            stretch="fit"
            className={b({error: getBooleanValidationState(meta)})}
            justifyContent="center"
        >
            <UIKitSwitch
                disabled={schema.readOnly}
                {...controlProps}
                checked={value ?? false}
                onFocus={onFocus}
                onBlur={onBlur}
                onUpdate={onUpdate}
                qa={name}
            />
        </ControlContainer>
    );
};

export const Switch = React.memo(Component);
