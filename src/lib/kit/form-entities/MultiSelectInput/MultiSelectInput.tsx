import React from 'react';

import {
    Flex,
    Select,
    type SelectOptionProps,
    type SelectProps,
    Text,
    getSelectOptionText,
} from '@gravity-ui/uikit';
import isString from 'lodash/isString';

import type {JsonSchemaArray, NodeEntity} from '../../../core';
import {EntityContainer} from '../../components';
import {DASH} from '../../constants';
import {getValidationState} from '../../utils';

export interface MultiSelectInputProps
    extends Omit<
        SelectProps,
        | 'value'
        | 'onFocus'
        | 'onBlur'
        | 'onChange'
        | 'onUpdate'
        | 'multiple'
        | 'errorMessage'
        | 'validationState'
        | 'qa'
    > {
    enumDescriptions?: Record<string, string>;
    optionsMeta?: Record<string, string>;
}

export const MultiSelectInput: NodeEntity<JsonSchemaArray, MultiSelectInputProps> = ({
    input,
    meta,
    props,
    schema,
    settings,
}) => {
    const {name, onBlur, onChange, onFocus, value: inputValue} = input;
    const {enumDescriptions, optionsMeta, ...restEntityProps} = props;
    const {disabled} = schema.nodeParameters?.flags || {};

    const value = React.useMemo(
        () => (Array.isArray(inputValue) && inputValue.every(isString) ? inputValue : undefined),
        [inputValue],
    );

    const enumValues = schema.items && 'enum' in schema.items ? schema.items.enum : undefined;

    const options = React.useMemo(() => {
        if (enumValues) {
            return enumValues?.map((el) => {
                const value = `${el}`;
                const text = enumDescriptions?.[value] || value;
                const optionMeta = optionsMeta?.[value];
                let content: React.ReactNode = <Text variant={settings?.textVariant}>{text}</Text>;

                if (optionMeta) {
                    content = (
                        <Flex direction="column" gap="spacing-half">
                            {content}
                            <Text color="secondary" variant={settings?.textVariant}>
                                {optionMeta}
                            </Text>
                        </Flex>
                    );
                }

                return {value, content, key: value, data: {optionMeta, text}};
            });
        }

        return;
    }, [enumDescriptions, enumValues, optionsMeta, settings]);

    const renderOption: SelectProps['renderOption'] = React.useCallback(
        (option: SelectOptionProps) => (
            <React.Fragment key={option.value}>{option.content || option.value}</React.Fragment>
        ),
        [],
    );

    const getOptionText: SelectProps['getOptionText'] = React.useCallback(
        (option: SelectOptionProps) => option.data?.text ?? getSelectOptionText(option),
        [],
    );

    const getOptionHeight: SelectProps['getOptionHeight'] = React.useCallback(
        (option: SelectOptionProps) => {
            let height = 28;

            if (settings?.size) {
                height = {
                    s: 24,
                    m: 28,
                    l: 36,
                    xl: 44,
                }[settings.size];
            }

            if (option.data?.optionMeta) {
                if (settings?.size) {
                    height += {
                        s: 24,
                        m: 20,
                        l: 16,
                        xl: 16,
                    }[settings.size];
                } else {
                    height += 16;
                }
            }
            return height;
        },
        [settings?.size],
    );

    return (
        <EntityContainer width="max">
            <Select
                width="max"
                options={options}
                filterable={(enumValues?.length || 0) > 9}
                renderOption={renderOption}
                getOptionHeight={getOptionHeight}
                getOptionText={getOptionText}
                placeholder={`${schema.examples?.[0]?.[0] || DASH}`}
                disabled={disabled || schema.readOnly}
                size={settings?.size}
                {...restEntityProps}
                value={value}
                onFocus={onFocus as SelectProps['onFocus']}
                onBlur={onBlur as SelectProps['onBlur']}
                onUpdate={onChange}
                errorMessage={undefined}
                validationState={getValidationState(meta)}
                multiple
                qa={name}
            />
        </EntityContainer>
    );
};
