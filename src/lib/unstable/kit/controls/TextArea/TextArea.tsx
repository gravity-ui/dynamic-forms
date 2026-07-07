import React from 'react';

import {
    TextArea as UIKitTextArea,
    type TextAreaProps as UIKitTextAreaProps,
} from '@gravity-ui/uikit';

import type {Control, JsonSchemaString} from '../../../core';
import {getValidationState} from '../../utils';

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
        | 'placeholder'
        | 'qa'
    > {}

const Component: Control<JsonSchemaString, TextAreaProps> = ({
    controlProps,
    input,
    meta,
    schema,
}) => {
    return (
        <UIKitTextArea
            maxRows={20}
            minRows={0}
            hasClear
            disabled={schema.readOnly}
            {...controlProps}
            value={input.value ?? ''}
            onFocus={input.onFocus}
            onBlur={input.onBlur}
            onUpdate={input.onChange}
            errorMessage={meta.error}
            validationState={getValidationState(meta)}
            placeholder={schema.examples?.[0]}
            qa={input.name}
        />
    );
};

export const TextArea = React.memo(Component);
