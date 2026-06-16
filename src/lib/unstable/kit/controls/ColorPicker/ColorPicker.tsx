import React from 'react';

import {
    unstable_ColorPicker as ColorPickerBase,
    type unstable_ColorPickerProps as ColorPickerBaseProps,
} from '@gravity-ui/uikit/unstable';

import type {Control, JsonSchemaString} from '../../../core';
import {ControlError} from '../../components';
import {getValidationState} from '../../utils';

export interface ColorPickerProps extends Omit<ColorPickerBaseProps, 'value' | 'onUpdate'> {}

const Component: Control<JsonSchemaString, ColorPickerProps> = ({
    controlProps,
    input,
    meta,
    schema,
}) => {
    const {onOpenChange: onOpenChangeProps, ...restControlProps} = controlProps;

    const onOpenChange = React.useCallback(
        (open: boolean) => {
            onOpenChangeProps?.(open);

            if (open) {
                input.onFocus();
            } else {
                input.onBlur();
            }
        },
        [input.onBlur, input.onFocus, onOpenChangeProps],
    );

    return (
        <ControlError errorMessage={meta.error} validationState={getValidationState(meta)}>
            <ColorPickerBase
                disabled={schema.readOnly}
                {...restControlProps}
                value={input.value ?? ''}
                onUpdate={input.onChange}
                onOpenChange={onOpenChange}
            />
        </ControlError>
    );
};

export const ColorPicker = React.memo(Component);
