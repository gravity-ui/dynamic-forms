import React from 'react';

import type {CheckboxProps as CheckboxBaseProps} from '@gravity-ui/uikit';
import {Checkbox as CheckboxBase} from '@gravity-ui/uikit';

import type {Control, JsonSchemaBoolean} from '../../../core';
import {ControlError} from '../../components';
import {block, getValidationState} from '../../utils';

import './Checkbox.scss';

const b = block('checkbox');

export interface CheckboxProps
    extends Omit<
        CheckboxBaseProps,
        'checked' | 'onFocus' | 'onBlur' | 'onChange' | 'onUpdate' | 'qa'
    > {}

const Component: Control<JsonSchemaBoolean, CheckboxProps> = ({
    controlProps,
    input,
    meta,
    schema,
}) => {
    return (
        <ControlError errorMessage={meta.error} validationState={getValidationState(meta)}>
            <div className={b()}>
                <CheckboxBase
                    disabled={schema.readOnly}
                    {...controlProps}
                    className={b()}
                    checked={input.value ?? false}
                    onFocus={input.onFocus}
                    onBlur={input.onBlur}
                    onUpdate={input.onChange}
                    qa={input.name}
                />
            </div>
        </ControlError>
    );
};

export const Checkbox = React.memo(Component);
