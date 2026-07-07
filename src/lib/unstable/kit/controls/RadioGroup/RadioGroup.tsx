import React from 'react';

import {
    Flex,
    RadioGroup as UIKitRadioGroup,
    type RadioGroupOption as UIKitRadioGroupOption,
    type RadioGroupProps as UIKitRadioGroupProps,
} from '@gravity-ui/uikit';

import type {Control, JsonSchemaString} from '../../../core';
import {ControlError} from '../../components';
import {block, getValidationState} from '../../utils';

import './RadioGroup.scss';

const b = block('radio-group');

export interface RadioGroupProps
    extends Omit<
        UIKitRadioGroupProps,
        'value' | 'onFocus' | 'onBlur' | 'onChange' | 'onUpdate' | 'qa'
    > {
    enumDescriptions?: Record<string, string>;
    optionsDisabled?: Record<string, boolean>;
}

const Component: Control<JsonSchemaString, RadioGroupProps> = ({
    controlProps,
    input,
    meta,
    schema,
}) => {
    const {name, onBlur, onChange, onFocus, value} = input;
    const {enumDescriptions, optionsDisabled, ...restControlProps} = controlProps;

    const options: UIKitRadioGroupOption[] | undefined = React.useMemo(
        () =>
            schema.enum?.map((value) => ({
                value,
                content: enumDescriptions?.[value] || value,
                disabled: optionsDisabled?.[value],
            })),
        [enumDescriptions, optionsDisabled, schema.enum],
    );

    return (
        <Flex direction="column">
            <Flex className={b({error: getValidationState(meta)})} alignItems="center">
                <UIKitRadioGroup
                    options={options}
                    disabled={schema.readOnly}
                    {...restControlProps}
                    value={value}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onUpdate={onChange}
                    qa={name}
                />
            </Flex>
            <ControlError errorMessage={meta.error} validationState={getValidationState(meta)} />
        </Flex>
    );
};

export const RadioGroup = React.memo(Component);
