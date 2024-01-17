import React from 'react';

import _ from 'lodash';

import {FormValue} from '../../../types';
import {
    BaseValidateError,
    DynamicFormMutators,
    DynamicFormMutatorsStore,
    SpecMutator,
} from '../types';

export const useMutators = (externalMutators?: DynamicFormMutators) => {
    const merge = React.useCallback(
        (
            mutators: DynamicFormMutators,
            store: DynamicFormMutatorsStore,
        ): DynamicFormMutatorsStore => {
            const mergeSpec = (
                a: DynamicFormMutatorsStore['spec'] = {},
                b: Record<string, SpecMutator>,
            ) => {
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
                    _.set(result, [key[0], 'value', ...key.slice(1)], _.get(b, key));
                });

                return result;
            };

            const mergeValuesOrErrors = <T extends FormValue | BaseValidateError>(
                a: Record<string, {value: T}> = {},
                b: Record<string, T>,
            ) => {
                const result = _.cloneDeep(a);

                Object.keys(b).forEach((key) => {
                    _.set(result, [key, 'value'], b[key]);
                });

                return result;
            };

            return {
                ...store,
                ...(mutators.errors
                    ? {errors: mergeValuesOrErrors(store.errors, mutators.errors)}
                    : {}),
                ...(mutators.values
                    ? {values: mergeValuesOrErrors(store.values, mutators.values)}
                    : {}),
                ...(mutators.spec ? {spec: mergeSpec(store.spec, mutators.spec)} : {}),
            };
        },
        [],
    );

    const firstRenderRef = React.useRef(true);
    const [store, setStore] = React.useState<DynamicFormMutatorsStore>(
        merge(externalMutators || {}, {}),
    );

    const mutateDFState = React.useCallback(
        (mutators: DynamicFormMutators) => {
            setStore((store) => merge(mutators, store));
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

    return {mutatorsStore: store, mutateDFState};
};
