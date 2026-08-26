import React from 'react';

import {TextInput, type TextInputProps} from '@gravity-ui/uikit';

import type {JsonSchemaString, NodeEntity} from '../../../core';
import {EntityContainer} from '../../components';
import {block, getBooleanValidationState, getValidationState} from '../../utils';

import './StringInput.scss';

const b = block('string-input');

export interface StringInputProps
    extends Omit<
        TextInputProps,
        | 'type'
        | 'value'
        | 'onFocus'
        | 'onBlur'
        | 'onChange'
        | 'onUpdate'
        | 'errorMessage'
        | 'validationState'
        | 'qa'
    > {}

export const StringInput: NodeEntity<JsonSchemaString, StringInputProps> = ({
    input,
    meta,
    props,
    schema,
}) => {
    return (
        <EntityContainer stretch="max" className={b({error: getBooleanValidationState(meta)})}>
            <TextInput
                placeholder={schema.examples?.[0]}
                disabled={schema.readOnly}
                hasClear
                {...props}
                value={input.value ?? ''}
                onFocus={input.onFocus}
                onBlur={input.onBlur}
                onUpdate={input.onChange}
                errorMessage={undefined}
                validationState={getValidationState(meta)}
                qa={input.name}
                type="text"
            />
        </EntityContainer>
    );
};
