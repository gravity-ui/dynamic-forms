import React from 'react';

import {FormValue, Spec, ViewLayoutProps} from '../../../../core';
import {block, isNotEmptyValue} from '../../../utils';

import './ViewRow2.scss';

const b = block('view-row2');

const isNextNodeNotViewRow2 = (node: HTMLDivElement | null) =>
    Boolean(node?.nextElementSibling) &&
    !node?.nextElementSibling?.className.includes('df-view-row2');

export const ViewRow2 = <T extends FormValue, S extends Spec>({
    value,
    spec,
    children,
}: ViewLayoutProps<T, S>) => {
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (
            isNextNodeNotViewRow2(ref.current) &&
            !ref.current?.className.includes('df-view-row2_next-not-row')
        ) {
            ref.current?.classList.add('df-view-row2_next-not-row');
        }
    });

    if (!isNotEmptyValue(value, spec)) {
        return null;
    }

    return (
        <div ref={ref} className={b({'next-not-row': isNextNodeNotViewRow2(ref.current)})}>
            <div className={b('left')}>
                <div className={b('title')} title={spec.viewSpec.layoutTitle}>
                    {spec.viewSpec.layoutTitle}
                </div>
            </div>
            <div className={b('right')}>{children}</div>
        </div>
    );
};
