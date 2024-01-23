import React from 'react';

import {Text} from '@gravity-ui/uikit';

import {FormValue, Spec, ViewLayoutProps} from '../../../../core';
import {CopyButton} from '../../../../kit';
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
                <Text whiteSpace="nowrap" color="secondary" ellipsis={true}>
                    {spec.viewSpec.layoutTitle}
                </Text>
                <div className={b('dots')} />
            </div>
            <div className={b('right')}>{children}</div>
            <CopyButton spec={spec} value={value} />
        </div>
    );
};
