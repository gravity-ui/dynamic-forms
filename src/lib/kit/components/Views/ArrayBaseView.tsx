import React from 'react';

import _ from 'lodash';

import {ArrayView, Spec, ViewController, isCorrectSpec} from '../../../core';

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

                return (
                    <ViewController
                        spec={itemSpec}
                        name={`${name}[${idx}]`}
                        key={`${name}[${idx}]`}
                    />
                );
            }),
        [value.length, name, getItemSpec],
    );

    if (!itemSpecCorrect) {
        return null;
    }

    return <>{items}</>;
};
