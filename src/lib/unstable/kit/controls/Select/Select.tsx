import React from 'react';

import {
    Flex,
    Select as SelectBase,
    type SelectProps as SelectBaseProps,
    type SelectOption,
    Text,
} from '@gravity-ui/uikit';
import isString from 'lodash/isString';

import type {Control, JsonSchemaString} from '../../../core';
import {getValidationState} from '../../utils';

export interface SelectProps
    extends Omit<
        SelectBaseProps,
        | 'value'
        | 'onFocus'
        | 'onBlur'
        | 'onChange'
        | 'onUpdate'
        | 'onOpenChange'
        | 'multiple'
        | 'qa'
    > {
    enumDescriptions?: Record<string, string>;
    optionsMeta?: Record<string, string>;
    options?: SelectBaseProps['options'];
}

const Component: Control<JsonSchemaString, SelectProps> = ({controlProps, input, meta, schema}) => {
    const {enumDescriptions, optionsMeta, ...restControlProps} = controlProps;

    const value = React.useMemo(
        () => (isString(input.value) ? [input.value] : undefined),
        [input.value],
    );

    const onUpdate = React.useCallback((v: string[]) => input.onChange(v[0]), [input.onChange]);

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

    const renderOption: SelectBaseProps['renderOption'] = React.useCallback(
        (option: SelectOption) => (
            <React.Fragment key={option.value}>
                {option.content || option.text || option.value}
            </React.Fragment>
        ),
        [],
    );

    const getOptionHeight: SelectBaseProps['getOptionHeight'] = React.useCallback(
        (option: SelectOption) => (option.data?.optionMeta ? 44 : 28),
        [],
    );

    return (
        <SelectBase
            width="max"
            options={options}
            filterable={(schema.enum?.length || 0) > 9}
            renderOption={renderOption}
            getOptionHeight={getOptionHeight}
            disabled={schema.readOnly}
            {...restControlProps}
            value={value}
            onFocus={input.onFocus as SelectBaseProps['onFocus']}
            onBlur={input.onBlur as SelectBaseProps['onBlur']}
            onUpdate={onUpdate}
            errorMessage={meta.error}
            validationState={getValidationState(meta)}
            placeholder={schema.examples?.[0]}
            qa={input.name}
        />
    );
};

export const Select = React.memo(Component);
