import React from 'react';

import {
    NumberInput as UIKitNumberInput,
    type NumberInputProps as UIKitNumberInputProps,
} from '@gravity-ui/uikit';

import {type JsonSchemaNumber, type NodeEntity} from '../../../core';
import {EntityContainer} from '../../components';
import {block, getBooleanValidationState, getValidationState} from '../../utils';

import './NumberInput.scss';

const b = block('number-input');

export interface NumberInputProps
    extends Omit<
        UIKitNumberInputProps,
        | 'value'
        | 'defaultValue'
        | 'onFocus'
        | 'onBlur'
        | 'onChange'
        | 'onUpdate'
        | 'errorMessage'
        | 'validationState'
        | 'qa'
    > {}

export const NumberInput: NodeEntity<JsonSchemaNumber, NumberInputProps> = ({
    input,
    meta,
    props,
    schema,
}) => {
    const {name, onBlur, onChange, onFocus, value} = input;

    return (
        <EntityContainer stretch="max" className={b({error: getBooleanValidationState(meta)})}>
            <UIKitNumberInput
                min={schema.minimum}
                max={schema.maximum}
                step={schema.multipleOf || 1}
                placeholder={`${schema.examples?.[0] || ''}`}
                disabled={schema.readOnly}
                allowDecimal
                hasClear
                {...props}
                value={value === undefined ? null : value}
                defaultValue={schema.default}
                onBlur={onBlur}
                onFocus={onFocus}
                onUpdate={onChange}
                errorMessage={undefined}
                validationState={getValidationState(meta)}
                qa={name}
            />
        </EntityContainer>
    );
};
