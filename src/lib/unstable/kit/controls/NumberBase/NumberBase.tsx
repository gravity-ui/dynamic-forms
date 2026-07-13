import React from 'react';

import {NumberInput, type NumberInputProps} from '@gravity-ui/uikit';

import {type Control, type JsonSchemaNumber} from '../../../core';
import {ControlContainer} from '../../components';
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

const Component: Control<JsonSchemaNumber, NumberBaseProps> = ({
    controlProps,
    input,
    meta,
    schema,
}) => {
    const {name, onBlur, onChange, onFocus, value} = input;

    return (
        <ControlContainer stretch="max" className={b({error: getBooleanValidationState(meta)})}>
            <NumberInput
                min={schema.minimum}
                max={schema.maximum}
                step={schema.multipleOf || 1}
                placeholder={`${schema.examples?.[0] || ''}`}
                disabled={schema.readOnly}
                allowDecimal
                hasClear
                {...controlProps}
                value={value}
                defaultValue={schema.default}
                onBlur={onBlur}
                onFocus={onFocus}
                onUpdate={onChange}
                errorMessage={undefined}
                validationState={getValidationState(meta)}
                qa={name}
            />
        </ControlContainer>
    );
};

export const NumberBase = React.memo(Component);
