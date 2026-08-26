import React from 'react';

import {TextArea, type TextAreaProps} from '@gravity-ui/uikit';

import {type JsonSchemaString, type NodeEntity} from '../../../core';
import {EntityContainer} from '../../components';
import {block, getBooleanValidationState, getValidationState} from '../../utils';

import './TextAreaInput.scss';

const b = block('text-area-input');

export interface TextAreaInputProps
    extends Omit<
        TextAreaProps,
        | 'value'
        | 'onFocus'
        | 'onBlur'
        | 'onChange'
        | 'onUpdate'
        | 'errorMessage'
        | 'validationState'
        | 'qa'
    > {}

export const TextAreaInput: NodeEntity<JsonSchemaString, TextAreaInputProps> = ({
    input,
    meta,
    props,
    schema,
}) => {
    return (
        <EntityContainer stretch="max" className={b({error: getBooleanValidationState(meta)})}>
            <TextArea
                maxRows={20}
                minRows={0}
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
            />
        </EntityContainer>
    );
};
