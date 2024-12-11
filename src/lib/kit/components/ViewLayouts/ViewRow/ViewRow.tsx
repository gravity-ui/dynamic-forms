import React from 'react';

import {Text} from '@gravity-ui/uikit';
import {HelpPopover} from '@gravity-ui/components';

import {FormValue, Spec, ViewLayoutProps, useDynamicFormsCtx} from '../../../../core';
import {CopyButton} from '../../../../kit';
import {block, isNotEmptyValue} from '../../../utils';

import './ViewRow.scss';

const b = block('view-row');

export const ViewRow = <T extends FormValue, S extends Spec>({
    value,
    spec,
    children,
    direction = 'vertical',
}: ViewLayoutProps<T, S> & {
    direction?: 'vertical' | 'horizontal';
}) => {
    const {showLayoutDescription} = useDynamicFormsCtx();

    if (!isNotEmptyValue(value, spec)) {
        return null;
    }

    return (
        <div className={b('', {direction})}>
            <div className={b('label', {direction})}>
                <Text whiteSpace="nowrap" color="secondary" ellipsis={true}>
                    {spec.viewSpec.layoutTitle}
                </Text>
                {showLayoutDescription && spec.viewSpec.layoutDescription ? (
                    <HelpPopover
                        className={b('note')}
                        htmlContent={spec.viewSpec.layoutDescription}
                        placement={['bottom', 'top']}
                    />
                ) : null}
                {direction === 'horizontal' && <div className={b('dots')} />}
            </div>
            <div className={b('value', {direction})}>{children}</div>
            <CopyButton spec={spec} value={value} />
        </div>
    );
};
