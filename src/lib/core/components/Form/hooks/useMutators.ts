import React from 'react';

import _ from 'lodash';

import {DynamicFormMutators} from '../types';

export const useMutators = (externalMutators?: DynamicFormMutators) => {
    const firstRenderRef = React.useRef(true);
    const [store, setStore] = React.useState<DynamicFormMutators>(externalMutators || {});

    const mutateDFState = React.useCallback(
        (mutators: DynamicFormMutators) => {
            setStore((store) => ({
                ...store,
                ...(mutators.errors ? {errors: _.merge(store.errors, mutators.errors)} : {}),
                ...(mutators.values ? {values: _.merge(store.values, mutators.values)} : {}),
                ...(mutators.spec ? {spec: _.merge(store.spec, mutators.spec)} : {}),
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
