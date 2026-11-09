import React from 'react';

import {Flex, Select, type SelectOption, type SelectProps, Text} from '@gravity-ui/uikit';
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
                        <Flex direction="column" gap="0.5">
                            {content}
                            <Text color="secondary" variant={settings?.textVariant}>
                                {optionMeta}
                            </Text>
                        </Flex>
                    );
                }

                return {value, text, content, key: value, data: {optionMeta}};
            });
        }

        return;
    }, [enumDescriptions, enumValues, optionsMeta, settings]);

    const renderOption: SelectProps['renderOption'] = React.useCallback(
        (option: SelectOption) => (
            <React.Fragment key={option.value}>
                {option.content || option.text || option.value}
            </React.Fragment>
        ),
        [],
    );

    const getOptionHeight: SelectProps['getOptionHeight'] = React.useCallback(
        (option: SelectOption) => {
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
