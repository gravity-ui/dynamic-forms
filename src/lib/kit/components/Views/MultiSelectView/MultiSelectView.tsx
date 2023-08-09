import React from 'react';

import {Popover, type PopoverProps} from '@gravity-ui/uikit';

import {ArrayView} from '../../../../core';
import {block} from '../../../utils';

import './MultiSelectView.scss';

const b = block('multiselect-view');

const POPOVER_PLACEMENT: PopoverProps['placement'] = ['bottom', 'top'];

export const MultiSelectView: ArrayView = ({spec, value = []}) => {
    const _value = value as string[];

    const items = React.useMemo(
        () => _value.map((item) => spec.description?.[item] || item),
        [spec.description, _value],
    );

    return (
        <React.Fragment>
            {items.map((item) => (
                <Popover
                    placement={POPOVER_PLACEMENT}
                    key={item}
                    content={item}
                    className={b('tooltip-container')}
                    contentClassName={b('tooltip')}
                    disabled={item.length < 51}
                >
                    {item}
                </Popover>
            ))}
        </React.Fragment>
    );
};
