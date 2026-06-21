import React from 'react';

import {Checkbox, Flex} from '@gravity-ui/uikit';

import type {Control, JsonSchemaArray} from '../../../core';
import {ControlError} from '../../components';
import {block, getValidationState} from '../../utils';

import './CheckboxGroup.scss';

const b = block('checkbox-group');

export interface CheckboxGroupProps {
    enumDescriptions?: Record<string, string>;
    optionsDisabled?: Record<string, boolean>;
    direction?: 'row' | 'column';
    disabled?: boolean;
}

const Component: Control<JsonSchemaArray, CheckboxGroupProps> = ({
    controlProps,
    input,
    meta,
    schema,
}) => {
    const {direction, disabled, enumDescriptions, optionsDisabled} = controlProps;

    const value = React.useMemo(
        () => (Array.isArray(input.value) ? (input.value as string[]) : []),
        [input.value],
    );

    const options = React.useMemo(() => {
        if (schema.items && 'enum' in schema.items) {
            return schema?.items?.enum?.map((el) => {
                const value = `${el}`;

                return {
                    value,
                    text: enumDescriptions?.[value] || value,
                };
            });
        }

        return;
    }, [enumDescriptions, schema]);

    const onUpdate = React.useCallback(
        (optionValue: string, selected: boolean) => {
            if (selected) {
                input.onChange([...value, optionValue]);
            } else {
                input.onChange(value.filter((el) => el !== optionValue));
            }
        },
        [input.onChange, value],
    );

    return (
        <ControlError errorMessage={meta.error} validationState={getValidationState(meta)}>
            <Flex className={b()} direction={direction} gap={2}>
                {options?.map(({value: optionValue, text}) => (
                    <Checkbox
                        checked={value.includes(optionValue)}
                        onFocus={input.onFocus}
                        onBlur={input.onBlur}
                        onUpdate={(checked: boolean) => onUpdate(optionValue, checked)}
                        content={text}
                        disabled={disabled || optionsDisabled?.[optionValue] || schema.readOnly}
                        qa={`${input.name}-${optionValue}`}
                        key={optionValue}
                    />
                ))}
            </Flex>
        </ControlError>
    );
};

export const CheckboxGroup = React.memo(Component);
