import React from 'react';

import {TextInput} from '@gravity-ui/uikit';
import _ from 'lodash';

import {FieldRenderProps, NumberInputProps, StringInputProps, isStringSpec} from '../../../../core';
import {GenerateRandomValueButton} from '../../GenerateRandomValueButton';

export const Text = <T extends NumberInputProps | StringInputProps>({name, input, spec}: T) => {
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

    const textInput = React.useMemo(
        () => (
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
                qa={name}
            />
        ),
        [
            handleChange,
            name,
            onBlur,
            onFocus,
            spec.viewSpec.disabled,
            spec.viewSpec.placeholder,
            type,
            value,
        ],
    );

    const content = React.useMemo(() => {
        if (isStringSpec(spec) && spec.viewSpec.generateRandomValue) {
            return (
                <GenerateRandomValueButton regex={spec.pattern} onChange={handleChange}>
                    {textInput}
                </GenerateRandomValueButton>
            );
        }

        return <React.Fragment>{textInput}</React.Fragment>;
    }, [handleChange, spec, textInput]);

    return <React.Fragment>{content}</React.Fragment>;
};
