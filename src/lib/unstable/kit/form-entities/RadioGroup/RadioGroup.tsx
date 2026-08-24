import React from 'react';

import {
    RadioGroup as UIKitRadioGroup,
    type RadioGroupOption as UIKitRadioGroupOption,
    type RadioGroupProps as UIKitRadioGroupProps,
} from '@gravity-ui/uikit';

import type {JsonSchemaString, NodeEntity} from '../../../core';
import {EntityContainer} from '../../components';
import {block, getBooleanValidationState} from '../../utils';

import './RadioGroup.scss';

const b = block('radio-group');

export interface RadioGroupProps
    extends Omit<
        UIKitRadioGroupProps,
        'value' | 'onFocus' | 'onBlur' | 'onChange' | 'onUpdate' | 'qa'
    > {
    enumDescriptions?: Record<string, string>;
    optionsDisabled?: Record<string, boolean>;
}

const RadioGroupComponent: NodeEntity<JsonSchemaString, RadioGroupProps> = ({
    input,
    meta,
    props,
    schema,
}) => {
    const {name, onBlur, onChange, onFocus, value} = input;
    const {enumDescriptions, optionsDisabled, direction = 'horizontal', ...restEntityProps} = props;

    const options: UIKitRadioGroupOption[] | undefined = React.useMemo(
        () =>
            schema.enum?.map((value) => ({
                value,
                content: enumDescriptions?.[value] || value,
                disabled: optionsDisabled?.[value],
            })),
        [enumDescriptions, optionsDisabled, schema.enum],
    );

    return (
        <EntityContainer
            stretch="fit"
            className={b({error: getBooleanValidationState(meta), direction})}
            justifyContent="center"
        >
            <UIKitRadioGroup
                options={options}
                disabled={schema.readOnly}
                {...restEntityProps}
                value={value}
                onFocus={onFocus}
                onBlur={onBlur}
                onUpdate={onChange}
                direction={direction}
                qa={name}
            />
        </EntityContainer>
    );
};

export const RadioGroup = React.memo(RadioGroupComponent);
