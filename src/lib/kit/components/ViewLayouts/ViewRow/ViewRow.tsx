import React from 'react';

import {HelpMark, Text} from '@gravity-ui/uikit';

import type {FormValue, Spec, ViewLayoutProps} from '../../../../core';
import {useDynamicFormsCtx} from '../../../../core';
import {useRenderHtml} from '../../../../core/components/View/hooks/useRenderHtml';
import {CopyButton} from '../../../../kit';
import {COMMON_POPOVER_PLACEMENT} from '../../../constants/common';
import {block, isNotEmptyValue} from '../../../utils';
import {HTMLContent} from '../../HTMLContent';

import './ViewRow.scss';

const b = block('view-row');

export const ViewRow = <T extends FormValue, S extends Spec>({
    value,
    spec,
    children,
}: ViewLayoutProps<T, S>) => {
    const renderHtml = useRenderHtml();
    const {showLayoutDescription} = useDynamicFormsCtx();

    if (!isNotEmptyValue(value, spec)) {
        return null;
    }

    return (
        <div className={b()}>
            <div className={b('left')}>
                <Text whiteSpace="nowrap" color="secondary" ellipsis={true}>
                    {spec.viewSpec.layoutTitle}
                </Text>
                {showLayoutDescription && spec.viewSpec.layoutDescription ? (
                    <HelpMark
                        className={b('note')}
                        popoverProps={{
                            placement: COMMON_POPOVER_PLACEMENT,
                        }}
                    >
                        <HTMLContent html={spec.viewSpec.layoutDescription} />
                    </HelpMark>
                ) : null}
                <div className={b('dots')} />
            </div>
            <div className={b('right')}>{children}</div>
            <CopyButton spec={spec} value={value} />
        </div>
    );
};
