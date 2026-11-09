import React from 'react';

import {unstable_ColorPicker as ColorPickerBase} from '@gravity-ui/uikit/unstable';

import type {StringInput} from '../../../../core';

/**
 * Props forwarded to the underlying `unstable_ColorPicker` from `@gravity-ui/uikit/unstable`.
 *
 * NOTE: The underlying uikit component is marked as **unstable** — its API and behavior
 * may change in future uikit releases without following semver. Use with that in mind.
 *
 * @see https://preview.gravity-ui.com/uikit/?path=/docs/lab-colorpicker--docs
 */
export interface ColorPickerProps
    extends Omit<React.ComponentProps<typeof ColorPickerBase>, 'value' | 'onUpdate' | 'disabled'> {}

/**
 * Dynamic-forms input that renders a color picker for `StringSpec`.
 *
 * Wraps `unstable_ColorPicker` from `@gravity-ui/uikit/unstable`. Because the underlying
 * uikit component is **unstable**, the visual appearance, available `inputProps`, and
 * supported color formats may change between uikit releases.
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
