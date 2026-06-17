import React from 'react';

import {Switch as SwitchBase, type SwitchProps as SwitchBaseProps} from '@gravity-ui/uikit';

import type {Control, JsonSchemaBoolean} from '../../../core';
import {ControlError} from '../../components';
import {block, getValidationState} from '../../utils';

import './Switch.scss';

const b = block('switch');

export interface SwitchProps
    extends Omit<
        SwitchBaseProps,
        'checked' | 'onFocus' | 'onBlur' | 'onChange' | 'onUpdate' | 'qa'
    > {}

const Component: Control<JsonSchemaBoolean, SwitchProps> = ({
    controlProps,
    input,
    schema,
    meta,
}) => {
    return (
        <ControlError errorMessage={meta.error} validationState={getValidationState(meta)}>
            <div>
                <SwitchBase
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

export const Switch = React.memo(Component);
