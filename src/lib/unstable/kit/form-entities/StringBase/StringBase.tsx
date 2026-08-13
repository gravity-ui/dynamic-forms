import React from 'react';

import {TextInput, type TextInputProps} from '@gravity-ui/uikit';

import type {JsonSchemaString, NodeEntity} from '../../../core';
import {EntityContainer} from '../../components';
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

const StringBaseComponent: NodeEntity<JsonSchemaString, StringBaseProps> = ({
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

export const StringBase = React.memo(StringBaseComponent);
