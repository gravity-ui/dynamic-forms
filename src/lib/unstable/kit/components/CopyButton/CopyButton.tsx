import React from 'react';

import {ClipboardButton} from '@gravity-ui/uikit';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';

import {type JsonSchema, SchemaRendererMode, type SchemaRendererSettings} from '../../../core';
import {block} from '../../utils';

import './CopyButton.scss';

const b = block('copy-button');

export interface CopyButtonProps {
    className?: string;
    mode: SchemaRendererMode;
    schema: JsonSchema;
    size?: SchemaRendererSettings['size'];
    value: unknown;
}

export const CopyButton: React.FC<CopyButtonProps> = ({className, mode, schema, size, value}) => {
    const {copy} = schema.nodeParameters?.flags || {};
    const overviewFlag = mode === SchemaRendererMode.Overview;

    if (copy && (isString(value) || isNumber(value)) && overviewFlag) {
        return (
            <div className={b({size}, className)}>
                <ClipboardButton
                    text={String(value)}
                    view="flat"
                    size={size === 'xl' ? 'm' : 's'}
                />
            </div>
        );
    }

    return null;
};
