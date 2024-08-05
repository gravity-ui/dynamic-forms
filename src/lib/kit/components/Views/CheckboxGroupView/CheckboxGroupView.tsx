import React from 'react';

import {Popover} from '@gravity-ui/uikit';
import {COMMON_POPOVER_PLACEMENT} from '../../../constants/common';
import {ArrayView} from '../../../../core';
import {block} from '../../../utils';

import './CheckboxGroupView.scss';

const b = block('checkbox-group-view');

export const CheckboxGroupView: ArrayView = ({spec, value = []}) => {
    const _value = value as string[];

    const items = React.useMemo(
        () => _value.map((item) => spec.description?.[item] || item),
        [spec.description, _value],
    );

    const verticalPlacement = React.useMemo(
        () => spec.viewSpec.checkboxGroupParams?.placement === 'vertical',
        [spec.viewSpec.checkboxGroupParams?.placement],
    );

    return (
        <div className={b({vertical: verticalPlacement})}>
            {items.map((item, idx) => (
                <Popover
                    placement={COMMON_POPOVER_PLACEMENT}
                    key={item}
                    content={item}
                    className={b('tooltip-container')}
                    contentClassName={b('tooltip')}
                    disabled={item.length < 51}
                >
                    {item}
                    {!verticalPlacement && idx !== items.length - 1 ? ', ' : null}
                </Popover>
            ))}
        </div>
    );
};
