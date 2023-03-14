import React from 'react';

import {FormValue, Spec, ViewLayoutProps} from '../../../../core';
import {block, isNotEmptyValue} from '../../../utils';

import './ViewTransparent.scss';

const b = block('view-transparent');

export const ViewTransparent = <T extends FormValue, S extends Spec>({
    value,
    spec,
    children,
}: ViewLayoutProps<T, S>) =>
    isNotEmptyValue(value, spec) ? <div className={b()}>{children}</div> : null;
