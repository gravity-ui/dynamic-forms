import React from 'react';

import {
    Flex,
    Select as SelectBase,
    type SelectProps as SelectBaseProps,
    type SelectOption,
    Text,
} from '@gravity-ui/uikit';
import isString from 'lodash/isString';

import type {Control, JsonSchemaArray} from '../../../core';
import {getValidationState} from '../../utils';

export interface MultiSelectProps
    extends Omit<
        SelectBaseProps,
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
    const {enumDescriptions, optionsMeta, ...restControlProps} = controlProps;

    const value = React.useMemo(
        () => (Array.isArray(input.value) && input.value.every(isString) ? input.value : undefined),
        [input.value],
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
            filterable={(enumValues?.length || 0) > 9}
            renderOption={renderOption}
            getOptionHeight={getOptionHeight}
            disabled={schema.readOnly}
            {...restControlProps}
            value={value}
            onFocus={input.onFocus as SelectBaseProps['onFocus']}
            onBlur={input.onBlur as SelectBaseProps['onBlur']}
            onUpdate={input.onChange}
            errorMessage={meta.error}
            validationState={getValidationState(meta)}
            placeholder={`${schema.examples?.[0]?.[0]}`}
            multiple
            qa={input.name}
        />
    );
};

export const MultiSelect = React.memo(Component);
