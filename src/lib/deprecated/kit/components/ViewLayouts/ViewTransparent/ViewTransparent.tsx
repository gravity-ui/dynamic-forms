import React from 'react';

import {CopyButton} from '../../..';
import type {FormValue, Spec, ViewLayoutProps} from '../../../../core';
import {block, isNotEmptyValue} from '../../../utils';

import './ViewTransparent.scss';

const b = block('view-transparent');

/** @deprecated Use the SchemaRenderer API. */
export const ViewTransparent = <T extends FormValue, S extends Spec>({
    value,
    spec,
    children,
}: ViewLayoutProps<T, S>) =>
    isNotEmptyValue(value, spec) ? (
        <div className={b()}>
            <div className={b('inner')}>{children}</div>
            <CopyButton spec={spec} value={value} />
        </div>
    ) : null;
