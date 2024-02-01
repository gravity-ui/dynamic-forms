import React from 'react';

import {Select as SelectBase, SelectProps as SelectBaseProps, Text} from '@gravity-ui/uikit';

import {StringInput} from '../../../../core';
import {block} from '../../../utils';

import './Select.scss';

const b = block('select');

export interface SelectProps
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

export const Select: StringInput<SelectProps> = ({name, input, spec, inputProps}) => {
    const {value, onBlur, onChange, onFocus} = input;
    const filterable = React.useMemo(() => (spec.enum?.length || 0) > 9, [spec.enum?.length]);

    const {withCustomOptions, options: externalOptions} = inputProps || {};

    const options = React.useMemo(
        () =>
            withCustomOptions
                ? externalOptions
                : spec.enum?.map((id) => ({
                      id,
                      value: id,
                      text: spec.description?.[id] || id,
                      content: spec.viewSpec.selectParams?.meta?.[id] ? (
                          <div key={id}>
                              <Text>{spec.description?.[id] || id}</Text>
                              <Text color="secondary" className={b('meta-text')}>
                                  {spec.viewSpec.selectParams.meta[id]}
                              </Text>
                          </div>
                      ) : (
                          spec.description?.[id] || id
                      ),
                      key: id,
                  })),
        [
            spec.enum,
            spec.description,
            spec.viewSpec.selectParams?.meta,
            externalOptions,
            withCustomOptions,
        ],
    );

    const renderOption = React.useCallback((option: {value: string; content?: React.ReactNode}) => {
        return <React.Fragment key={option.value}>{option.content || option.value}</React.Fragment>;
    }, []);

    const getOptionHeight = React.useCallback(() => {
        if (spec.viewSpec.selectParams?.meta) {
            return 44;
        }

        return 28;
    }, [spec.viewSpec.selectParams?.meta]);

    const handleChange = React.useCallback((v: string[]) => onChange(v[0]), [onChange]);

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

    return (
        <SelectBase
            className={b()}
            width="max"
            filterable={filterable}
            getOptionHeight={getOptionHeight}
            renderOption={renderOption}
            {...inputProps}
            value={[value]}
            options={options}
            onUpdate={handleChange}
            onOpenChange={handleToggle}
            disabled={spec.viewSpec.disabled}
            placeholder={spec.viewSpec.placeholder}
            filterPlaceholder={spec.viewSpec.selectParams?.filterPlaceholder}
            qa={name}
        />
    );
};
