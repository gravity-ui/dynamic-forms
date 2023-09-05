import React from 'react';

import {Select as SelectBase, Text} from '@gravity-ui/uikit';

import {StringInput} from '../../../../core';
import {block} from '../../../utils';

import './Select.scss';

const b = block('select');

export const Select: StringInput = ({name, input, spec}) => {
    const {value, onBlur, onChange, onFocus} = input;

    const filterable = React.useMemo(
        () => spec.viewSpec.selectParams?.filterable || (spec.enum?.length || 0) > 9,
        [spec.enum?.length, spec.viewSpec.selectParams?.filterable],
    );

    const options = React.useMemo(
        () =>
            spec.enum?.map((id) => ({
                id,
                value: id,
                text: spec.description?.[id] || id,
                content:
                    spec.viewSpec.selectParams?.meta && spec.viewSpec.selectParams.meta?.[id] ? (
                        <div key={id}>
                            <Text>{spec.description?.[id] || id}</Text>
                            <Text color="secondary" className={b('meta-text')}>
                                {spec.viewSpec.selectParams.meta[id]}
                            </Text>
                        </div>
                    ) : (
                        <React.Fragment key={id}>{spec.description?.[id] || id}</React.Fragment>
                    ),
                key: id,
            })),
        [spec.enum, spec.description, spec.viewSpec.selectParams?.meta],
    );

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
            value={[value]}
            options={options}
            onUpdate={handleChange}
            onOpenChange={handleToggle}
            disabled={spec.viewSpec.disabled}
            placeholder={spec.viewSpec.placeholder}
            filterable={filterable}
            qa={name}
            filterPlaceholder={spec.viewSpec.selectParams?.filterPlaceholder}
            renderSelectedOption={(option) => (
                <span key={option.value}>{option.text || option.value}</span>
            )}
            getOptionHeight={getOptionHeight}
            renderOption={(option) => (
                <React.Fragment key={option.value}>{option.content}</React.Fragment>
            )}
        />
    );
};
