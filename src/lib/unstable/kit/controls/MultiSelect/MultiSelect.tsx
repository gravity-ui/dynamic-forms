import React from 'react';

import {
    Flex,
    Text,
    Select as UIKitSelect,
    type SelectOption as UIKitSelectOption,
    type SelectProps as UIKitSelectProps,
} from '@gravity-ui/uikit';
import isString from 'lodash/isString';

import type {Control, JsonSchemaArray} from '../../../core';
import {getValidationState} from '../../utils';

export interface MultiSelectProps
    extends Omit<
        UIKitSelectProps,
        'value' | 'onFocus' | 'onBlur' | 'onChange' | 'onUpdate' | 'multiple' | 'qa'
    > {
    enumDescriptions?: Record<string, string>;
    optionsMeta?: Record<string, string>;
}

const Component: Control<JsonSchemaArray, MultiSelectProps> = ({
    controlProps,
    input,
    meta,
    schema,
}) => {
    const {name, onBlur, onChange, onFocus, value: inputValue} = input;
    const {enumDescriptions, optionsMeta, ...restControlProps} = controlProps;

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

    const renderOption: UIKitSelectProps['renderOption'] = React.useCallback(
        (option: UIKitSelectOption) => (
            <React.Fragment key={option.value}>
                {option.content || option.text || option.value}
            </React.Fragment>
        ),
        [],
    );

    const getOptionHeight: UIKitSelectProps['getOptionHeight'] = React.useCallback(
        (option: UIKitSelectOption) => (option.data?.optionMeta ? 44 : 28),
        [],
    );

    return (
        <UIKitSelect
            width="max"
            options={options}
            filterable={(enumValues?.length || 0) > 9}
            renderOption={renderOption}
            getOptionHeight={getOptionHeight}
            disabled={schema.readOnly}
            {...restControlProps}
            value={value}
            onFocus={onFocus as UIKitSelectProps['onFocus']}
            onBlur={onBlur as UIKitSelectProps['onBlur']}
            onUpdate={onChange}
            errorMessage={meta.error}
            validationState={getValidationState(meta)}
            placeholder={`${schema.examples?.[0]?.[0]}`}
            multiple
            qa={name}
        />
    );
};

export const MultiSelect = React.memo(Component);
