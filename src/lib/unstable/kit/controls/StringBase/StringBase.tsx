import React from 'react';

import {TextInput, type TextInputProps} from '@gravity-ui/uikit';

import type {Control, JsonSchemaString} from '../../../core';
import {getValidationState} from '../../utils';

export interface StringBaseProps
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
        | 'placeholder'
        | 'qa'
    > {}

const Component: Control<JsonSchemaString, StringBaseProps> = ({
    controlProps,
    input,
    meta,
    schema,
}) => {
    return (
        <TextInput
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
            type="text"
        />
    );
};

export const StringBase = React.memo(Component);
