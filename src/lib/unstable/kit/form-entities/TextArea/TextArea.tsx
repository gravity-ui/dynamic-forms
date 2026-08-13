import React from 'react';

import {
    TextArea as UIKitTextArea,
    type TextAreaProps as UIKitTextAreaProps,
} from '@gravity-ui/uikit';

import {type JsonSchemaString, type NodeEntity} from '../../../core';
import {EntityContainer} from '../../components';
import {block, getBooleanValidationState, getValidationState} from '../../utils';

import './TextArea.scss';

const b = block('text-area');

export interface TextAreaProps
    extends Omit<
        UIKitTextAreaProps,
        | 'value'
        | 'onFocus'
        | 'onBlur'
        | 'onChange'
        | 'onUpdate'
        | 'errorMessage'
        | 'validationState'
        | 'qa'
    > {}

const TextAreaComponent: NodeEntity<JsonSchemaString, TextAreaProps> = ({
    input,
    meta,
    props,
    schema,
}) => {
    return (
        <EntityContainer stretch="max" className={b({error: getBooleanValidationState(meta)})}>
            <UIKitTextArea
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

export const TextArea = React.memo(TextAreaComponent);
