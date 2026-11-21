import React from 'react';

import {TextInput, type TextInputProps} from '@gravity-ui/uikit';

import type {JsonSchemaString, NodeEntity} from '../../../core';
import {EntityContainer} from '../../components';
import {block, getBooleanValidationState, getValidationState} from '../../utils';
import {getQaBase} from '../../utils/qa';

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
    settings,
}) => {
    const qaBase = getQaBase(input.name, schema);
    const {disabled} = schema.nodeParameters?.flags || {};

    return (
        <EntityContainer width="max" className={b({error: getBooleanValidationState(meta)})}>
            <TextInput
                placeholder={schema.examples?.[0]}
                disabled={disabled || schema.readOnly}
                hasClear
                size={settings?.size}
                {...props}
                value={input.value ?? ''}
                onFocus={input.onFocus}
                onBlur={input.onBlur}
                onUpdate={input.onChange}
                errorMessage={undefined}
                validationState={getValidationState(meta)}
                qa={qaBase}
                type="text"
            />
        </EntityContainer>
    );
};
