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
    const {name, onBlur, onChange, onFocus, value: inputValue} = input;
    const {direction, disabled, enumDescriptions, optionsDisabled} = controlProps;

    const value = React.useMemo(
        () => (Array.isArray(inputValue) ? (inputValue as string[]) : []),
        [inputValue],
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
            onFocus();

            if (selected) {
                onChange([...value, optionValue]);
            } else {
                onChange(value.filter((el) => el !== optionValue));
            }

            onBlur();
        },
        [onBlur, onChange, onFocus, value],
    );

    return (
        <Flex direction="column">
            <Flex className={b()} direction={direction} gap={2}>
                {options?.map(({value: optionValue, text}) => (
                    <Checkbox
                        className={b('checkbox', {
                            error: value.includes(optionValue) && getValidationState(meta),
                        })}
                        checked={value.includes(optionValue)}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onUpdate={(checked: boolean) => onUpdate(optionValue, checked)}
                        content={text}
                        disabled={disabled || optionsDisabled?.[optionValue] || schema.readOnly}
                        qa={`${name}-${optionValue}`}
                        key={optionValue}
                    />
                ))}
            </Flex>
            <ControlError errorMessage={meta.error} validationState={getValidationState(meta)} />
        </Flex>
    );
};

export const CheckboxGroup = React.memo(Component);
