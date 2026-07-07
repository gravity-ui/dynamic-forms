import React from 'react';

import {
    Flex,
    Checkbox as UIKitCheckbox,
    type CheckboxProps as UIKitCheckboxProps,
} from '@gravity-ui/uikit';

import type {Control, JsonSchemaBoolean} from '../../../core';
import {ControlError} from '../../components';
import {block, getValidationState} from '../../utils';

import './Checkbox.scss';

const b = block('checkbox');

export interface CheckboxProps
    extends Omit<
        UIKitCheckboxProps,
        'checked' | 'onFocus' | 'onBlur' | 'onChange' | 'onUpdate' | 'qa'
    > {}

const Component: Control<JsonSchemaBoolean, CheckboxProps> = ({
    controlProps,
    input,
    meta,
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
        <Flex direction="column">
            <div className={b({error: getValidationState(meta)})}>
                <UIKitCheckbox
                    disabled={schema.readOnly}
                    {...controlProps}
                    className={b()}
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

export const Checkbox = React.memo(Component);
