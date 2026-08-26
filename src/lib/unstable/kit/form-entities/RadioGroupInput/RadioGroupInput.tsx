import React from 'react';

import {RadioGroup, type RadioGroupOption, type RadioGroupProps} from '@gravity-ui/uikit';

import type {JsonSchemaString, NodeEntity} from '../../../core';
import {EntityContainer} from '../../components';
import {block, getBooleanValidationState} from '../../utils';

import './RadioGroupInput.scss';

const b = block('radio-group-input');

export interface RadioGroupInputProps
    extends Omit<RadioGroupProps, 'value' | 'onFocus' | 'onBlur' | 'onChange' | 'onUpdate' | 'qa'> {
    enumDescriptions?: Record<string, string>;
    optionsDisabled?: Record<string, boolean>;
}

export const RadioGroupInput: NodeEntity<JsonSchemaString, RadioGroupInputProps> = ({
    input,
    meta,
    props,
    schema,
}) => {
    const {name, onBlur, onChange, onFocus, value} = input;
    const {enumDescriptions, optionsDisabled, direction = 'horizontal', ...restEntityProps} = props;

    const options: RadioGroupOption[] | undefined = React.useMemo(
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
            <RadioGroup
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
