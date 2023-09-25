import React from 'react';

import {TextArea as TextAreaBase} from '@gravity-ui/uikit';

import {StringInput} from '../../../../core';
import {block} from '../../../utils';
import {GenerateRandomValueButton} from '../../GenerateRandomValueButton';

import './TextArea.scss';

const b = block('text-area');

export const TextArea: StringInput = ({name, input, spec}) => {
    const {value, onBlur, onChange, onFocus} = input;

    return (
        <div className={b()}>
            <TextAreaBase
                value={value}
                onBlur={onBlur}
                onFocus={onFocus}
                onUpdate={onChange}
                maxRows={20}
                minRows={8}
                hasClear
                disabled={spec.viewSpec.disabled}
                placeholder={spec.viewSpec.placeholder}
                qa={name}
            />
            <GenerateRandomValueButton spec={spec} onChange={onChange} />
        </div>
    );
};
