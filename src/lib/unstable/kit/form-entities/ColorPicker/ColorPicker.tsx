import React from 'react';

import {
    unstable_ColorPicker as UIKitColorPicker,
    type unstable_ColorPickerProps as UIKitColorPickerProps,
} from '@gravity-ui/uikit/unstable';

import type {JsonSchemaString, NodeEntity} from '../../../core';
import {EntityContainer} from '../../components';
import {block, getBooleanValidationState} from '../../utils';

import './ColorPicker.scss';

const b = block('color-picker');

export interface ColorPickerProps extends Omit<UIKitColorPickerProps, 'value' | 'onUpdate'> {}

const ColorPickerComponent: NodeEntity<JsonSchemaString, ColorPickerProps> = ({
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
            <UIKitColorPicker
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

export const ColorPicker = React.memo(ColorPickerComponent);
