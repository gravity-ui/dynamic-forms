import React from 'react';

import {
    Flex,
    Text,
    Select as UIKitSelect,
    type SelectOption as UIKitSelectOption,
    type SelectProps as UIKitSelectProps,
} from '@gravity-ui/uikit';
import isString from 'lodash/isString';

import type {Control, JsonSchemaString} from '../../../core';
import {ControlContainer} from '../../components';
import {getValidationState} from '../../utils';

export interface SelectProps
    extends Omit<
        UIKitSelectProps,
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
    options?: UIKitSelectProps['options'];
}

const Component: Control<JsonSchemaString, SelectProps> = ({controlProps, input, meta, schema}) => {
    const {name, onBlur, onChange, onFocus, value: inputValue} = input;
    const {enumDescriptions, optionsMeta, ...restControlProps} = controlProps;

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
        <ControlContainer stretch="max">
            <UIKitSelect
                width="max"
                options={options}
                filterable={(schema.enum?.length || 0) > 9}
                renderOption={renderOption}
                getOptionHeight={getOptionHeight}
                placeholder={schema.examples?.[0]}
                disabled={schema.readOnly}
                {...restControlProps}
                value={value}
                onFocus={onFocus as UIKitSelectProps['onFocus']}
                onBlur={onBlur as UIKitSelectProps['onBlur']}
                onUpdate={onUpdate}
                errorMessage={undefined}
                validationState={getValidationState(meta)}
                qa={name}
            />
        </ControlContainer>
    );
};

export const Select = React.memo(Component);
