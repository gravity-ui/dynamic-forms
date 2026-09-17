import React from 'react';

import {ClipboardButton} from '@gravity-ui/uikit';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';

import {type JsonSchema, SchemaRendererMode} from '../../../core';
import {block} from '../../utils';

import './CopyButton.scss';

const b = block('copy-button');

export interface CopyButtonProps {
    className?: string;
    mode: SchemaRendererMode;
    schema: JsonSchema;
    value: unknown;
}

export const CopyButton: React.FC<CopyButtonProps> = ({className, mode, schema, value}) => {
    const {copy} = schema.nodeParameters?.flags || {};
    const overviewFlag = mode === SchemaRendererMode.Overview;

    if (copy && (isString(value) || isNumber(value)) && overviewFlag) {
        return (
            <div className={b(null, className)}>
                <ClipboardButton text={String(value)} view="flat" size="s" />
            </div>
        );
    }

    return null;
};
