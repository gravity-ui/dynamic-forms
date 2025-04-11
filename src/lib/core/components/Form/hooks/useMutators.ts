import React from 'react';

import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import isObjectLike from 'lodash/isObjectLike';
import keys from 'lodash/keys';
import set from 'lodash/set';

import type {FormValue} from '../../../types';
import type {
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
                const result = cloneDeep(a);

                const getKeys = (parent: any): string[][] => {
                    if (isObjectLike(parent) && !Array.isArray(parent)) {
                        return keys(parent).reduce((acc: string[][], parentKey) => {
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
                    set(result, [key[0], 'value', ...key.slice(1)], get(b, key));
                });

                return result;
            };

            const mergeValuesOrErrors = <T extends FormValue | BaseValidateError>(
                a: Record<string, {value: T}> = {},
                b: Record<string, T>,
            ) => {
                const result = cloneDeep(a);

                Object.keys(b).forEach((key) => {
                    set(result, [key, 'value'], b[key]);
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
