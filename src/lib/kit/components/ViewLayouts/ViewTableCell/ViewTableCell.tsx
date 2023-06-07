import React from 'react';

import {FormValue, Spec, ViewLayoutProps} from '../../../../core';
import {CopyButton} from '../../../../kit';
import {block, isNotEmptyValue} from '../../../utils';

import './ViewTableCell.scss';

const b = block('view-table-cell');

export const ViewTableCell = <T extends FormValue, S extends Spec>({
    value,
    spec,
    children,
}: ViewLayoutProps<T, S>): JSX.Element => {
    const empty = isNotEmptyValue(value, spec);

    return (
        <div className={b()}>
            {empty ? (
                <React.Fragment>
                    <div className={b('inner')}>{children}</div>
                    <CopyButton spec={spec} value={value} />
                </React.Fragment>
            ) : (
                '—'
            )}
        </div>
    );
};
