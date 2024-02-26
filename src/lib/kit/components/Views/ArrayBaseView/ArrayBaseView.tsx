import React from 'react';

import {Label} from '@gravity-ui/uikit';
import map from 'lodash/map';

import {ArrayView, Spec, ViewController, isCorrectSpec} from '../../../../core';
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
            map(value, (__, idx) => {
                const itemSpec = getItemSpec(idx);

                if (!itemSpec) {
                    return null;
                }

                const showItemPrefix = idx !== 0 && spec.viewSpec.itemPrefix;

                return (
                    <React.Fragment key={`${name}[${idx}]`}>
                        {showItemPrefix ? (
                            <Label size="m" className={b('item-prefix')}>
                                {spec.viewSpec.itemPrefix}
                            </Label>
                        ) : null}
                        <ViewController spec={itemSpec} name={`${name}[${idx}]`} />
                    </React.Fragment>
                );
            }),
        [value.length, name, getItemSpec, spec.viewSpec.itemPrefix],
    );

    if (!itemSpecCorrect) {
        return null;
    }

    return <React.Fragment>{items}</React.Fragment>;
};
