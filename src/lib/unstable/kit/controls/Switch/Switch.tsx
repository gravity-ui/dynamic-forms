import React from 'react';

import {Flex, Switch as UIKitSwitch, type SwitchProps as UIKitSwitchProps} from '@gravity-ui/uikit';

import type {Control, JsonSchemaBoolean} from '../../../core';
import {ControlError} from '../../components';
import {block, getValidationState} from '../../utils';

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
        <Flex direction="column">
            <div className={b({error: getValidationState(meta)})}>
                <UIKitSwitch
                    disabled={schema.readOnly}
                    {...controlProps}
                    checked={value ?? false}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onUpdate={onUpdate}
                    qa={name}
                />
            </div>
            <ControlError errorMessage={meta.error} validationState={getValidationState(meta)} />
        </Flex>
    );
};

export const Switch = React.memo(Component);
