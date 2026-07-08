import React from 'react';

import {TextInput, type TextInputProps} from '@gravity-ui/uikit';

import type {Control, JsonSchemaString} from '../../../core';
import {ControlContainer} from '../../components';
import {block, getBooleanValidationState, getValidationState} from '../../utils';

import './StringBase.scss';

const b = block('string-base');

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
        | 'qa'
    > {}

const Component: Control<JsonSchemaString, StringBaseProps> = ({
    controlProps,
    input,
    meta,
    schema,
}) => {
    return (
        <ControlContainer stretch="max" className={b({error: getBooleanValidationState(meta)})}>
            <TextInput
                placeholder={schema.examples?.[0]}
                disabled={schema.readOnly}
                hasClear
                {...controlProps}
                value={input.value ?? ''}
                onFocus={input.onFocus}
                onBlur={input.onBlur}
                onUpdate={input.onChange}
                errorMessage={undefined}
                validationState={getValidationState(meta)}
                qa={input.name}
                type="text"
            />
        </ControlContainer>
    );
};

export const StringBase = React.memo(Component);
