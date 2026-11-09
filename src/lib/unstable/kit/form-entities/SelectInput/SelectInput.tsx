import React from 'react';

import {Flex, Select, type SelectOption, type SelectProps, Text} from '@gravity-ui/uikit';
import isString from 'lodash/isString';

import type {JsonSchemaString, NodeEntity} from '../../../core';
import {EntityContainer} from '../../components';
import {DASH} from '../../constants';
import {getValidationState} from '../../utils';

export interface SelectInputProps
    extends Omit<
        SelectProps,
        | 'defaultValue'
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

export const SelectInput: NodeEntity<JsonSchemaString, SelectInputProps> = ({
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
        () => (isString(inputValue) ? [inputValue] : undefined),
        [inputValue],
    );

    const onUpdate = React.useCallback((v: string[]) => onChange(v[0]), [onChange]);

    const options = React.useMemo(
        () =>
            schema.enum?.map((value) => {
                const optionMeta = optionsMeta?.[value];
                const text = enumDescriptions?.[value] || value;
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
            }),
        [enumDescriptions, optionsMeta, schema.enum, settings],
    );

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
                filterable={(schema.enum?.length || 0) > 9}
                renderOption={renderOption}
                getOptionHeight={getOptionHeight}
                placeholder={schema.examples?.[0] || DASH}
                disabled={disabled || schema.readOnly}
                size={settings?.size}
                {...restEntityProps}
                value={value}
                onFocus={onFocus as SelectProps['onFocus']}
                onBlur={onBlur as SelectProps['onBlur']}
                onUpdate={onUpdate}
                errorMessage={undefined}
                validationState={getValidationState(meta)}
                qa={name}
            />
        </EntityContainer>
    );
};
