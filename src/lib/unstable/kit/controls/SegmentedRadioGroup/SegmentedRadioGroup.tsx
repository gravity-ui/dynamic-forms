import React from 'react';

import {
    Flex,
    SegmentedRadioGroup as UIKitSegmentedRadioGroup,
    type SegmentedRadioGroupProps as UIKitSegmentedRadioGroupProps,
} from '@gravity-ui/uikit';

import type {Control, JsonSchemaString} from '../../../core';
import {ControlError} from '../../components';
import {block, getValidationState} from '../../utils';

import './SegmentedRadioGroup.scss';

const b = block('segmented-radio-group');

export interface SegmentedRadioGroupProps extends UIKitSegmentedRadioGroupProps {
    enumDescriptions?: Record<string, string>;
    optionsDisabled?: Record<string, boolean>;
}

const Component: Control<JsonSchemaString, SegmentedRadioGroupProps> = ({
    controlProps,
    input,
    meta,
    schema,
}) => {
    const {name, onBlur, onChange, onFocus, value} = input;
    const {enumDescriptions, optionsDisabled, ...restControlProps} = controlProps;

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

    return (
        <Flex width="100%" direction="column">
            <UIKitSegmentedRadioGroup
                className={b({error: getValidationState(meta)})}
                width="max"
                disabled={schema.readOnly}
                options={options}
                {...restControlProps}
                value={value}
                onFocus={onFocus}
                onBlur={onBlur}
                onUpdate={onUpdate}
                qa={name}
            />
            <ControlError errorMessage={meta.error} validationState={getValidationState(meta)} />
        </Flex>
    );
};

export const SegmentedRadioGroup = React.memo(Component);
