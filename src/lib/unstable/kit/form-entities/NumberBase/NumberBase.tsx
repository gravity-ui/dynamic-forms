import React from 'react';

import {NumberInput, type NumberInputProps} from '@gravity-ui/uikit';

import {type JsonSchemaNumber, type NodeEntity} from '../../../core';
import {EntityContainer} from '../../components';
import {block, getBooleanValidationState, getValidationState} from '../../utils';

import './NumberBase.scss';

const b = block('number-base');

export interface NumberBaseProps
    extends Omit<
        NumberInputProps,
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

const NumberBaseComponent: NodeEntity<JsonSchemaNumber, NumberBaseProps> = ({
    input,
    meta,
    props,
    schema,
}) => {
    const {name, onBlur, onChange, onFocus, value} = input;

    return (
        <EntityContainer stretch="max" className={b({error: getBooleanValidationState(meta)})}>
            <NumberInput
                min={schema.minimum}
                max={schema.maximum}
                step={schema.multipleOf || 1}
                placeholder={`${schema.examples?.[0] || ''}`}
                disabled={schema.readOnly}
                allowDecimal
                hasClear
                {...props}
                value={value}
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

export const NumberBase = React.memo(NumberBaseComponent);
