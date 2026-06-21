import React from 'react';

import {
    Flex,
    RadioGroup as RadioGroupBase,
    type RadioGroupProps as RadioGroupBaseProps,
    type RadioGroupOption,
} from '@gravity-ui/uikit';

import type {Control, JsonSchemaString} from '../../../core';
import {ControlError} from '../../components';
import {block, getValidationState} from '../../utils';

import './RadioGroup.scss';

const b = block('radio-group');

export interface RadioGroupProps
    extends Omit<
        RadioGroupBaseProps,
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
    const {enumDescriptions, optionsDisabled, ...restControlProps} = controlProps;

    const options: RadioGroupOption[] | undefined = React.useMemo(
        () =>
            schema.enum?.map((value) => ({
                value,
                content: enumDescriptions?.[value] || value,
                disabled: optionsDisabled?.[value],
            })),
        [enumDescriptions, optionsDisabled, schema.enum],
    );

    return (
        <ControlError errorMessage={meta.error} validationState={getValidationState(meta)}>
            <Flex className={b()} alignItems="center">
                <RadioGroupBase
                    options={options}
                    disabled={schema.readOnly}
                    {...restControlProps}
                    value={input.value}
                    onFocus={input.onFocus}
                    onBlur={input.onBlur}
                    onUpdate={input.onChange}
                    qa={input.name}
                />
            </Flex>
        </ControlError>
    );
};

export const RadioGroup = React.memo(Component);
