import React from 'react';

import {Popover, Text} from '@gravity-ui/uikit';

import {ArrayView} from '../../../../core';
import {block} from '../../../utils';
import {COMMON_POPOVER_PLACEMENT} from '../../../constants/common';

import './MultiSelectView.scss';

const b = block('multiselect-view');

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
                    placement={COMMON_POPOVER_PLACEMENT}
                    content={item}
                    className={b('popover')}
                    disabled={item.length < 51}
                    hasArrow={true}
                    key={item}
                >
                    <Text className={b('item')}>{item}</Text>
                </Popover>
            ))}
        </React.Fragment>
    );
};
