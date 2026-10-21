import React from 'react';

import {ClipboardButton} from '@gravity-ui/uikit';

import type {FormValue, Spec} from '../../../core';
import {isNumberSpec, isStringSpec} from '../../../core';
import {block} from '../../utils';

import './CopyButton.scss';

const b = block('copy-button');

/** @deprecated Use the SchemaRenderer API. */
export interface CopyButtonProps {
    spec: Spec;
    value: FormValue;
}

/**
 *
 * Use the with-copy-button scss mixin for visible on hover
 * @deprecated Part of the deprecated DynamicField API. Use SchemaRenderer from @gravity-ui/dynamic-forms for new forms.
 */

export const CopyButton: React.FC<CopyButtonProps> = ({spec, value}) => {
    if ((isStringSpec(spec) || isNumberSpec(spec)) && spec.viewSpec.copy) {
        return (
            <div className={b()}>
                <ClipboardButton className={b('button')} text={`${value}`} size="xs" />
            </div>
        );
    }

    return null;
};
