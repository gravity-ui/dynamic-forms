import React from 'react';

import {Popover} from '@gravity-ui/uikit';
import _ from 'lodash';

import {ArrayView, Spec, ViewController, isCorrectSpec} from '../../../../core';
import {COMMON_POPOVER_PLACEMENT} from '../../../constants/common';
import {block} from '../../../utils';

import './ArrayBaseView.scss';

const b = block('array-base-view');

export const ArrayBaseView: ArrayView = ({spec, name, value = []}) => {
    const itemSpecCorrect = React.useMemo(() => isCorrectSpec(spec.items), [spec.items]);

    const getItemSpec = React.useCallback(
        (idx: number): typeof spec.items | null => {
            if (!itemSpecCorrect) {
                return null;
            }

            const itemSpec = {...spec.items} as Spec;

            itemSpec.viewSpec = {
                ...itemSpec.viewSpec,
                layoutTitle: itemSpec.viewSpec.layoutTitle
                    ? `${itemSpec.viewSpec.layoutTitle} ${idx + 1}`
                    : `${idx + 1}`,
            };

            return itemSpec;
        },
        [spec.items, itemSpecCorrect],
    );

    const items = React.useMemo(
        () =>
            _.map(value, (__, idx) => {
                const itemSpec = getItemSpec(idx);

                if (!itemSpec) {
                    return null;
                }

                const itemPrefixWidth =
                    document.getElementById(`${idx}-item-prefix`)?.offsetWidth || 0;
                const itemPrefix = idx === 0 ? null : spec.viewSpec.itemPrefix;
                const itemPrefixShowPopover = itemPrefixWidth < 42;

                if (spec.viewSpec.itemPrefix) {
                    return (
                        <div className={b('item-wrapper')} key={`${name}[${idx}]`}>
                            <Popover
                                placement={COMMON_POPOVER_PLACEMENT}
                                content={itemPrefix}
                                className={b('item-prefix')}
                                contentClassName={b('item-prefix-tooltip')}
                                disabled={itemPrefixShowPopover}
                            >
                                <span
                                    id={`${idx}-item-prefix`}
                                    className={b('item-prefix-text', {
                                        'long-value': !itemPrefixShowPopover,
                                    })}
                                >
                                    {itemPrefix}
                                </span>
                            </Popover>
                            <ViewController spec={itemSpec} name={`${name}[${idx}]`} />
                        </div>
                    );
                }

                return (
                    <ViewController
                        spec={itemSpec}
                        name={`${name}[${idx}]`}
                        key={`${name}[${idx}]`}
                    />
                );
            }),
        [value.length, name, getItemSpec, spec.viewSpec.itemPrefix],
    );

    if (!itemSpecCorrect) {
        return null;
    }

    return <>{items}</>;
};
