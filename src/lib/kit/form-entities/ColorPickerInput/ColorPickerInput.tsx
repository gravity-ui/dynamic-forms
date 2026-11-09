import React from 'react';

import {ColorPicker, type ColorPickerProps} from '@gravity-ui/uikit';

import type {JsonSchemaString, NodeEntity} from '../../../core';
import {EntityContainer} from '../../components';
import {block, getBooleanValidationState} from '../../utils';

import './ColorPickerInput.scss';

const b = block('color-picker-input');

export interface ColorPickerInputProps extends Omit<ColorPickerProps, 'value' | 'onUpdate'> {}

export const ColorPickerInput: NodeEntity<JsonSchemaString, ColorPickerInputProps> = ({
    input,
    props,
    meta,
    schema,
    settings,
}) => {
    const {name, onBlur, onChange, onFocus, value} = input;
    const {onOpenChange: onOpenChangeProps, ...restEntityProps} = props;
    const {disabled} = schema.nodeParameters?.flags || {};

    const onOpenChange = React.useCallback(
        (open: boolean) => {
            onOpenChangeProps?.(open);

            if (open) {
                onFocus();
            } else {
                onBlur();
            }
        },
        [onBlur, onFocus, onOpenChangeProps],
    );

    return (
        <EntityContainer width="max" className={b({error: getBooleanValidationState(meta)})}>
            <ColorPicker
                disabled={disabled || schema.readOnly}
                size={settings?.size}
                {...restEntityProps}
                value={value ?? ''}
                onUpdate={onChange}
                onOpenChange={onOpenChange}
                data-qa={name}
            />
        </EntityContainer>
    );
};
