import React from 'react';

import {Select, Text} from '@gravity-ui/uikit';

import {ArrayInput, FieldArrayValue, transformArrIn, transformArrOut} from '../../../../core';
import {block} from '../../../utils';

import './MultiSelect.scss';

const b = block('multi-select');

export const MultiSelect: ArrayInput = ({name, input, spec}) => {
    const {value, onBlur, onChange, onFocus} = input;

    const filterable = React.useMemo(() => (spec.enum?.length || 0) > 9, [spec.enum?.length]);

    const options = React.useMemo(
        () =>
            spec.enum?.map((id) => ({
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
        [spec.enum, spec.description, spec.viewSpec.selectParams?.meta],
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

    const _value = React.useMemo(() => transformArrOut<FieldArrayValue, string[]>(value), [value]);

    const handleChange = React.useCallback(
        (value: string[]) => onChange(transformArrIn<string[], FieldArrayValue>(value)),
        [onChange],
    );

    return (
        <Select
            width="max"
            className={b()}
            value={_value}
            options={options}
            onUpdate={handleChange}
            onOpenChange={handleToggle}
            disabled={spec.viewSpec.disabled}
            placeholder={spec.viewSpec.placeholder}
            filterable={filterable}
            filterPlaceholder={spec.viewSpec.selectParams?.filterPlaceholder}
            renderOption={renderOption}
            getOptionHeight={getOptionHeight}
            multiple
            qa={name}
        />
    );
};
