import React from 'react';

import {FormValue, Spec, ViewLayoutProps} from '../../../../core';
import {block, isNotEmptyValue} from '../../../utils';

import './ViewTableCell.scss';

const b = block('view-table-cell');

export const ViewTableCell = <T extends FormValue, S extends Spec>({
    value,
    spec,
    children,
}: ViewLayoutProps<T, S>): JSX.Element => (
    <div className={b()}>{isNotEmptyValue(value, spec) ? children : '—'}</div>
);
