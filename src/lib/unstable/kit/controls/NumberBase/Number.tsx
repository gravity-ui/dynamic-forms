import React from 'react';

import {NumberInput, type NumberInputProps} from '@gravity-ui/uikit';

import {type Control, type JsonSchemaNumber} from '../../../core';
import {getValidationState} from '../../utils';

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
        | 'placeholder'
        | 'qa'
    > {}

const Component: Control<JsonSchemaNumber, NumberBaseProps> = ({
    controlProps,
    input,
    meta,
    schema,
}) => {
    return (
        <NumberInput
            allowDecimal
            hiddenControls
            hasClear
            disabled={schema.readOnly}
            {...controlProps}
            value={input.value}
            defaultValue={schema.default}
            onBlur={input.onBlur}
            onFocus={input.onFocus}
            onUpdate={input.onChange}
            errorMessage={meta.error}
            validationState={getValidationState(meta)}
            placeholder={`${schema.examples?.[0] || ''}`}
            qa={input.name}
        />
    );
};

export const NumberBase = React.memo(Component);
