import React from 'react';

import {ArrayInput, FieldArrayValue, transformArrIn, transformArrOut} from '../../../../core';
import {Checkbox, type CheckboxProps as CheckboxBaseProps} from '@gravity-ui/uikit';
import {block} from '../../../utils';

import './CheckboxGroup.scss';

const b = block('checkbox-group');

export interface CheckboxGroupProps
    extends Omit<
        CheckboxBaseProps,
        'checked' | 'onChange' | 'onBlur' | 'onFocus' | 'disabled' | 'qa' | 'content'
    > {}

export const CheckboxGroup: ArrayInput<CheckboxGroupProps> = ({name, input, spec, inputProps}) => {
    const {value, onBlur, onChange, onFocus} = input;

    const _value: string[] | undefined = React.useMemo(
        () => transformArrOut<FieldArrayValue, string[]>(value),
        [value],
    );

    const options = React.useMemo(
        () =>
            spec.enum?.map((id) => ({
                value: id,
                text: spec.description?.[id] || id,
            })),
        [spec.enum, spec.description],
    );

    const handleUpdate = React.useCallback(
        (optionValue: string, selected: boolean) => {
            let newValue = _value || [];

            if (selected) {
                newValue.push(optionValue);
            } else {
                newValue = newValue.filter((id) => id !== optionValue);
            }

            onChange(transformArrIn<string[], FieldArrayValue>(newValue));
        },
        [_value, onChange],
    );

    return (
        <div
            className={b({vertical: spec.viewSpec.checkboxGroupParams?.placement === 'vertical'})}
            data-qa={name}
        >
            {options?.map(({value: optionValue, text}) => (
                <Checkbox
                    {...inputProps}
                    qa={name && `${name}-${optionValue}`}
                    key={optionValue}
                    checked={_value?.includes(optionValue)}
                    onUpdate={(selected: boolean) => handleUpdate(optionValue, selected)}
                    disabled={
                        spec.viewSpec.disabled ||
                        spec.viewSpec.checkboxGroupParams?.disabled?.[optionValue]
                    }
                    content={text}
                    onBlur={onBlur}
                    onFocus={onFocus}
                />
            ))}
        </div>
    );
};
