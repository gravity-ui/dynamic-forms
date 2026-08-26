import React from 'react';

import {ClipboardButton} from '@gravity-ui/uikit';
import {isNumber, isString} from 'lodash';

import {block} from '../../utils';

import './CopyButton.scss';

const b = block('copy-button');

export interface CopyButtonProps {
    className?: string;
    copy?: boolean;
    value: unknown;
}

const CopyButtonComponent: React.FC<CopyButtonProps> = ({className, copy, value}) => {
    if (copy && (isString(value) || isNumber(value))) {
        return (
            <div className={b(null, className)}>
                <ClipboardButton text={String(value)} view="flat" size="s" />
            </div>
        );
    }

    return null;
};

export const CopyButton = React.memo(CopyButtonComponent);
