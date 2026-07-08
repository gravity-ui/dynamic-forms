import React from 'react';

import {
    RadioGroup as UIKitRadioGroup,
    type RadioGroupOption as UIKitRadioGroupOption,
    type RadioGroupProps as UIKitRadioGroupProps,
} from '@gravity-ui/uikit';

import type {Control, JsonSchemaString} from '../../../core';
import {ControlContainer} from '../../components';
import {block, getBooleanValidationState} from '../../utils';

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
    const {
        enumDescriptions,
        optionsDisabled,
        direction = 'horizontal',
        ...restControlProps
    } = controlProps;

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
        <ControlContainer
            stretch="fit"
            className={b({error: getBooleanValidationState(meta), direction})}
            justifyContent="center"
        >
            <UIKitRadioGroup
                options={options}
                disabled={schema.readOnly}
                {...restControlProps}
                value={value}
                onFocus={onFocus}
                onBlur={onBlur}
                onUpdate={onChange}
                direction={direction}
                qa={name}
            />
        </ControlContainer>
    );
};

export const RadioGroup = React.memo(Component);
