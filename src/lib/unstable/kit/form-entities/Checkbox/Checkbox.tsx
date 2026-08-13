import React from 'react';

import {
    Checkbox as UIKitCheckbox,
    type CheckboxProps as UIKitCheckboxProps,
} from '@gravity-ui/uikit';

import type {JsonSchemaBoolean, NodeEntity} from '../../../core';
import {EntityContainer} from '../../components';
import {block, getBooleanValidationState} from '../../utils';

import './Checkbox.scss';

const b = block('checkbox');

export interface CheckboxProps
    extends Omit<
        UIKitCheckboxProps,
        'checked' | 'onFocus' | 'onBlur' | 'onChange' | 'onUpdate' | 'qa'
    > {}

const CheckboxComponent: NodeEntity<JsonSchemaBoolean, CheckboxProps> = ({
    input,
    props,
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
        <EntityContainer stretch="fit" className={b({error: getBooleanValidationState(meta)})}>
            <UIKitCheckbox
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

export const Checkbox = React.memo(CheckboxComponent);
