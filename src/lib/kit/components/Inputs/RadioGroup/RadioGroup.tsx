import React from 'react';

import {
    Flex,
    RadioGroup as RadioGroupBase,
    type RadioGroupProps as RadioGroupBaseProps,
    type RadioGroupOption,
} from '@gravity-ui/uikit';

import type {StringInput} from '../../../../core';
import {block} from '../../../utils';

import './RadioGroup.scss';

const b = block('radio-group');

export interface RadioGroupProps
    extends Omit<
        RadioGroupBaseProps,
        'direction' | 'onChange' | 'onBlur' | 'onFocus' | 'disabled' | 'qa' | 'content'
    > {
    withCustomOptions?: boolean;
}

export const RadioGroup: StringInput<RadioGroupProps> = ({name, input, spec, inputProps}) => {
    const {value, onBlur, onChange, onFocus} = input;

    const {withCustomOptions, options: externalOptions} = inputProps || {};

    const options: RadioGroupOption[] = React.useMemo(
        () =>
            withCustomOptions
                ? externalOptions || []
                : spec.enum?.map((id) => ({
                      value: id,
                      content: spec.description?.[id] || id,
                      disabled: spec.viewSpec.radioGroupParams?.disabled?.[id] || false,
                  })) || [],
        [
            withCustomOptions,
            externalOptions,
            spec.enum,
            spec.description,
            spec.viewSpec.radioGroupParams?.disabled,
        ],
    );

    if (options.length === 0) {
        return null;
    }

    return (
        <Flex className={b({vertical: spec.viewSpec.radioGroupParams?.direction === 'vertical'})}>
            <RadioGroupBase
                {...inputProps}
                name={name}
                qa={name}
                disabled={spec.viewSpec.disabled}
                onUpdate={onChange}
                onBlur={onBlur}
                onFocus={onFocus}
                value={value}
                options={options}
                direction={spec.viewSpec.radioGroupParams?.direction || 'horizontal'}
            />
        </Flex>
    );
};
