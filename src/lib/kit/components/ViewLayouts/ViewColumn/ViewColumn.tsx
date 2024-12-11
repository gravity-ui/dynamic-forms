import React from 'react';

import {Text} from '@gravity-ui/uikit';
import {HelpPopover} from '@gravity-ui/components';

import {FormValue, Spec, ViewLayoutProps, useDynamicFormsCtx} from '../../../../core';
import {CopyButton} from '../../../../kit';
import {block, isNotEmptyValue} from '../../../utils';

import './ViewColumn.scss';

const b = block('view-column');

export const ViewColumn = <T extends FormValue, S extends Spec>({
    value,
    spec,
    children,
}: ViewLayoutProps<T, S>) => {
    const {showLayoutDescription} = useDynamicFormsCtx();

    if (!isNotEmptyValue(value, spec)) {
        return null;
    }

    return (
        <div className={b()}>
            <div className={b('first-row')}>
                <Text color="secondary" ellipsis={true}>
                    {spec.viewSpec.layoutTitle}
                </Text>
                {showLayoutDescription && spec.viewSpec.layoutDescription ? (
                    <HelpPopover
                        className={b('note')}
                        htmlContent={spec.viewSpec.layoutDescription}
                        placement={['bottom', 'top']}
                    />
                ) : null}
            </div>
            <div className={b('second-row')}>{children}</div>
            <CopyButton spec={spec} value={value} />
        </div>
    );
};
