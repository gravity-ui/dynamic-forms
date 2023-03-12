import React from 'react';

import {TextInput} from '@gravity-ui/uikit';
import _ from 'lodash';

import {FieldRenderProps, NumberInputProps, StringInputProps} from '../../../../core';

export const Text = <T extends NumberInputProps | StringInputProps>({input, spec}: T) => {
    const {value, onBlur, onChange, onFocus} = input;

    const handleChange = React.useCallback(
        (value: string) => {
            (onChange as FieldRenderProps<string>['input']['onChange'])(value);
        },
        [onChange, spec],
    );

    const type = React.useMemo(() => {
        if (spec.viewSpec.type === 'password') {
            return 'password';
        }

        return 'text';
    }, [spec.viewSpec.type]);

    return (
        <TextInput
            type={type}
            value={_.isNil(value) ? '' : `${value}`}
            hasClear={true}
            onBlur={onBlur}
            onFocus={onFocus}
            onUpdate={handleChange}
            disabled={spec.viewSpec.disabled}
            placeholder={spec.viewSpec.placeholder}
            autoComplete={type === 'password' ? 'new-password' : undefined}
        />
    );
};
