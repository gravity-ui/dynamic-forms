import React from 'react';

import type {SelectProps as SelectBaseProps} from '@gravity-ui/uikit';
import {Select} from '@gravity-ui/uikit';

// import {ArrayInput, FieldArrayValue, transformArrIn, transformArrOut} from '../../../../core';
import {block} from '../../kit/utils';
import type {JsonSchemaArray, SimpleView} from '../core/types';

import './MultiSelect.scss';

export interface MultiSelectProps
    extends Omit<
        SelectBaseProps,
        | 'onUpdate'
        | 'value'
        | 'onOpenChange'
        | 'disabled'
        | 'placeholder'
        | 'filterPlaceholder'
        | 'multiple'
        | 'qa'
    > {
    withCustomOptions?: boolean;
}

const b = block('multi-select');

export const MultiSelect: SimpleView<JsonSchemaArray> = ({input, schema}) => {
    const {name, value, onBlur, onChange, onFocus} = input;

    const filterable = React.useMemo(() => (schema.enum?.length || 0) > 9, [schema.enum?.length]);

    // const {withCustomOptions, options: externalOptions} = inputProps || {};

    const options = React.useMemo(
        () =>
            // withCustomOptions
            //     ? externalOptions || []
            // :
            // @ts-expect-error
            schema.items?.enum?.map((id) => ({
                id,
                value: id,
                text: schema.entityParameters?.enumDescription?.[id] || id,
                content: schema.entityParameters?.enumDescription?.[id] || id,
                key: id,
            })),
        [
            schema.enum,
            schema.description,
            // spec.viewSpec.selectParams?.meta,
            // externalOptions,
            // withCustomOptions,
        ],
    );

    const renderOption = React.useCallback((option: {value: string; content?: React.ReactNode}) => {
        return <React.Fragment key={option.value}>{option.content || option.value}</React.Fragment>;
    }, []);

    const getOptionHeight = React.useCallback(() => {
        // if (spec.viewSpec.selectParams?.meta) {
        //     return 44;
        // }

        return 28;
    }, []);

    const handleToggle = React.useCallback(
        (open: boolean) => {
            if (open) {
                onFocus();
            } else {
                onBlur();
            }
        },
        [onFocus, onBlur],
    );

    // const _value = React.useMemo(() => transformArrOut<FieldArrayValue, string[]>(value), [value]);

    // const handleChange = React.useCallback(
    //     (value: string[]) => onChange(transformArrIn<string[], FieldArrayValue>(value)),
    //     [onChange],
    // );

    return (
        <Select
            width="max"
            className={b()}
            filterable={filterable}
            renderOption={renderOption}
            getOptionHeight={getOptionHeight}
            // {...inputProps}
            // @ts-expect-error
            value={value}
            options={options}
            onUpdate={onChange}
            onOpenChange={handleToggle}
            disabled={schema.readOnly}
            // @ts-expect-error
            placeholder={schema.examples?.[0] || ''}
            // filterPlaceholder={spec.viewSpec.selectParams?.filterPlaceholder}
            multiple
            qa={name}
        />
    );
};
