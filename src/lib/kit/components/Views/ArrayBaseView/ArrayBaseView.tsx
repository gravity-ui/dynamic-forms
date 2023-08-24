import React from 'react';

import {Label, Popover} from '@gravity-ui/uikit';
import _ from 'lodash';

import {ArrayView, Spec, ViewController, isCorrectSpec} from '../../../../core';
import {COMMON_POPOVER_PLACEMENT} from '../../../constants/common';
import {block} from '../../../utils';

import './ArrayBaseView.scss';

const b = block('array-base-view');

export const ArrayBaseView: ArrayView = ({spec, name, value = []}) => {
    const [disabledPopover, setDisabledPopover] = React.useState(false);

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

                const itemPrefix = idx === 0 ? null : spec.viewSpec.itemPrefix;

                if (spec.viewSpec.itemPrefix) {
                    return (
                        <React.Fragment key={`${name}[${idx}]`}>
                            {itemPrefix ? (
                                <Popover
                                    placement={COMMON_POPOVER_PLACEMENT}
                                    content={itemPrefix}
                                    className={b('item-prefix')}
                                    contentClassName={b('item-prefix-tooltip')}
                                    disabled={disabledPopover}
                                >
                                    <Label size="m">
                                        <div
                                            id={`${idx}-item-prefix`}
                                            className={b('item-prefix-text', {
                                                'long-value': !disabledPopover,
                                            })}
                                        >
                                            {itemPrefix}
                                        </div>
                                    </Label>
                                </Popover>
                            ) : null}
                            <span className={b('view-controller')}>
                                <ViewController spec={itemSpec} name={`${name}[${idx}]`} />
                            </span>
                        </React.Fragment>
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
        [value.length, name, getItemSpec, spec.viewSpec.itemPrefix, disabledPopover],
    );

    React.useEffect(() => {
        if (spec.viewSpec.itemPrefix) {
            const width = document.getElementById(`1-item-prefix`)?.offsetWidth || 0;

            setDisabledPopover(width < 280);
        }
    }, [spec.viewSpec.itemPrefix, value]);

    if (!itemSpecCorrect) {
        return null;
    }

    return <React.Fragment>{items}</React.Fragment>;
};
