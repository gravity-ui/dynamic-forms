import React from 'react';

import {StringSpec} from '../../../../core';
import {divide, multiply} from '../../../utils';

export const useInitial = (value: string, spec: StringSpec, deps: any[] = []) => {
    const initial = React.useMemo(() => {
        const {defaultType, viewType, scale} = spec.viewSpec.sizeParams!;

        const correctValue = divide(value, value) !== null;
        let initialType = defaultType;
        let initialValue = value;

        if (viewType) {
            if (correctValue) {
                if (BigInt(scale[viewType].factor) > BigInt(scale[initialType].factor)) {
                    initialValue = divide(
                        value,
                        divide(scale[viewType].factor, scale[initialType].factor)!,
                        2,
                    )!;
                } else {
                    initialValue = multiply(
                        value,
                        divide(scale[initialType].factor, scale[viewType].factor)!,
                        2,
                    )!;
                }
            }

            initialType = viewType;
        }

        if (correctValue) {
            Object.keys(scale).forEach((key) => {
                if (BigInt(scale[key].factor) > BigInt(scale[initialType].factor)) {
                    const candidate = divide(
                        value,
                        divide(scale[key].factor, scale[defaultType].factor)!,
                        2,
                    )!;

                    if (candidate !== null && BigInt(candidate.split('.')[0]) >= BigInt(1)) {
                        initialType = key;
                        initialValue = candidate;
                    }
                }
            });
        }

        return {initialType, initialValue};
    }, deps);

    return initial;
};
