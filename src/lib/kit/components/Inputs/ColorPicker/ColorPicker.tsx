import React from 'react';

import {unstable_ColorPicker as ColorPickerBase} from '@gravity-ui/uikit/unstable';

import type {StringInput} from '../../../../core';

export interface ColorPickerProps
    extends Omit<React.ComponentProps<typeof ColorPickerBase>, 'value' | 'onUpdate' | 'disabled'> {}

export const ColorPicker: StringInput<ColorPickerProps> = ({input, spec, inputProps}) => {
    const {value, onChange, onBlur, onFocus} = input;

    const handleOpenChange = React.useCallback(
        (open: boolean) => {
            inputProps?.onOpenChange?.(open);

            if (open) {
                onFocus();
            } else {
                onBlur();
            }
        },
        [inputProps, onBlur, onFocus],
    );

    const colorPickerProps = spec.viewSpec.colorPicker as React.ComponentProps<
        typeof ColorPickerBase
    >;

    return (
        <ColorPickerBase
            {...colorPickerProps}
            {...inputProps}
            value={value || ''}
            onUpdate={onChange}
            onOpenChange={handleOpenChange}
            disabled={spec.viewSpec.disabled}
        />
    );
};
