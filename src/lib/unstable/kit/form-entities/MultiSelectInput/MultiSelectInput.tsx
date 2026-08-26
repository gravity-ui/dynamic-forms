import React from 'react';

import {Flex, Select, type SelectOption, type SelectProps, Text} from '@gravity-ui/uikit';
import isString from 'lodash/isString';

import type {JsonSchemaArray, NodeEntity} from '../../../core';
import {EntityContainer} from '../../components';
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
}) => {
    const {name, onBlur, onChange, onFocus, value: inputValue} = input;
    const {enumDescriptions, optionsMeta, ...restEntityProps} = props;

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
            });
        }

        return;
    }, [enumDescriptions, enumValues, optionsMeta]);

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
                filterable={(enumValues?.length || 0) > 9}
                renderOption={renderOption}
                getOptionHeight={getOptionHeight}
                placeholder={`${schema.examples?.[0]?.[0]}`}
                disabled={schema.readOnly}
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
