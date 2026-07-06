import React from 'react';

import {Flex} from '@gravity-ui/uikit';
import {
    unstable_ColorPicker as UIKitColorPicker,
    type unstable_ColorPickerProps as UIKitColorPickerProps,
} from '@gravity-ui/uikit/unstable';

import type {Control, JsonSchemaString} from '../../../core';
import {ControlError} from '../../components';
import {block, getValidationState} from '../../utils';

import './ColorPicker.scss';

const b = block('color-picker');

export interface ColorPickerProps extends Omit<UIKitColorPickerProps, 'value' | 'onUpdate'> {}

const Component: Control<JsonSchemaString, ColorPickerProps> = ({
    controlProps,
    input,
    meta,
    schema,
}) => {
    const {name, onBlur, onChange, onFocus, value} = input;
    const {onOpenChange: onOpenChangeProps, ...restControlProps} = controlProps;

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
        <Flex className={b({error: getValidationState(meta)})} direction="column">
            <UIKitColorPicker
                disabled={schema.readOnly}
                {...restControlProps}
                value={value ?? ''}
                onUpdate={onChange}
                onOpenChange={onOpenChange}
                data-qa={name}
            />
            <ControlError errorMessage={meta.error} validationState={getValidationState(meta)} />
        </Flex>
    );
};

export const ColorPicker = React.memo(Component);
