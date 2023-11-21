import React from 'react';

import _ from 'lodash';

import {DynamicFormMutators, SpecMutator} from '../types';

export const useMutators = (externalMutators?: DynamicFormMutators) => {
    const firstRenderRef = React.useRef(true);
    const [store, setStore] = React.useState<DynamicFormMutators>(externalMutators || {});

    const mutateDFState = React.useCallback(
        (mutators: DynamicFormMutators) => {
            const mergeSpec = (a: Record<string, SpecMutator>, b: Record<string, SpecMutator>) => {
                const result = _.cloneDeep(a);

                const getKeys = (parent: any): string[][] => {
                    if (_.isObjectLike(parent)) {
                        return _.keys(parent).reduce((acc: string[][], parentKey) => {
                            const childKeys = getKeys(parent[parentKey]);

                            return [
                                ...acc,
                                ...(childKeys.length ? [] : [[parentKey]]),
                                ...childKeys.map((childKey) => [parentKey, ...childKey]),
                            ];
                        }, []);
                    }

                    return [];
                };

                getKeys(b).forEach((key) => {
                    _.set(result, key, _.get(b, key));
                });

                return result;
            };

            setStore((store) => ({
                ...store,
                ...(mutators.errors ? {errors: _.merge(store.errors, mutators.errors)} : {}),
                ...(mutators.values ? {values: _.merge(store.values, mutators.values)} : {}),
                ...(mutators.spec ? {spec: mergeSpec(store.spec || {}, mutators.spec)} : {}),
            }));
        },
        [setStore],
    );

    React.useEffect(() => {
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
        } else if (externalMutators) {
            mutateDFState(externalMutators);
        }
    }, [externalMutators]);

    return {mutators: store, mutateDFState};
};
