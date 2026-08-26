import React from 'react';

import {ClipboardButton} from '@gravity-ui/uikit';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';

import {block} from '../../utils';

import './CopyButton.scss';

const b = block('copy-button');

export interface CopyButtonProps {
    className?: string;
    copy?: boolean;
    value: unknown;
}

export const CopyButton: React.FC<CopyButtonProps> = ({className, copy, value}) => {
    if (copy && (isString(value) || isNumber(value))) {
        return (
            <div className={b(null, className)}>
                <ClipboardButton text={String(value)} view="flat" size="s" />
            </div>
        );
    }

    return null;
};
