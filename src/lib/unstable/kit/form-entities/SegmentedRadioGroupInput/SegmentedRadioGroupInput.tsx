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
> = ({input, meta, props, schema, settings, ...restProps}) => {
    const {name, onBlur, onChange, onFocus, value} = input;
    const {enumDescriptions, optionsDisabled, ...restEntityProps} = props;
    const {disabled} = schema.nodeParameters?.flags || {};

    const containerRef = React.useRef<HTMLDivElement>(null);
    const controlRef = React.useRef<HTMLDivElement>(null);
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
        const container = containerRef.current;
        const control = controlRef.current;

        if (!container || !control) {
            return;
        }

        const measure = () => {
            const GAP = 48; // little bit more than potential remove button width + spacing
            const containerWidth = container.offsetWidth - GAP;
            const controlWidth = control.offsetWidth;

            setOverflowed(controlWidth > containerWidth);
        };

        measure();

        const observer = new ResizeObserver(measure);

        observer.observe(container);

        return () => observer.disconnect();
    }, [options]);

    return (
        <EntityContainer
            ref={containerRef}
            className={b({error: getBooleanValidationState(meta)})}
            stretch="max"
        >
            {overflowed ? (
                <SelectInput
                    input={input}
                    meta={meta}
                    props={props}
                    schema={schema}
                    settings={settings}
                    {...restProps}
                />
            ) : (
                <SegmentedRadioGroup
                    width="max"
                    disabled={disabled || schema.readOnly}
                    options={options}
                    size={settings?.size}
                    {...restEntityProps}
                    value={value}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onUpdate={onUpdate}
                    qa={name}
                />
            )}
            <div className={b('checker')}>
                <SegmentedRadioGroup
                    ref={controlRef}
                    width="max"
                    disabled={disabled || schema.readOnly}
                    options={options}
                    size={settings?.size}
                    {...restEntityProps}
                />
            </div>
        </EntityContainer>
    );
};
