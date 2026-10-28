import React from 'react';

import {ColorPicker as ColorPickerBase} from '@gravity-ui/uikit';

import type {StringInput} from '../../../../core';

/**
 * Props forwarded to the underlying `ColorPicker` from `@gravity-ui/uikit`.
 */
export interface ColorPickerProps
    extends Omit<React.ComponentProps<typeof ColorPickerBase>, 'value' | 'onUpdate' | 'disabled'> {}

/**
 * Dynamic-forms input that renders a color picker for `StringSpec`.
 */
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

    return (
        <ColorPickerBase
            {...inputProps}
            value={value || ''}
            onUpdate={onChange}
            onOpenChange={handleOpenChange}
            disabled={spec.viewSpec.disabled}
        />
    );
};
