import React from 'react';

import {ClipboardButton} from '@gravity-ui/uikit';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';

import {SchemaRendererMode, useSchemaRendererNodeContext} from '../../../core';
import {block} from '../../utils';

import './CopyButton.scss';

const b = block('copy-button');

export interface CopyButtonProps {
    className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({className}) => {
    const {input, mode, schema, settings} = useSchemaRendererNodeContext();

    const {copy} = schema.nodeParameters?.flags || {};
    const overviewFlag = mode === SchemaRendererMode.Overview;

    if (copy && (isString(input.value) || isNumber(input.value)) && overviewFlag) {
        return (
            <div className={b({size: settings?.size}, className)}>
                <ClipboardButton
                    text={String(input.value)}
                    view="flat"
                    size={settings?.size === 'xl' ? 'm' : 's'}
                />
            </div>
        );
    }

    return null;
};
