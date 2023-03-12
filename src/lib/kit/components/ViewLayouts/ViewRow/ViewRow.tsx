import React from 'react';

import {FormValue, Spec, ViewLayoutProps} from '../../../../core';
import {block, isNotEmptyValue} from '../../../utils';

import './ViewRow.scss';

const b = block('view-row');

export const ViewRow = <T extends FormValue, S extends Spec>({
    value,
    spec,
    children,
}: ViewLayoutProps<T, S>) => {
    if (!isNotEmptyValue(value, spec)) {
        return null;
    }

    return (
        <div className={b()}>
            <div className={b('left')}>
                <div className={b('title')} title={spec.viewSpec.layoutTitle}>
                    {spec.viewSpec.layoutTitle}
                </div>
                <div className={b('dots')} />
            </div>
            <div className={b('right')}>{children}</div>
        </div>
    );
};
