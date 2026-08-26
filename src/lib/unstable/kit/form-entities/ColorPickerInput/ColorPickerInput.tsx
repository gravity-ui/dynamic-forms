import React from 'react';

import {
    unstable_ColorPicker as ColorPicker,
    type unstable_ColorPickerProps as ColorPickerProps,
} from '@gravity-ui/uikit/unstable';

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
}) => {
    const {name, onBlur, onChange, onFocus, value} = input;
    const {onOpenChange: onOpenChangeProps, ...restEntityProps} = props;

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
        <EntityContainer stretch="max" className={b({error: getBooleanValidationState(meta)})}>
            <ColorPicker
                disabled={schema.readOnly}
                {...restEntityProps}
                value={value ?? ''}
                onUpdate={onChange}
                onOpenChange={onOpenChange}
                data-qa={name}
            />
        </EntityContainer>
    );
};
