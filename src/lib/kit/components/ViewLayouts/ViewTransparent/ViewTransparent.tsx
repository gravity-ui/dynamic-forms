import React from 'react';

import {FormValue, Spec, ViewLayoutProps} from '../../../../core';
import {CopyButton} from '../../../../kit';
import {block, isNotEmptyValue} from '../../../utils';

import './ViewTransparent.scss';

const b = block('view-transparent');

export const ViewTransparent = <T extends FormValue, S extends Spec>({
    value,
    spec,
    children,
}: ViewLayoutProps<T, S>) =>
    isNotEmptyValue(value, spec) ? (
        <div className={b()}>
            <div>{children}</div>
            <CopyButton spec={spec} value={value} />
        </div>
    ) : null;
