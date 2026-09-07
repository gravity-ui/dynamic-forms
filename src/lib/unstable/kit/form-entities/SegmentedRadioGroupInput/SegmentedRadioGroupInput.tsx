import React from 'react';

import {SegmentedRadioGroup, type SegmentedRadioGroupProps} from '@gravity-ui/uikit';

import type {JsonSchemaString, NodeEntity} from '../../../core';
import {EntityContainer} from '../../components';
import {block, getBooleanValidationState} from '../../utils';
import {SelectInput} from '../SelectInput';

import './SegmentedRadioGroupInput.scss';

const b = block('segmented-radio-group-input');

export interface SegmentedRadioGroupInputProps
    extends Omit<
        SegmentedRadioGroupProps,
        | 'children'
        | 'defaultValue'
        | 'value'
        | 'onFocus'
        | 'onBlur'
        | 'onChange'
        | 'onUpdate'
        | 'qa'
    > {
    enumDescriptions?: Record<string, string>;
    optionsDisabled?: Record<string, boolean>;
}

export const SegmentedRadioGroupInput: NodeEntity<
    JsonSchemaString,
    SegmentedRadioGroupInputProps
> = ({input, meta, props, schema, ...restProps}) => {
    const {name, onBlur, onChange, onFocus, value} = input;
    const {enumDescriptions, optionsDisabled, ...restEntityProps} = props;
    const {disabled} = schema.nodeParameters?.flags || {};

    const ref = React.useRef<HTMLDivElement>(null);
    const [overflowed, setOverflowed] = React.useState(false);

    const options = React.useMemo(
        () =>
            schema.enum?.map((value) => ({
                value,
                content: enumDescriptions?.[value] || value,
                disabled: optionsDisabled?.[value],
            })),
        [enumDescriptions, optionsDisabled, schema.enum],
    );

    const onUpdate = React.useCallback(
        (value: string) => {
            onFocus();
            onChange(value);
            onBlur();
        },
        [onBlur, onChange, onFocus],
    );

    React.useLayoutEffect(() => {
        const root = ref.current;

        if (!root) {
            return;
        }

        const measure = () => {
            const texts = root.querySelectorAll<HTMLElement>(
                '.g-segmented-radio-group__option-text',
            );

            setOverflowed(
                Array.from(texts).some((node) => {
                    if (node.offsetWidth === 0 && node.scrollWidth === 0) {
                        return false;
                    }

                    return node.scrollWidth > node.clientWidth;
                }),
            );
        };

        measure();

        const observer = new ResizeObserver(measure);

        observer.observe(root);

        return () => observer.disconnect();
    }, [options]);

    return (
        <EntityContainer stretch="max">
            {overflowed ? (
                <SelectInput
                    input={input}
                    meta={meta}
                    props={props}
                    schema={schema}
                    {...restProps}
                />
            ) : null}
            <EntityContainer
                stretch="max"
                className={b({error: getBooleanValidationState(meta), overflowed})}
            >
                <SegmentedRadioGroup
                    ref={ref}
                    width="max"
                    disabled={disabled || schema.readOnly}
                    options={options}
                    {...restEntityProps}
                    value={value}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onUpdate={onUpdate}
                    qa={name}
                />
            </EntityContainer>
        </EntityContainer>
    );
};
