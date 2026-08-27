import React from 'react';

import {Flex, Select, type SelectOption, type SelectProps, Text} from '@gravity-ui/uikit';
import isString from 'lodash/isString';

import type {JsonSchemaString, NodeEntity} from '../../../core';
import {EntityContainer} from '../../components';
import {getValidationState} from '../../utils';

export interface SelectInputProps
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
    options?: SelectProps['options'];
}

export const SelectInput: NodeEntity<JsonSchemaString, SelectInputProps> = ({
    input,
    meta,
    props,
    schema,
}) => {
    const {name, onBlur, onChange, onFocus, value: inputValue} = input;
    const {enumDescriptions, optionsMeta, ...restEntityProps} = props;

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
                let content: React.ReactNode = text;

                if (optionMeta) {
                    content = (
                        <Flex direction="column" gap="0.5">
                            <Text>{text}</Text>
                            <Text color="secondary">{optionMeta}</Text>
                        </Flex>
                    );
                }

                return {value, text, content, key: value, data: {optionMeta}};
            }),
        [enumDescriptions, optionsMeta, schema.enum],
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
        (option: SelectOption) => (option.data?.optionMeta ? 44 : 28),
        [],
    );

    return (
        <EntityContainer stretch="max">
            <Select
                width="max"
                options={options}
                filterable={(schema.enum?.length || 0) > 9}
                renderOption={renderOption}
                getOptionHeight={getOptionHeight}
                placeholder={schema.examples?.[0] || ''}
                disabled={schema.readOnly}
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
